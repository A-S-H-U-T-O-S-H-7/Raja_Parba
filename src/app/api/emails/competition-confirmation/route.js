import { NextResponse } from "next/server";

const formatEventDate = (value) => {
  if (!value) return "";
  const dateObj = new Date(value);
  if (Number.isNaN(dateObj.getTime())) return String(value);
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dateObj.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body?.name || "").toString().trim();
    const email = (body?.email || "").toString().trim();
    const competitionName = (body?.competition_name || "").toString().trim();
    const category = (body?.category || "").toString().trim();
    const eventDate = formatEventDate(body?.event_date || "");
    const eventTime = (body?.event_time || "").toString().trim();

    if (!name || !email || !competitionName || !category || !eventDate || !eventTime) {
      return NextResponse.json(
        {
          status: false,
          message: "Missing required fields",
          errors: [
            !name ? "name is required" : null,
            !email ? "email is required" : null,
            !competitionName ? "competition_name is required" : null,
            !category ? "category is required" : null,
            !eventDate ? "event_date is required" : null,
            !eventTime ? "event_time is required" : null
          ].filter(Boolean)
        },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("competition_name", competitionName);
    formData.append("category", category);
    formData.append("event_date", eventDate);
    formData.append("event_time", eventTime);

    const response = await fetch("https://svsamiti.com/rajaparba/competition-confirmation.php", {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Raja-Parba-Competition-Confirmation/1.0"
      }
    });

    const responseText = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid response from competition confirmation email service",
          rawResponse: responseText
        },
        { status: 502 }
      );
    }

    if (!response.ok || !parsed?.status) {
      return NextResponse.json(
        {
          status: false,
          message: parsed?.message || "Competition confirmation email service failed",
          data: parsed
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: true,
      message: parsed.message || "Competition confirmation sent successfully!",
      data: parsed
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to send competition confirmation email"
      },
      { status: 500 }
    );
  }
}

