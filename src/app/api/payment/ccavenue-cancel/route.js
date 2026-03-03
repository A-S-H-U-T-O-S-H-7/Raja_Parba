import { NextResponse } from 'next/server';

const getBaseUrl = (request) => new URL(request.url).origin;

async function parseEncRespFromRequest(request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    return formData.get('encResp');
  }

  if (contentType.includes('application/json')) {
    const body = await request.json();
    return body.encResp;
  }

  const text = await request.text();
  if (text.includes('encResp=')) {
    const urlParams = new URLSearchParams(text);
    return urlParams.get('encResp');
  }

  return null;
}

async function processCancellation(encResp, request) {
  if (!encResp) {
    return NextResponse.json(
      {
        status: false,
        message: 'Missing encrypted response',
        errors: ['encResp parameter is required']
      },
      { status: 400 }
    );
  }

  const formData = new FormData();
  formData.append('encResp', encResp);

  const response = await fetch('https://svsamiti.com/rajaparba/ccavResponseHandler.php', {
    method: 'POST',
    body: formData,
    headers: {
      'User-Agent': 'Raja-Festival/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`CCAvenue response handler returned status ${response.status}`);
  }

  const responseText = await response.text();
  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    const redirectUrl = new URL('/payment/success', getBaseUrl(request));
    redirectUrl.searchParams.set('status', 'cancelled');
    redirectUrl.searchParams.set('message', 'Payment cancelled');

    return NextResponse.json({
      status: true,
      redirect: redirectUrl.toString(),
      data: { order_id: 'unknown', status: 'cancelled' }
    });
  }

  if (data.status && data.data) {
    const paymentInfo = data.data;

    try {
      const paymentService = await import('@/services/paymentService');
      const seatCleanupService = await import('@/services/seatCleanupService');
      const stallCleanupService = await import('@/services/stallCleanupService');
      const showSeatCleanupService = await import('@/services/showSeatCleanupService');

      const bookingType = await paymentService.getBookingTypeFromOrderId(
        paymentInfo.order_id,
        paymentInfo.mer_param1 || paymentInfo.merchant_param1
      );

      if (bookingType === 'havan') {
        await seatCleanupService.cancelPendingBooking(paymentInfo.order_id, 'Payment cancelled by user');
      } else if (bookingType === 'show') {
        await showSeatCleanupService.cancelPendingShowBooking(paymentInfo.order_id, 'Payment cancelled by user');
      } else if (bookingType === 'stall') {
        await stallCleanupService.cancelPendingStallBooking(paymentInfo.order_id, 'Payment cancelled by user');
      } else {
        await seatCleanupService.cancelPendingBooking(paymentInfo.order_id, 'Payment cancelled by user');
      }
    } catch (error) {
      console.error('Error updating cancellation state:', error);
    }

    const redirectUrl = new URL('/payment/success', getBaseUrl(request));
    redirectUrl.searchParams.set('order_id', paymentInfo.order_id || 'unknown');
    redirectUrl.searchParams.set('status', 'cancelled');
    redirectUrl.searchParams.set('message', 'Payment was cancelled by user. Seats have been released.');

    return NextResponse.json({
      status: true,
      redirect: redirectUrl.toString(),
      data: paymentInfo
    });
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const encResp = await parseEncRespFromRequest(request);
    return processCancellation(encResp, request);
  } catch (error) {
    console.error('CCAvenue cancellation processing error:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Payment cancellation processing failed',
        errors: [error.message || 'Internal server error']
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const encResp = searchParams.get('encResp');

    if (!encResp) {
      return NextResponse.redirect(
        new URL('/payment/success?status=cancelled&message=Payment%20was%20cancelled', getBaseUrl(request)),
        302
      );
    }

    return processCancellation(encResp, request);
  } catch (error) {
    const redirectUrl = new URL('/payment/success', getBaseUrl(request));
    redirectUrl.searchParams.set('status', 'cancelled');
    redirectUrl.searchParams.set('message', error.message || 'Payment cancellation failed');
    return NextResponse.redirect(redirectUrl.toString(), 302);
  }
}
