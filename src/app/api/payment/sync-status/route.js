import { NextResponse } from 'next/server';
import { getBookingTypeFromOrderId, updateBookingAfterPayment } from '@/services/paymentService';

const mapUiStatusToOrderStatus = (status = '') => {
  const normalized = String(status).toLowerCase();

  if (normalized === 'success') return 'Success';
  if (normalized === 'cancelled' || normalized === 'canceled' || normalized === 'aborted') {
    return 'Aborted';
  }
  if (normalized === 'failed' || normalized === 'failure' || normalized === 'error') {
    return 'Failure';
  }

  return 'Failure';
};

export async function POST(request) {
  try {
    const body = await request.json();
    const order_id = body?.order_id || body?.orderId || body?.merchantOrderNo || '';
    const status =
      body?.status ||
      body?.order_status ||
      body?.orderStatus ||
      body?.transStatus ||
      body?.paymentStatus ||
      '';
    const amount = body?.amount || body?.grossAmt || body?.netAmt || '';
    const tracking_id = body?.tracking_id || body?.trackingId || '';
    const status_message = body?.status_message || body?.statusMessage || '';
    const failure_message = body?.failure_message || body?.errorMessage || body?.errorDesc || '';
    const payment_method = body?.payment_method || body?.paymentMode || body?.cardType || '';

    if (!order_id || !status) {
      return NextResponse.json(
        { status: false, message: 'order_id and status are required' },
        { status: 400 }
      );
    }

    const paymentData = {
      order_id,
      amount,
      tracking_id,
      status_message,
      failure_message,
      payment_mode: payment_method,
      order_status: mapUiStatusToOrderStatus(status)
    };

    console.log('[SYNC_STATUS] Incoming payment sync request:', {
      order_id,
      status,
      mapped_order_status: paymentData.order_status,
      amount,
      tracking_id,
      payment_method,
      purpose: body?.purpose || body?.merchantParam1 || null
    });

    const bookingType = await getBookingTypeFromOrderId(order_id, body?.purpose || body?.merchantParam1);
    console.log('[SYNC_STATUS] Detected booking type:', { order_id, bookingType });
    const updated = await updateBookingAfterPayment(order_id, paymentData, bookingType);

    console.log('[SYNC_STATUS] Update result:', { order_id, bookingType, updated });
    return NextResponse.json({ status: updated, bookingType });
  } catch (error) {
    console.error('Error syncing payment status:', error);
    return NextResponse.json(
      { status: false, message: error.message || 'Failed to sync payment status' },
      { status: 500 }
    );
  }
}
