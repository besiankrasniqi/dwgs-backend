const jwt = require("jsonwebtoken");
const { restart } = require("nodemon");
const { promisify } = require("util");

exports.isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;
  const jwtToken = authorization.replace("Bearer ", "") || null;

  if (jwtToken) {
    try {
      const decoded = await promisify(jwt.verify)(
        jwtToken,
        process.env.JWT_SECRET
      );

      if (decoded) return next();

      res.status(401).send();
    } catch (error) {
      res.status("401").send();
    }
  }

  res.status("401").send();
};
