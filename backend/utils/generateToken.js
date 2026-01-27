import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res, expiresIn) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });

  const maxAge =
    expiresIn === "7d" ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;

  res.cookie("jwt", token, {
    maxAge, // MS
    httpOnly: true, // Prevent XSS attacks (cross-site scripting attacks),
    sameSite: "lax", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV === "production",
    domain: process.env.COOKIE_DOMAIN,
  });
};

export default generateTokenAndSetCookie;
