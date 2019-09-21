var console = require("console");

module.exports.function = function sayYes (quiz, answer, $vivContext) {
  quiz.questions[0].text = "Do you want to start again?";

  console.log("answer", answer);
  console.log("log: quiz", quiz);

  return quiz;
}
