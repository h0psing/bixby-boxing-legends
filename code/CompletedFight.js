var console = require("console");

module.exports.function = function completedFight (quiz, answer, $vivContext) {
  quiz.questions[0].text = "Do you want to start again?";

  console.log("answer", answer);
  console.log("log: quiz", quiz);

  if(answer.indexOf("yes") > -1) {
    console.log("log: yes");
     //quiz.yesNo = true;
     //quiz.completed = false;
     //quiz.state = "NEW";
     //quiz.newGame = true;
  } else {
    console.log("log: no");
    //quiz.yesNo = false;
  }

quiz.questions[0].text = "ok testing";
  console.log("log: quiz", quiz);

  return quiz;
}
