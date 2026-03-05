import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body?.name || "").toString().trim();
    const email = (body?.email || "").toString().trim();
    const passNo = (body?.pass_no || "").toString().trim();

    if (!name || !email || !passNo) {
      return NextResponse.json(
        {
          status: false,
          message: "Missing required fields",
          errors: [
            !name ? "name is required" : null,
            !email ? "email is required" : null,
            !passNo ? "pass_no is required" : null,
          ].filter(Boolean),
        },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("pass_no", passNo);

    const response = await fetch("https://svsamiti.com/rajaparba/entry-pass.php", {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": "Raja-Parba-Entry-Pass/1.0",
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
          message: "Invalid response from entry pass email service",
          rawResponse: responseText,
        },
        { status: 502 }
      );
    }

    if (!response.ok || !parsed?.status) {
      return NextResponse.json(
        {
          status: false,
          message: parsed?.message || "Entry pass email service failed",
          data: parsed,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: true,
      message: parsed.message || "Entry pass confirmation sent successfully!",
      data: parsed,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to send entry pass email",
      },
      { status: 500 }
    );
  }
}

