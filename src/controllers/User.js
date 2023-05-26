const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);

  const userEmail = await User.findOne({ email });

  if (!checkEmail(req, res, userEmail)) return;

  const newUser = await User.create({
    name,
    email,
    password: encryptedPassword,
  });

  if (!checkNewUser(req, res, newUser)) return;

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

function checkEmail(req, res, email) {
  if (email) {
    res.status(422).json({
      errors: ["E-mail já cadastrado. Por favor, utilize outro e-mail"],
    });
    return false;
  }

  return true;
}

function checkNewUser(req, res, newUser) {
  if (!newUser) {
    res.status(422).json({
      errors: [
        "Erro ao criar o usuário. Por favor, tente novamente em alguns minutos.",
      ],
    });
    return false;
  }

  return true;
}

module.exports = {
  register,
};
