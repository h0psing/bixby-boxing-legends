var console = require("console");
const helperFunctions = require("./helperFunctions.js")
const commentaryFunctions = require("./commentaryFunctions.js")

function findItems(items, searchTerm) {
  var matches = []
  for (var i=0; i<items.length; i++) {
    if (matchTag(items[i].tags, searchTerm)) {
      matches.push(items[i])
    }
  }
  return matches
}

//returns true if there is an element in a list of tags that matches a specific tag
function matchTag(tags, tag) {
  for (var i=0; i<tags.length; i++) {
    if (tag.toLowerCase() == tags[i].toLowerCase()) {
      return true
    }
  }
  return false
}

function buildQuestionsFromJson(quizJson) {
  var questions = []
  for (var i=0; i<quizJson.questions.length; i++) {
    questions.push(buildQuestionFromJson(quizJson.questions[i], i))
  }
  return questions
}

function buildCorrectAnswerText(question){
  if(Array.isArray(question.answer)){
    return question.answer[0];
  } else if (typeof question.answer === 'number'){
    return question.options[question.answer];
  } else if (typeof question.answer === 'string') {
    return question.answer;
  }
}

function buildQuestionFromJson(questionJson) {
  if (!questionJson) {
    return null
  }
  var options = []
  if (questionJson.options) {
    for (var i=0; i<questionJson.options.length; i++) {
      options.push({
        text: questionJson.options[i],
        alias: String.fromCharCode('A'.charCodeAt(0) + i)
      })
    }
  }
  var question = {
    text: questionJson.question,
    options: options,
    correctAnswer: {
      acceptedAnswers: buildAcceptedAnswers(questionJson.answer, options),
      explanation: questionJson.explanation,
      text: buildCorrectAnswerText(questionJson)
    }
  }
  return question
}

// 
function buildQuestionToSpeak(question) {
  var options = question.options
  optionsString = ''
  for (var i=0; i< options.length; i++) {
    optionsString += options[i].alias + '... ' + options[i].text + (i+1 < options.length ? ', ... ' : '')
  }
  return optionsString;
}

function buildAcceptedAnswers(answer, options) {
  var acceptedAnswers = []
  if (Array.isArray(answer)) { //is answer an array?
    for (var i=0; i<answer.length; i++) {
      acceptedAnswers = acceptedAnswers.concat(buildAcceptedAnswers(answer[i], options))
    }
  } else if (typeof answer === 'number' && options && answer < options.length) {
    acceptedAnswers.push(options[answer].alias)
    acceptedAnswers.push(options[answer].text)
  } else if (answer) {
    acceptedAnswers.push(answer)
    //also push all aliases matching the answer
    if (options) {
      for (var i=0; i<options.length; i++) {
        if (options[i].text == answer) {
          acceptedAnswers.push(options[i].alias)
        }
      }
    }
  }
  return acceptedAnswers
}


function buildOpponent(searchTerm){
  var opponent = [];
  console.log("log: buildOpponent function");

  
  var quizzes = require("../data/fights");

  if (searchTerm) {
    const foundQuiz = findItems(quizzes, searchTerm)
    if(foundQuiz.length > 0){
      quizzes = foundQuiz;
    }
  }
  
  var attack = helperFunctions.randomAttackGenerator("PRO");
  var opponentList = commentaryFunctions.fighterArray;
  console.log("log: opponents: ", opponentList);
  var opponentName = "bone crusher";

  

  //var attack = helperFunctions.randomAttackGenerator("PRO");
  
  var computerPlayer = {
    title: "Contender",
    tags: ["contender", "animal"], //used to find this quiz
    score: 30,
    playerPoints: 20,
    computerPoints: 20,
    index: 0,
    level: "PRO",
    completed: false,
    image: {
      url: "/images/Animals.jpeg",
    },
    questions: [
      {
        question: attack,
        options: ["right jab left hook", "left cross", "right hook left uppercut"],
        answer: 0,
        explanation: "Because it's cold. Get it?",
        text: "test here",
        correctAnswer: "correct",
      },
    ],
  };

  console.log("log: computerPlayer: ", computerPlayer);
  console.log("log: opponent: ", opponent);
  
  //opponent.push(computerPlayer);


    var quiz = quizzes[0];
    quiz.completed = false;
    quiz.score = 30;
    quiz.computerPoints = 20;
    quiz.playerPoints = 20;
    quiz.level = "BEGINNER";
    quiz.index = 0;
    var questions = buildQuestionsFromJson(quiz);
    quiz.textToSpeak = buildQuestionToSpeak(questions[0]);
    //cannot start a quiz without any questions
    if (!questions || !questions.length) {
      console.log("Chosen quiz has no questions!");
    } else {
      quiz.questions = questions;
      opponent.push(quiz)
    }


  
  return opponent;
  

}

function buildQuizzes_X(searchTerm){
  var quizzes = require("../data/quizzes");
  if (searchTerm) {
    const foundQuiz = findItems(quizzes, searchTerm)
    if(foundQuiz.length > 0){
      quizzes = foundQuiz;
    }
  }
  var formattedQuizzes = [];
  //read the questions in the quiz and initialize the state
  for (var i=0; i<quizzes.length; i++) {
    var quiz = quizzes[i];
    quiz.completed = false;
    quiz.score = 0;
    quiz.index = 0;
    var questions = buildQuestionsFromJson(quiz);
    quiz.textToSpeak = buildQuestionToSpeak(questions[0]);
    //cannot start a quiz without any questions
    if (!questions || !questions.length) {
      console.log("Chosen quiz has no questions!");
    } else {
      quiz.questions = questions;
      formattedQuizzes.push(quiz);
    }
  }
  return formattedQuizzes;
}

module.exports = {
  buildOpponent:buildOpponent,
  buildQuizzes_X:buildQuizzes_X,
  buildQuestionToSpeak:buildQuestionToSpeak
}