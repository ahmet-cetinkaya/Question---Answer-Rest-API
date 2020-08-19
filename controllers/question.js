const Question = require('../models/Questions');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;
  console.log(`!: askNewQuestion -> information`, information);

  const question = await Question.create({
    ...information,
    user: req.user.id,
  });

  res.status(200).json({ success: true, data: question });
});

const getAllQuestions = async (req, res, next) => {
  let query = Question.find();
  if (req.query.search) {
    const searchObject = {};
    const regex = new RegExp(req.query.search, 'i');
    searchObject['title'] = regex;
    query = query.where(searchObject);
  }

  const questions = await query;

  return res.status(200).json({
    success: true,
    data: questions,
  });
};

const getSingleQuestion = async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  return res.status(200).json({
    success: true,
    data: question,
  });
};

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const information = req.body;

  const question = await Question.findByIdAndUpdate(id, information, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, data: question });
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  await Question.findByIdAndDelete(id);

  return res.status(200).json({ success: true, message: 'Question delete operation Successfully' });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  if (question.likes.includes(req.user.id)) {
    return next(new CustomError('You already liked this question', 400));
  }
  question.likes.push(req.user.id);
  question.save();
  return res.status(200).json({ success: true, data: question });
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);
  if (!question.likes.includes(req.user.id)) {
    return next(new CustomError('You cannot undo like operation for this question.', 400));
  }
  const index = question.likes.indexOf(req.user.id);
  question.likes.splice(index, 1);
  question.save();
  return res.status(200).json({ success: true, data: question });
});

module.exports = {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
