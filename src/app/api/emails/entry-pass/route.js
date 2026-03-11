import { NextResponse } from 'next/server';
import { sendEntryPassConfirmationEmail } from '@/services/entryPassEmailService';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await sendEntryPassConfirmationEmail(body || {});

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
        error: error?.message || 'Failed to process entry pass email request'
      },
      { status: 500 }
    );
  }
}
