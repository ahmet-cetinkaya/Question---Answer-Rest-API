const Question = require('../models/Questions');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;

  const question = await Question.create({
    ...information,
    user: req.user.id,
  });

  res.status(200).json({ success: true, data: question });
});

const getAllQuestions = async (req, res, next) => {
  const questions = await Question.find();
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

module.exports = { askNewQuestion, getAllQuestions, getSingleQuestion };
