const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Please provide an email and password",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        if (
          !results ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).send({
            isLoggedIn: false,
            message: "Email or Password is incorrect",
          });
          return res;
        } else {
          const id = results[0].id,
            email = results[0].email;
          name = results[0].name;

          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("The Login token is: " + token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          // res.status(200).redirect("/");

          res.json({
            payload: {
              userId: id,
              userEmail: email,
              userName: name,
              authorized: true,
              jwt: token,
              cookieOptions,
            },
          });
          res.status(200);
          return res;
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirmation } = req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);

        // not returning the true error response message to the frontend for security reasons
        res.status(400).send({
          isRegistered: false,
          mmessage:
            "There was an error when registering your account. Please contact support!",
        });
        return res;
      }

      if (results.length > 0) {
        res.status(400).send({
          isRegistered: false,
          message: "Email address is already in use",
        });
        return res;
      } else if (password !== passwordConfirmation) {
        res.status(400).send({
          message: "Passwords do not match",
        });

        return res;
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);

            // not returning the true error response message to the frontend for security reasons
            res.status(400).send({
              isRegistered: false,
              message:
                "There was an error when registering your account. Please contact support!",
            });
            return res;
          } else {
            console.log(results);
            res.send({
              isRegistered: true,
              message: "User has been registered successfully",
            });
            return res;
          }
        }
      );
    }
  );
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).redirect("/");
};
