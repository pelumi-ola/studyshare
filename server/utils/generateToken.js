import { sign } from "jsonwebtoken";

const generateToken = (userId) => {
  return sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export default generateToken;
