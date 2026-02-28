// Direct redirect handler for CCAvenue - handles both GET and POST redirects
import { NextResponse } from 'next/server';

function getBaseUrl(request) {
  const origin = request.headers.get('origin');
  if (origin) return origin;

  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;

  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://rajaparba.svsamiti.com';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const encResp = searchParams.get('encResp');
    
    console.log('Direct GET redirect - encResp length:', encResp ? encResp.length : 'null');
    
    if (encResp) {
      // Process via our response API
      const processedUrl = new URL('/payment/status', getBaseUrl(request));
      processedUrl.searchParams.set('encResp', encResp);
      
      return NextResponse.redirect(processedUrl.toString());
    }
    
    // No encrypted response, redirect to generic success page
    const errorUrl = new URL('/payment/success', getBaseUrl(request));
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'No payment response received');
    
    return NextResponse.redirect(errorUrl.toString());
    
  } catch (error) {
    console.error('❌ Redirect GET error:', error);
    
    const errorUrl = new URL('/payment/success', getBaseUrl(request));
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', encodeURIComponent(error.message || 'Redirect failed'));
    
    return NextResponse.redirect(errorUrl.toString());
  }
}

export async function POST(request) {
  try {
    let encResp;
    
    // Try to get the content type
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data (typical for CCAvenue)
      const formData = await request.formData();
      encResp = formData.get('encResp');
    } else {
      // Fallback: try to parse as text and extract encResp
      const text = await request.text();
      console.log('Raw redirect POST body:', text);
      
      if (text.includes('encResp=')) {
        const urlParams = new URLSearchParams(text);
        encResp = urlParams.get('encResp');
      }
    }
    
    console.log('Direct POST redirect - encResp length:', encResp ? encResp.length : 'null');
    
    if (encResp) {
      // Redirect to our status page with the encrypted response
      const processedUrl = new URL('/payment/status', getBaseUrl(request));
      processedUrl.searchParams.set('encResp', encResp);
      
      return NextResponse.redirect(processedUrl.toString());
    }
    
    // No encrypted response, redirect to generic success page
    const errorUrl = new URL('/payment/success', getBaseUrl(request));
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'No payment response received');
    
    return NextResponse.redirect(errorUrl.toString());
    
  } catch (error) {
    console.error('❌ Redirect POST error:', error);
    
    const errorUrl = new URL('/payment/success', getBaseUrl(request));
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', encodeURIComponent(error.message || 'Redirect failed'));
    
    return NextResponse.redirect(errorUrl.toString());
  }
}
