const jwt = require("jsonwebtoken");
const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  // Extract the token from the Authorization header
  // Format: "Bearer [token]"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};
// Middleware de vérification de rôle
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { ensureAuthenticated, authorize };
