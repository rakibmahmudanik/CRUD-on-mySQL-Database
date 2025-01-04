const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gram_bangla_user",
  password: "rakib@420",
});
let getRandUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result[0]["count(*)"]);
      let count = result[0]["count(*)"];
      res.render("home", { count });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;

  let q = `SELECT * FROM user WHERE id ='${id}'`;
  try {
    connection.query(q, (err, user) => {
      if (err) throw err;
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

// A simple SELECT query
// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();

// let q = "INSERT INTO user(id,username,email, password) VALUES ?";
// let data = [];
// for (let i = 0; i < 100; i++) {
//   data.push(getRandUser());
// }

// /usr/local/mysql/bin/mysql -u root -p ======= connect database to CLI
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
