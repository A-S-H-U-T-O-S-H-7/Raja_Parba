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
    const {
      order_id,
      status,
      amount,
      tracking_id,
      status_message,
      failure_message,
      payment_method
    } = body || {};

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
      purpose: body?.purpose || null
    });

    const bookingType = await getBookingTypeFromOrderId(order_id, body?.purpose);
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
