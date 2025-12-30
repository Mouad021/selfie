const encryptData = (data) => {
  try {
    let jsonStr = JSON.stringify(data);
    let shifted = jsonStr.split("").map((c) => String.fromCharCode(c.charCodeAt(0) - 9)).join("");
    let reversed = shifted.split("").reverse().join("");
    let b64 = Buffer.from(reversed).toString("base64").replace(/=/g, "b-");
    let layer2 = Buffer.from(b64).toString("base64");
    return Buffer.from(layer2).toString("base64");
  } catch (e) { return null; }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const sessionToken = encryptData(body);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, url: `https://target-site.com/assets/images/favicon.png?session=${sessionToken}` }),
    };
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false }) };
  }
};
