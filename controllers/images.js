const mysql = require("mysql");
const moment = require("moment");
const { restart } = require("nodemon");
// const base64Img = require("base64-img");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.saveImage = (req, res) => {
  const { drawingName, creationTime, imageData, userId } = req.body;

  console.log({
    drawingName,
    creationTime,
    imageData,
    userId,
  });

  db.query(
    "INSERT INTO drawings SET ?",
    {
      drawing_name: drawingName,
      drawing_base64_data: imageData,
      creation_time_length_seconds: creationTime,
      user_id: userId,
      created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
      updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(400).send({
          isRegistered: false,
          message:
            "There was an error saving the drawing. Please contact support!",
        });
        return res;
      } else {
        console.log(results);
        res.send({
          isSaved: true,
          message: "Drawing was saved successfully",
        });
        return res;
      }
    }
  );
};

exports.images = (req, res) => {
  console.log("listImages was invoked");
  try {
    db.query(
      `SELECT d.id as drawing_id, d.drawing_name, d.creation_time_length_seconds, d.drawing_base64_data, d.created_at, d.updated_at, u.id as user_id, u.name as user_name FROM drawings d 
      LEFT JOIN users u 
      ON u.id = d.user_id`,
      [],
      async (error, results) => {
        if (error) {
          res.status(400).send({
            message: "There was an error retrieving the list of images",
          });
          return res;
        } else {
          res.send({
            results,
          });
          return res;
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      message: "There was an error retrieving the list of images",
    });
    return res;
  }
};

exports.getImage = (req, res) => {
  console.log("getImage was invoked");
  try {
    db.query(
      "SELECT * FROM drawings WHERE id = ?",
      [req.query.id],
      async (error, results) => {
        if (error) {
          console.log("getImage error is:", error);
          res.status(400).send({
            message: "There was an error retrieving the image",
          });
          return res;
        } else {
          if (results[0]) {
            res.send({
              id: results[0].id,
              drawingName: results[0].drawing_name,
              imageBase64: results[0].drawing_base64_data,
              userId: results[0].user_id,
            });
          } else {
            res.send({
              id: null,
              drawingName: null,
              imageBase64: null,
              userId: null,
            });
          }
          return res;
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      message: "There was an error retrieving the list of images",
    });
    return res;
  }
};

exports.deleteImage = (req, res) => {
  console.log("deleteImage was invoked");
  if (req.query.id) {
    try {
      db.query(
        "DELETE FROM drawings WHERE id = ?",
        [req.query.id],
        async (error, results) => {
          if (error) {
            console.log("getImage error is:", error);
            res.status(400).send({
              isDeleted: false,
              message: "There was an error deleting the image",
            });
            return res;
          } else {
            res.send({
              isDeleted: true,
              message: "Drawing was successfully deleted!",
            });
            return res;
          }
        }
      );
    } catch (error) {
      res.status(400).send({
        isDeleted: false,
        message: "There was an error retrieving the list of images",
      });
      return res;
    }
  } else {
    res.status(400).send({
      isDeleted: false,
      message: "Image id was not provided",
    });
    return res;
  }
};
