/**
 * Send show booking confirmation email using Raja Parba seat-confirm API.
 * Required fields: name, seat_no, email
 */
export const sendShowSeatConfirmationEmail = async (bookingData = {}) => {
  try {
    const name =
      bookingData?.userDetails?.name ||
      bookingData?.customerDetails?.name ||
      bookingData?.name ||
      "";
    const email =
      bookingData?.userDetails?.email ||
      bookingData?.customerDetails?.email ||
      bookingData?.email ||
      "";

    const selectedSeats = bookingData?.showDetails?.selectedSeats || bookingData?.selectedSeats || [];
    const seatNo = selectedSeats
      .map((seat) => {
        if (typeof seat === "string") return seat;
        if (seat && typeof seat === "object") return seat.seatId || seat.id || seat.number || "";
        return "";
      })
      .filter(Boolean)
      .join(", ");

    if (!name || !email || !seatNo) {
      return {
        success: false,
        error: "Missing required show email fields",
        missing: {
          name: !name,
          email: !email,
          seat_no: !seatNo,
        },
      };
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("seat_no", seatNo);
    formData.append("email", email);

    const response = await fetch("https://svsamiti.com/rajaparba/seat-confirm.php", {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Raja-Parba-Show/1.0",
      },
    });

    const responseText = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return {
        success: false,
        error: "Invalid response from show email service",
        rawResponse: responseText,
      };
    }

    if (!response.ok || !parsed?.status) {
      return {
        success: false,
        error: parsed?.message || "Show email service failed",
        data: parsed,
      };
    }

    return {
      success: true,
      message: parsed.message || "Invitation sent successfully!",
      data: parsed,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send show confirmation email",
    };
  }
};

