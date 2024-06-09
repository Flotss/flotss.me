import { login } from "@/services/AuthService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);
    // res.setHeader('Set-Cookie', serialize('token', 'token_cookie_value', { path: '/' }));
    res.setHeader(
      "Set-Cookie",
      `UserJWT=${token}; Path=/; HttpOnly; SameSite=Strict;`
      );
      res.redirect(304, "/admin/dashboard");
      res.end();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
