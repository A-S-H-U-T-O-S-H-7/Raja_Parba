const DEFAULT_DONATION_EMAIL_ENDPOINT = 'https://svsamiti.com/rajaparba/donation.php';

const getDonationEmailConfig = () => {
  const endpoint =
    process.env.DONATION_EMAIL_ENDPOINT ||
    process.env.NEXT_PUBLIC_DONATION_EMAIL_ENDPOINT ||
    DEFAULT_DONATION_EMAIL_ENDPOINT;

  const disabled =
    String(process.env.DONATION_EMAIL_ENABLED || 'true').toLowerCase() === 'false';

  const verbose =
    String(process.env.DONATION_EMAIL_VERBOSE_LOGS || 'true').toLowerCase() === 'true';

  return { endpoint, disabled, verbose };
};

const toDdMmYyyy = (value = new Date()) =>
  new Date(value).toLocaleDateString('en-GB').replace(/\//g, '-');

const buildDonationPayload = (donationData = {}) => {
  const donorName = (donationData.donorDetails?.name || donationData.name || '').trim();
  const donorEmail = (donationData.donorDetails?.email || donationData.email || '').trim();
  const donationAmount = String(
    donationData.amount ?? donationData.totalAmount ?? donationData.payment?.amount ?? '0'
  );
  const donationId = donationData.donationId || donationData.order_id || donationData.id || '';
  const paymentId =
    donationData.payment?.transactionId ||
    donationData.payment_id ||
    donationData.payment?.paymentId ||
    donationData.order_id ||
    donationId;

  return {
    name: donorName,
    email: donorEmail,
    donation_amount: donationAmount,
    payment_id: paymentId,
    donation_id: donationId || paymentId,
    transaction_date: toDdMmYyyy()
  };
};

export const sendDonationConfirmationEmail = async (donationData = {}) => {
  const config = getDonationEmailConfig();
  const payload = buildDonationPayload(donationData);

  if (config.disabled) {
    return {
      success: false,
      skipped: true,
      error: 'Donation email is disabled by configuration',
      config: { endpoint: config.endpoint, disabled: true }
    };
  }

  if (!payload.name || !payload.email || !payload.donation_id || !payload.payment_id) {
    return {
      success: false,
      error: 'Missing required donation email fields',
      missing: {
        name: !payload.name,
        email: !payload.email,
        donation_id: !payload.donation_id,
        payment_id: !payload.payment_id
      },
      payload
    };
  }

  if (config.verbose) {
    console.log('[DONATION_EMAIL][REQUEST]', {
      endpoint: config.endpoint,
      payload
    });
  }

  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    formData.append('donation_amount', payload.donation_amount);
    formData.append('payment_id', payload.payment_id);
    formData.append('donation_id', payload.donation_id);
    formData.append('transaction_date', payload.transaction_date);

    const response = await fetch(config.endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': 'Raja-Parba-Donation/1.0'
      }
    });

    const responseText = await response.text();
    let parsed;

    try {
      parsed = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: 'Invalid response from donation email service',
        endpoint: config.endpoint,
        httpStatus: response.status,
        rawResponse: responseText
      };
    }

    const success = Boolean(response.ok && parsed?.status);

    if (config.verbose) {
      console.log('[DONATION_EMAIL][RESPONSE]', {
        endpoint: config.endpoint,
        httpStatus: response.status,
        success,
        parsed
      });
    }

    if (!success) {
      return {
        success: false,
        error: parsed?.message || 'Donation email service failed',
        endpoint: config.endpoint,
        httpStatus: response.status,
        data: parsed
      };
    }

    return {
      success: true,
      message: parsed.message || 'Donation confirmation email sent successfully',
      endpoint: config.endpoint,
      httpStatus: response.status,
      data: parsed
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to send donation email: ${error.message}`,
      endpoint: config.endpoint
    };
  }
};

