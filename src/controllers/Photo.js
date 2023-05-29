const { response } = require("express");
const Photo = require("../models/Photo");
const User = require("../models/User");

const { ObjectId } = require("mongoose").Types;

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  if (!newPhoto)
    return res.status(422).json({
      errors: ["Erro ao inserir a foto. Por favor, tente mais tarde!"],
    });

  res.status(200).json(newPhoto);
};

const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById({ _id: new ObjectId(id) });

    if (!photo)
      return res.status(404).json({
        errors: ["Foto não encontrada."],
      });

    if (!photo.userId.equals(reqUser._id))
      return res.status(422).json({
        errors: ["Erro ao deletar a foto. Por favor, tente mais tarde!"],
      });

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso!" });
  } catch {
    res.status(404).json({
      errors: ["Foto não encontrada."],
    });
  }
};

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById({ _id: new ObjectId(id) });

    if (!photo)
      return res.status(404).json({
        errors: ["Foto não encontrada."],
      });

    res.status(200).json(photo);
  } catch {
    res.status(404).json({
      errors: ["Foto não encontrada."],
    });
  }
};

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;
  const photo = await Photo.findById(id);

  if (!photo)
    return res.status(404).json({
      errors: ["Foto não encontrada."],
    });

  if (!photo.userId.equals(reqUser.id))
    return res.status(422).json({
      errors: ["Erro ao editar a foto. Por favor, tente mais tarde!"],
    });

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  if (!photo)
    return res.status(404).json({
      errors: ["Foto não encontrada."],
    });

  if (photo.likes.includes(reqUser._id)) {
    const index = photo.likes.indexOf(reqUser._id);
    photo.likes.splice(index, 1);
    photo.save();

    return res
      .status(200)
      .json({ photoId: id, userId: reqUser.id, message: "Foto descurtida!" });
  }

  photo.likes.push(reqUser._id);
  photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser.id, message: "Foto curtida!" });
};

const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);
  const photo = await Photo.findById(id);

  if (!photo)
    return res.status(404).json({
      errors: ["Foto não encontrada."],
    });

  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);
  photo.save();

  res.status(200).json({
    comment: userComment,
    message: "Comentário adicionado com sucesso!",
  });
};

const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
