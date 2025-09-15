import { Questions } from './Questions.js';
import { Choices } from './Choices.js';
import { TestQuestions } from './TestQuestions.js';
import { TestChoices } from './TestChoices.js';

Questions.hasMany(Choices, {
  foreignKey: "question_id",
  as: "choices",
  onDelete: "CASCADE",
});

Choices.belongsTo(Questions, {
  foreignKey: "question_id",
  as: "question",
});

TestQuestions.hasMany(TestChoices, {
  foreignKey: "question_id",
  as: "choices",
  onDelete: "CASCADE",
});

TestChoices.belongsTo(TestQuestions, {
  foreignKey: "question_id",
  as: "question",
});

export { Questions, Choices, TestQuestions, TestChoices };