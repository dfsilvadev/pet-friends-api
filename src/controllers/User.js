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
  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
  });

  if (!checkEmail(res, userEmail)) return;

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
      errors: ["Senha inválida."],
    });
    return;
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    avatar_url: user.avatar_url,
    token: generateToken(user._id),
  });
};

module.exports = {
  register,
  login,
};

async function getUserData(name, email, password, avatar_url, bio) {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);

  return await User.create({
    name,
    email,
    password: encryptedPassword,
    avatar_url,
    bio,
  });
}
function checkEmail(res, email) {
  if (email) {
    res.status(422).json({
      errors: ["E-mail já cadastrado. Por favor, utilize outro e-mail"],
    });
    return false;
  }

  return true;
}

function checkNewUser(res, newUser) {
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

function checkLoggedInUser(res, userEmail) {
  if (!userEmail) {
    res.status(404).json({
      errors: ["Usuário não encontrado."],
    });
    return false;
  }

  return true;
}
