function encryptData(data) {
  try {
    let jsonStr = JSON.stringify(data);

    // 1) Shift -9
    let shifted = jsonStr
      .split("")
      .map((c) => String.fromCharCode(c.charCodeAt(0) - 9))
      .join("");

    // 2) Reverse
    let reversed = shifted.split("").reverse().join("");

    // 3) Base64 layers + mask "="
    let b64 = Buffer.from(reversed).toString("base64").replace(/=/g, "b-");
    let layer2 = Buffer.from(b64).toString("base64");
    return Buffer.from(layer2).toString("base64");
  } catch (e) {
    return null;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : null;
    const sessionToken = encryptData(body);

    if (!sessionToken) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false }) };
    }

    const finalUrl = `https://target-site.com/assets/images/favicon.png?session=${sessionToken}`;
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, url: finalUrl }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Bad JSON" }),
    };
  }
};
