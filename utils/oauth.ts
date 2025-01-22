export const githubOAuth = {
  client_id: process.env.GITHUB_ID || "",
  client_secret: process.env.GITHUB_SECRET || "",
  endpoint: "https://github.com/login/oauth/authorize",
  redirect_uri: process.env.BASE_URL + "/api/oauth/github/callback",
  scopes: "repo",
};

export const googleOAuth = {
  client_id: process.env.AUTH_GOOGLE_ID || "",
  client_secret: process.env.AUTH_GOOGLE_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.BASE_URL + "/api/oauth/google/callback",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};
