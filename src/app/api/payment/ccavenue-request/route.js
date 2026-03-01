// app/api/payment/ccavenue-request/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // FIX: Get FormData instead of JSON
    const formData = await request.formData();
    
    // Extract values from FormData
    const order_id = formData.get('order_id');
    const purpose = formData.get('purpose');
    const amount = formData.get('amount');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const donor_type = formData.get('donor_type');
    const country = formData.get('country');
    
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
    ccAvenueFormData.append("order_id", order_id.trim());
    ccAvenueFormData.append("amount", parseFloat(amount).toFixed(2));
    ccAvenueFormData.append("name", name.trim());
    ccAvenueFormData.append("email", email.trim().toLowerCase());
    ccAvenueFormData.append("phone", phone.replace(/\D/g, ''));
    ccAvenueFormData.append("address", (address || 'Delhi, India').trim());
    ccAvenueFormData.append("purpose", purpose || 'Donation');

    console.log('🚀 Sending to CCAvenue:', {
      order_id, amount, name, email, phone
    });

    // CORRECTED ENDPOINT
    const response = await fetch('https://svsamiti.com/rajaparba/ccavenueRequest.php', {
      method: 'POST',
      body: ccAvenueFormData,  // Send as FormData
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