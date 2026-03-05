const toDateString = (value) => {
  if (!value) return "";
  let date;
  if (value?.toDate && typeof value.toDate === "function") {
    date = value.toDate();
  } else if (value?.seconds) {
    date = new Date(value.seconds * 1000);
  } else {
    date = new Date(value);
  }
  if (Number.isNaN(date?.getTime?.())) return "";
  return date.toISOString().split("T")[0];
};

const buildStallDetails = (bookingData = {}) => {
  const stallIds = bookingData?.stallIds || [];
  const businessType = bookingData?.vendorDetails?.businessType || bookingData?.businessType || "";
  const duration = bookingData?.eventDetails?.duration || bookingData?.duration || "";

  const parts = [];
  if (stallIds.length) parts.push(`Stalls: ${stallIds.join(", ")}`);
  if (businessType) parts.push(`Business: ${businessType}`);
  if (duration) parts.push(`Duration: ${duration}`);
  return parts.join(" | ");
};

export const sendStallBookingConfirmationEmail = async (bookingData = {}) => {
  try {
    const name = bookingData?.vendorDetails?.ownerName || bookingData?.name || "";
    const email = bookingData?.vendorDetails?.email || bookingData?.email || "";
    const reservationId = bookingData?.bookingId || bookingData?.order_id || bookingData?.id || "";
    const eventDate =
      toDateString(bookingData?.eventDetails?.startDate) ||
      toDateString(bookingData?.createdAt) ||
      toDateString(new Date());
    const stallDetails = buildStallDetails(bookingData);
    const amountPaid = String(
      bookingData?.amount || bookingData?.totalAmount || bookingData?.payment?.amount || 0
    );
    const confirmationDate = toDateString(new Date());

    if (!name || !email || !reservationId || !eventDate || !stallDetails) {
      return {
        success: false,
        error: "Missing required stall email fields",
        missing: {
          name: !name,
          email: !email,
          reservation_id: !reservationId,
          event_date: !eventDate,
          stall_details: !stallDetails,
        },
      };
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("reservation_id", reservationId);
    formData.append("event_date", eventDate);
    formData.append("stall_details", stallDetails);
    formData.append("amount_paid", amountPaid);
    formData.append("confirmation_date", confirmationDate);

    const response = await fetch("https://svsamiti.com/rajaparba/stall-booking.php", {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Raja-Parba-Stall/1.0",
      },
    });

    const responseText = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: "Invalid response from stall email service",
        rawResponse: responseText,
      };
    }

    if (!response.ok || !parsed?.status) {
      return {
        success: false,
        error: parsed?.message || "Stall email service failed",
        data: parsed,
      };
    }

    return {
      success: true,
      message: parsed.message || "Confirmation email sent successfully!",
      data: parsed,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send stall confirmation email",
    };
  }
};

