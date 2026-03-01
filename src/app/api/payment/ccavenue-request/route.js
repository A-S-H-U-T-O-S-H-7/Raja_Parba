// app/api/payment/ccavenue-request/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { order_id, purpose, amount, name, email, phone, address, donor_type, country } = body;
    
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

    // Create FormData (THIS IS CRITICAL - new API expects FormData)
    const formData = new FormData();
    formData.append("order_id", order_id.trim());
    formData.append("amount", parseFloat(amount).toFixed(2));
    formData.append("name", name.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("phone", phone.replace(/\D/g, ''));
    formData.append("address", (address || 'Delhi, India').trim());
    formData.append("purpose", purpose || 'Donation');

    console.log('🚀 Sending to CCAvenue:', {
      order_id, amount, name, email, phone
    });

    // CORRECTED ENDPOINT
    const response = await fetch('https://svsamiti.com/rajaparba/ccavenueRequest.php', {
      method: 'POST',
      body: formData,  // Send as FormData, not JSON
      // NO Content-Type header - browser sets it automatically with boundary
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