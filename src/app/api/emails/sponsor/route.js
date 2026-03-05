import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body?.name || "").toString().trim();
    const email = (body?.email || "").toString().trim();

    if (!name || !email) {
      return NextResponse.json(
        {
          status: false,
          message: "Missing required fields",
          errors: [
            !name ? "name is required" : null,
            !email ? "email is required" : null,
          ].filter(Boolean),
        },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    const response = await fetch("https://svsamiti.com/rajaparba/sponsor.php", {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Raja-Parba-Sponsor/1.0",
      },
    });

    const responseText = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          status: false,
          message: "Invalid response from sponsor email service",
          rawResponse: responseText,
        },
        { status: 502 }
      );
    }

    if (!response.ok || !parsed?.status) {
      return NextResponse.json(
        {
          status: false,
          message: parsed?.message || "Sponsor email service failed",
          data: parsed,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: true,
      message: parsed.message || "Sponsorship appreciation email sent successfully!",
      data: parsed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to send sponsor email",
      },
      { status: 500 }
    );
  }
}

