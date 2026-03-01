// app/api/payment/ccavenue-request/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let payload = {};

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const formData = await request.formData();
      payload = {
        order_id: formData.get('order_id'),
        purpose: formData.get('purpose'),
        amount: formData.get('amount'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        donor_type: formData.get('donor_type'),
        country: formData.get('country')
      };
    } else {
      try {
        payload = await request.json();
      } catch {
        const formData = await request.formData();
        payload = {
          order_id: formData.get('order_id'),
          purpose: formData.get('purpose'),
          amount: formData.get('amount'),
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: formData.get('address'),
          donor_type: formData.get('donor_type'),
          country: formData.get('country')
        };
      }
    }

    const order_id = payload.order_id;
    const purpose = payload.purpose;
    const amount = payload.amount;
    const name = payload.name;
    const email = payload.email;
    const phone = payload.phone;
    const address = payload.address;
    
    // Validation
    const errors = [];
    if (!order_id) errors.push('Order ID is required');
    if (!amount || parseFloat(amount) <= 0) errors.push('Valid amount is required');
    if (!name) errors.push('Name is required');
    if (!email) errors.push('Email is required');
    if (!phone) errors.push('Phone is required');
    
    if (errors.length > 0) {
      return NextResponse.json({ status: false, errors }, { status: 400 });
    }

    // Create FormData for CCAvenue (forward the data)
    const ccAvenueFormData = new FormData();
    ccAvenueFormData.append("order_id", String(order_id).trim());
    ccAvenueFormData.append("amount", parseFloat(amount).toFixed(2));
    ccAvenueFormData.append("name", String(name).trim());
    ccAvenueFormData.append("email", String(email).trim().toLowerCase());
    ccAvenueFormData.append("phone", String(phone).replace(/\D/g, ''));
    ccAvenueFormData.append("address", String(address || 'Delhi, India').trim());
    ccAvenueFormData.append("purpose", purpose || 'Donation');

    console.log('🚀 Sending to CCAvenue:', {
      order_id, amount, name, email, phone
    });

    // CORRECTED ENDPOINT
    const response = await fetch('https://svsamiti.com/rajaparba/ccavenueRequest.php', {
      method: 'POST',
      body: ccAvenueFormData,  
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('📥 Raw response:', text.substring(0, 200));
    
    // Parse JSON response
    const data = JSON.parse(text);
    
    // Return in the format your frontend expects
    return NextResponse.json({
      status: data.status,
      encRequest: data.encRequest,
      access_code: data.access_code,
      order_id: data.order_id
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      status: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: false, 
    message: 'Method not allowed' 
  }, { status: 405 });
}
