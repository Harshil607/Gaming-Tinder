import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }
  const splitToken = auth.split(" ");
  const token = splitToken[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
