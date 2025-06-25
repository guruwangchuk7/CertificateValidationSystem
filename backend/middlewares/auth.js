const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Format should be "Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Malformed token' });
  }

  try {
    // Verify token with your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info from token payload to req.user
    req.user = decoded;

    // Continue to next middleware or route handler
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Token expired or invalid' });
  }
}

module.exports = authMiddleware;
