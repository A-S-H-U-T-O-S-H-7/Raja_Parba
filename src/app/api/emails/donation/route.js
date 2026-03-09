import { NextResponse } from 'next/server';
import { sendDonationConfirmationEmail } from '@/services/donationEmailService';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await sendDonationConfirmationEmail(body || {});

    return NextResponse.json(
      {
        status: Boolean(result?.success),
        ...result
      },
      { status: result?.success ? 200 : 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        error: error?.message || 'Failed to process donation email request'
      },
      { status: 500 }
    );
  }
}

