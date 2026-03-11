const DEFAULT_ENTRY_PASS_EMAIL_ENDPOINT = 'https://svsamiti.com/rajaparba/entry-pass.php';

const getEntryPassEmailConfig = () => {
  const endpoint =
    process.env.ENTRY_PASS_EMAIL_ENDPOINT ||
    process.env.NEXT_PUBLIC_ENTRY_PASS_EMAIL_ENDPOINT ||
    DEFAULT_ENTRY_PASS_EMAIL_ENDPOINT;

  const disabled =
    String(process.env.ENTRY_PASS_EMAIL_ENABLED || 'true').toLowerCase() === 'false';

  const verbose =
    String(process.env.ENTRY_PASS_EMAIL_VERBOSE_LOGS || 'true').toLowerCase() === 'true';

  return { endpoint, disabled, verbose };
};

const buildEntryPassPayload = (entryPassData = {}) => {
  const name = (entryPassData.delegateDetails?.name || entryPassData.name || '').trim();
  const email = (entryPassData.delegateDetails?.email || entryPassData.email || '').trim();
  const passNo = String(
    entryPassData.bookingId ||
      entryPassData.id ||
      entryPassData.order_id ||
      entryPassData.payment?.orderId ||
      ''
  ).trim();

  return {
    name,
    email,
    pass_no: passNo
  };
};

export const sendEntryPassConfirmationEmail = async (entryPassData = {}) => {
  const config = getEntryPassEmailConfig();
  const payload = buildEntryPassPayload(entryPassData);

  if (config.disabled) {
    return {
      success: false,
      skipped: true,
      error: 'Entry pass email is disabled by configuration',
      config: { endpoint: config.endpoint, disabled: true }
    };
  }

  if (!payload.name || !payload.email || !payload.pass_no) {
    return {
      success: false,
      error: 'Missing required entry pass email fields',
      missing: {
        name: !payload.name,
        email: !payload.email,
        pass_no: !payload.pass_no
      },
      payload
    };
  }

  if (config.verbose) {
    console.log('[ENTRY_PASS_EMAIL][REQUEST]', {
      endpoint: config.endpoint,
      payload
    });
  }

  try {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('email', payload.email);
    formData.append('pass_no', payload.pass_no);

    const response = await fetch(config.endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': 'Raja-Parba-Entry-Pass/1.0'
      }
    });

    const responseText = await response.text();
    let parsed;

    try {
      parsed = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: 'Invalid response from entry pass email service',
        endpoint: config.endpoint,
        httpStatus: response.status,
        rawResponse: responseText
      };
    }

    const success = Boolean(response.ok && parsed?.status);

    if (config.verbose) {
      console.log('[ENTRY_PASS_EMAIL][RESPONSE]', {
        endpoint: config.endpoint,
        httpStatus: response.status,
        success,
        parsed
      });
    }

    if (!success) {
      return {
        success: false,
        error: parsed?.message || 'Entry pass email service failed',
        endpoint: config.endpoint,
        httpStatus: response.status,
        data: parsed
      };
    }

    return {
      success: true,
      message: parsed.message || 'Entry pass confirmation sent successfully',
      endpoint: config.endpoint,
      httpStatus: response.status,
      data: parsed
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to send entry pass email: ${error.message}`,
      endpoint: config.endpoint
    };
  }
};
