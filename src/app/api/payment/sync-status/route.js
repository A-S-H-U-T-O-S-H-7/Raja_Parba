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

    const bookingType = await getBookingTypeFromOrderId(order_id, body?.purpose);
    const updated = await updateBookingAfterPayment(order_id, paymentData, bookingType);

    return NextResponse.json({ status: updated, bookingType });
  } catch (error) {
    console.error('Error syncing payment status:', error);
    return NextResponse.json(
      { status: false, message: error.message || 'Failed to sync payment status' },
      { status: 500 }
    );
  }
}
