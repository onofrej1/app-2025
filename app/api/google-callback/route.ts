const googleOAuth = {
  client_id: process.env.AUTH_GOOGLE_ID || "",
  client_secret: process.env.AUTH_GOOGLE_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.BASE_URL + "/api/google-callback",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
  
    const params = {
      client_id: googleOAuth.client_id,
      client_secret: googleOAuth.client_secret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: googleOAuth.redirect_uri,
    };
  
    const response = await fetch("https://accounts.google.com/o/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      // Do something
    }
  
    // extracts the access token
    const data = await response.json();
  
    // retrieve the user's information
    const profile_response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );
  
    if (!profile_response.ok) {
      // do something
    }
  
    const profile = await profile_response.json();
    console.log(profile);
  
    // The profile variable contains all the information that you might need. 
  }