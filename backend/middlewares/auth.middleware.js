import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
