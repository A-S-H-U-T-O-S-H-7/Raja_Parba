import { NextResponse } from 'next/server';

const getBaseUrl = (request) => new URL(request.url).origin;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const encResp = searchParams.get('encResp');
    const baseUrl = getBaseUrl(request);

    if (encResp) {
      const processedUrl = new URL('/payment/status', baseUrl);
      processedUrl.searchParams.set('encResp', encResp);
      return NextResponse.redirect(processedUrl.toString());
    }

    const errorUrl = new URL('/payment/success', baseUrl);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'No payment response received');
    return NextResponse.redirect(errorUrl.toString());
  } catch (error) {
    const errorUrl = new URL('/payment/success', getBaseUrl(request));
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', error.message || 'Redirect failed');
    return NextResponse.redirect(errorUrl.toString());
  }
}

export async function POST(request) {
  try {
    let encResp;
    const contentType = request.headers.get('content-type') || '';
    const baseUrl = getBaseUrl(request);

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      encResp = formData.get('encResp');
    } else {
      const text = await request.text();
      if (text.includes('encResp=')) {
        const urlParams = new URLSearchParams(text);
        encResp = urlParams.get('encResp');
      }
    }

    if (encResp) {
      const processedUrl = new URL('/payment/status', baseUrl);
      processedUrl.searchParams.set('encResp', encResp);
      return NextResponse.redirect(processedUrl.toString(), 303);
    }

    const errorUrl = new URL('/payment/success', baseUrl);
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', 'No payment response received');
    return NextResponse.redirect(errorUrl.toString(), 303);
  } catch (error) {
    const errorUrl = new URL('/payment/success', getBaseUrl(request));
    errorUrl.searchParams.set('status', 'error');
    errorUrl.searchParams.set('message', error.message || 'Redirect failed');
    return NextResponse.redirect(errorUrl.toString(), 303);
  }
}
