// app/api/payment/ccavenue-response/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let encResp;
    
    // Handle both form data and JSON
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      encResp = formData.get('encResp');
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      encResp = body.encResp;
    }

    if (!encResp) {
      return NextResponse.json({
        status: false,
        message: 'Missing encrypted response'
      }, { status: 400 });
    }

    console.log('🔐 Processing response, length:', encResp.length);

    // CORRECTED ENDPOINT - use FormData
    const formData = new FormData();
    formData.append("encResp", encResp);

    const response = await fetch('https://svsamiti.com/rajaparba/ccavResponseHandler.php', {
      method: 'POST',
      body: formData
    });

    const text = await response.text();
    console.log('📥 Raw response from handler:', text.substring(0, 200));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If not JSON, handle as raw response
      console.log('Not JSON, treating as raw response');
      
      // CORRECTED REDIRECT URL
      const baseUrl = 'https://rajaparba.svsamiti.com';
      const redirectUrl = new URL('/payment/success', baseUrl);
      redirectUrl.searchParams.set('status', 'completed');
      redirectUrl.searchParams.set('raw_response', 'true');
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><meta http-equiv="refresh" content="0;url=${redirectUrl.toString()}" /></head>
        <body>Redirecting...</body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Process successful response
    if (data.status && data.data) {
      const baseUrl = 'https://rajaparba.svsamiti.com';
      const redirectUrl = new URL('/payment/success', baseUrl);
      
      if (data.data.order_status === 'Success') {
        redirectUrl.searchParams.set('status', 'success');
        redirectUrl.searchParams.set('order_id', data.data.order_id || '');
        redirectUrl.searchParams.set('amount', data.data.amount || '');
        redirectUrl.searchParams.set('tracking_id', data.data.tracking_id || '');
      } else {
        redirectUrl.searchParams.set('status', 'failed');
        redirectUrl.searchParams.set('message', data.data.failure_message || 'Payment failed');
      }
      
      return NextResponse.redirect(redirectUrl.toString());
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      status: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const encResp = searchParams.get('encResp');
  
  if (encResp) {
    // Convert GET to POST internally
    const req = new Request(request.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encResp })
    });
    return POST(req);
  }
  
  return NextResponse.redirect(new URL('/', 'https://rajaparba.svsamiti.com'));
}