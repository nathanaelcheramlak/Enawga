import jwt from "jsonwebtoken";

const generateToken = (userId, expiresIn) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export default generateToken;
