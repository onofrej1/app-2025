import { SessionOptions } from "iron-session";

export interface SessionData {
  user: string;
  userId: string;
  role: string;
  token: string | null;
}

export const sessionOptions: SessionOptions = {
  password: "",
  cookieName: "iron-examples-app-router-server-component-and-action",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
  },
};
