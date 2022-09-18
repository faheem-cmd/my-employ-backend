const StatusCode = require("../utils/StatusCode");
const { created, serverError, success } = StatusCode;
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

async function signup(req, res) {
  const { name, email, phone, password } = req.body;
  const hashedPassword = await generateHashedPassword(password);
  await User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    } else if (!validateEmail(req.body.email)) {
      return res.status(404).json({ message: "Please enter valid email" });
    } else {
      //   const ps = bcrypt.hash(password, 10);
      let user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
      });
      user
        .save()
        .then((data) => {
          res.status(201).json({ message: "created", data: data });
        })
        .catch((e) => res.status(500).json({ error: e }));
    }
  });
}

// const login = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   console.log(item);
// };

const login = async (req, res) => {
  const { email, password } = req.body;
  const filter = { email: email };
  User.find(filter).then(async (result) => {
    if (result.length == 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Incorrect email" });
    } else {
      const user = result[0];
      const user_data = {
        user_id: result[0]._id,
      };
      if (email !== user.email) {
        return res.status(404).json({ message: "Incorrect email" });
      }
      const check = await checkUser(user.password, password);
      console.log(check, "checked");
      if (!check) {
        return res.status(404).json({ message: "Incorrect password" });
      }
      let accessToken = jwt.sign({ user_data }, "access-key-secrete", {
        expiresIn: "2d",
      });
      // let refreshToken = jwt.sign({ user }, "refresh-key-secrete", {
      //   expiresIn: "7d",
      // });

      const update = {
        access_token: accessToken,
        //refresh_token: refreshToken,
      };

      User.findOneAndUpdate(filter, update, { new: true }).then((result) => {});
      const tokens = {
        accessToken,
        // refreshToken,
      };
      return res.status(200).json({
        status: "success",
        data: tokens,
        message: "Logged in successfully",
        componen: "<div><Button>Click</Button></div>",
      });
    }
  });
};

async function checkUser(user, password) {
  const match = await bcrypt.compare(password, user);
  return match;
  //...
}

const generateHashedPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

module.exports = {
  signup,
  login,
};
