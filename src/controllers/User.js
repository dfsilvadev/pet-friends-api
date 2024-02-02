const User = require("../models/User");

const bcrypt = require("bcryptjs");
const { request } = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;

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

  if (!checkEmail(res, userEmail)) return;

  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
  });

  if (!checkNewUser(res, user)) return;

  res.status(201).json({
    _id: user._id,
    name: user.name,
    token: generateToken(user._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!checkLoggedInUser(res, user)) return;

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({
      error: ["Senha inválida."],
    });
    return;
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

const getCurrentUser = (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;
  const user = await User.findById({ _id: new ObjectId(reqUser._id) }).select(
    "-password"
  );

  if (name) user.name = name;

  if (profileImage) user.profileImage = profileImage;

  if (bio) user.bio = bio;

  if (password) {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password, salt);

    user.password = encryptedPassword;
  }

  await user.save();

  res.status(200).json(user);
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById({ _id: new ObjectId(id) }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(user);
  } catch {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }
};

module.exports = {
  getCurrentUser,
  getUserById,
  login,
  register,
  update,
};

function checkEmail(res, email) {
  if (email) {
    res.status(422).json({
      error: "E-mail já cadastrado. Por favor, utilize outro e-mail.",
    });
    return false;
  }

  return true;
}

function checkNewUser(res, newUser) {
  if (!newUser) {
    res.status(422).json({
      error:
        "Erro ao criar o usuário. Por favor, tente novamente em alguns minutos.",
    });
    return false;
  }

  return true;
}

function checkLoggedInUser(res, userEmail) {
  if (!userEmail) {
    res.status(404).json({
      error: "Usuário não encontrado.",
    });
    return false;
  }

  return true;
}
