function checkEmail(res, email) {
  if (!email) return true;

  res.status(422).json({
    error: "E-mail já cadastrado. Por favor, utilize outro e-mail.",
  });
  return false;
}

function checkNewUser(res, newUser) {
  if (newUser) return true;

  res.status(422).json({
    error:
      "Erro ao criar o usuário. Por favor, tente novamente em alguns minutos.",
  });
  return false;
}

function checkLoggedInUser(res, userEmail) {
  if (userEmail) return true;

  res.status(404).json({
    error: "Usuário não encontrado.",
  });
  return false;
}

module.exports = { checkEmail, checkNewUser, checkLoggedInUser };
