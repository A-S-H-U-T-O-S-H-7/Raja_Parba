import { NextResponse } from 'next/server';

const getBaseUrl = (request) => new URL(request.url).origin;

const getUiStatusFromOrderStatus = (orderStatus = '') => {
  const normalized = String(orderStatus).toLowerCase();

  if (normalized === 'success') return 'success';
  if (normalized === 'aborted' || normalized === 'cancelled' || normalized === 'canceled') {
    return 'cancelled';
  }

  return 'failed';
};

const normalizeOrderStatus = (orderStatus = '') => {
  const normalized = String(orderStatus || '').toLowerCase().trim();
  if (!normalized) return '';
  if (normalized === 'success' || normalized === 'successful') return 'Success';
  if (normalized === 'aborted' || normalized === 'cancelled' || normalized === 'canceled') return 'Aborted';
  if (normalized === 'failure' || normalized === 'failed' || normalized === 'error') return 'Failure';
  return orderStatus;
};

const normalizePaymentInfo = (rawPaymentInfo = {}) => {
  const normalized = {
    ...rawPaymentInfo,
    order_id: rawPaymentInfo.order_id || rawPaymentInfo.orderId || rawPaymentInfo.merchantOrderNo || '',
    order_status:
      normalizeOrderStatus(
        rawPaymentInfo.order_status ||
        rawPaymentInfo.orderStatus ||
        rawPaymentInfo.transStatus ||
        rawPaymentInfo.paymentStatus
      ) || '',
    tracking_id: rawPaymentInfo.tracking_id || rawPaymentInfo.trackingId || '',
    bank_ref_no: rawPaymentInfo.bank_ref_no || rawPaymentInfo.bankRefNo || '',
    amount: rawPaymentInfo.amount || rawPaymentInfo.netAmt || rawPaymentInfo.grossAmt || '',
    status_message: rawPaymentInfo.status_message || rawPaymentInfo.statusMessage || '',
    failure_message: rawPaymentInfo.failure_message || rawPaymentInfo.errorMessage || rawPaymentInfo.errorDesc || '',
    payment_mode: rawPaymentInfo.payment_mode || rawPaymentInfo.paymentMode || rawPaymentInfo.cardType || '',
    mer_param1: rawPaymentInfo.mer_param1 || rawPaymentInfo.merchant_param1 || rawPaymentInfo.merchantParam1 || rawPaymentInfo.purpose || ''
  };

  return normalized;
};

const extractPaymentPayload = (parsed = {}) => {
  if (!parsed || typeof parsed !== 'object') return null;
  if (parsed?.status && parsed?.data && typeof parsed.data === 'object') return parsed.data;
  if (parsed?.data && typeof parsed.data === 'object' && (parsed.data.order_id || parsed.data.orderId || parsed.data.merchantOrderNo)) {
    return parsed.data;
  }
  if (parsed.order_id || parsed.orderId || parsed.merchantOrderNo) return parsed;
  return null;
};

const buildPaymentRedirectUrl = (paymentInfo = {}, baseUrl, fallbackMessage = '') => {
  const redirectUrl = new URL('/payment/success', baseUrl);
  const uiStatus = getUiStatusFromOrderStatus(paymentInfo.order_status);

  redirectUrl.searchParams.set('status', uiStatus);
  redirectUrl.searchParams.set('order_id', paymentInfo.order_id || '');

  if (paymentInfo.amount) redirectUrl.searchParams.set('amount', paymentInfo.amount);
  if (paymentInfo.tracking_id) redirectUrl.searchParams.set('tracking_id', paymentInfo.tracking_id);
  if (paymentInfo.failure_message) redirectUrl.searchParams.set('failure_message', paymentInfo.failure_message);
  if (paymentInfo.status_message) redirectUrl.searchParams.set('status_message', paymentInfo.status_message);
  if (paymentInfo.payment_mode) redirectUrl.searchParams.set('payment_method', paymentInfo.payment_mode);
  if (fallbackMessage) redirectUrl.searchParams.set('message', fallbackMessage);

  return redirectUrl;
};

async function updateBookingState(paymentInfo) {
  if (!paymentInfo?.order_id) return;

  try {
    const { updateBookingAfterPayment, getBookingTypeFromOrderId } = await import('@/services/paymentService');
    const bookingType = await getBookingTypeFromOrderId(
      paymentInfo.order_id,
      paymentInfo.mer_param1 || paymentInfo.merchant_param1 || paymentInfo.merchantParam1 || paymentInfo.purpose
    );

    await updateBookingAfterPayment(paymentInfo.order_id, paymentInfo, bookingType);
  } catch (error) {
    console.error('Failed to update booking after payment response:', error);
  }
}

async function processPaymentResponse(encResp, options = {}) {
  const {
    wantsRedirect = false,
    baseUrl,
    redirectStatus = 302
  } = options;

  if (!encResp) {
    const message = 'Missing encrypted response';

    if (wantsRedirect) {
      const redirectUrl = new URL('/payment/success', baseUrl);
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', message);
      return NextResponse.redirect(redirectUrl.toString(), redirectStatus);
    }

    return NextResponse.json({ status: false, message }, { status: 400 });
  }

  const upstreamResponse = await fetch('https://svsamiti.com/rajaparba/ccavResponseHandler.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Havan-Booking-System/1.0'
    },
    body: new URLSearchParams({
      encResp: String(encResp)
    })
  });

  const text = await upstreamResponse.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    const message = 'Could not parse payment response';

    if (wantsRedirect) {
      const redirectUrl = new URL('/payment/success', baseUrl);
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', message);
      return NextResponse.redirect(redirectUrl.toString(), redirectStatus);
    }

    return NextResponse.json(
      { status: false, message, rawResponse: text.substring(0, 300) },
      { status: 502 }
    );
  }

  const rawPaymentInfo = extractPaymentPayload(parsed);
  if (rawPaymentInfo) {
    const normalizedPaymentInfo = normalizePaymentInfo(rawPaymentInfo);

    if (normalizedPaymentInfo.order_id && normalizedPaymentInfo.order_status) {
      await updateBookingState(normalizedPaymentInfo);
    }

    if (wantsRedirect) {
      const redirectUrl = buildPaymentRedirectUrl(normalizedPaymentInfo, baseUrl);
      return NextResponse.redirect(redirectUrl.toString(), redirectStatus);
    }

    return NextResponse.json({
      ...parsed,
      data: normalizedPaymentInfo
    });
  }

  if (wantsRedirect && (!parsed?.status || !parsed?.data)) {
    const redirectUrl = new URL('/payment/success', baseUrl);
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('message', parsed?.message || 'Invalid payment response');
    return NextResponse.redirect(redirectUrl.toString(), redirectStatus);
  }

  return NextResponse.json(parsed);
}

export async function POST(request) {
  try {
    let encResp;
    const contentType = request.headers.get('content-type') || '';
    const wantsRedirect = !contentType.includes('application/json');
    const baseUrl = getBaseUrl(request);

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      encResp = formData.get('encResp');
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      encResp = body.encResp;
    }

    return processPaymentResponse(encResp, {
      wantsRedirect,
      baseUrl,
      redirectStatus: wantsRedirect ? 303 : 302
    });
  } catch (error) {
    console.error('Error processing CCAvenue response:', error);
    return NextResponse.json(
      {
        status: false,
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const encResp = searchParams.get('encResp');
  const baseUrl = getBaseUrl(request);

  if (!encResp) return NextResponse.redirect(new URL('/', baseUrl));
  return processPaymentResponse(encResp, {
    wantsRedirect: true,
    baseUrl,
    redirectStatus: 302
  });
}
