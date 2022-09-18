const User = require("../models/user.models");

const getProfile = (req, res) => {
  let user_id = req.user.user_data.user_id;
  User.findById(user_id).then((data) => {
    const newData = {
      id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };
    res.status(200).json({ status: "success", data: newData });
  });
};

async function editProfile(req, res) {
  let user_id = req.user.user_data.user_id;
  const { name, phone, email } = req.body;
  const updatedData = { name: name, phone: phone, email: email };
  User.findByIdAndUpdate(user_id, updatedData, (err, emp) => {
    if (err) {
      return res
        .status(500)
        .send({ error: "Problem with Updating the   profile" });
    }
    res.send({ status: 200, message: "Profile updated successfully" });
  });
}

module.exports = {
  getProfile,
  editProfile,
};
