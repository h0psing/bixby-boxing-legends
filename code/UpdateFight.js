const { buildQuestionToSpeak } = require("./lib/util");
const helperFunctions = require("./lib/helperFunctions");
const commentaryFunctions = require("./lib/commentaryFunctions.js")
var console = require("console");
var remoteDB = require('./lib/remoteDB.js');

module.exports.function = function updateFight (quiz, answer, $vivContext) {

  let speechOutput;
  console.log("log: answer input from player: ", answer);
  if(answer.indexOf("yes") > -1) {
    console.log("yes")
    if (quiz.newGame == true) {
          // get new opponent
        var opponentIndex = helperFunctions.randomIntFromInterval(0,helperFunctions.fighterArray.length-1);
        var opponentName = helperFunctions.fighterArray[opponentIndex]; 
        var newAttack = helperFunctions.randomAttackGenerator("CHAMP");

        quiz = helperFunctions.startNewMatch(quiz, newAttack, opponentName);
        console.log("log: new game quiz: ", quiz);

        speechOutput = "You're back... Your next opponent is... " + opponentName;

        speechOutput = speechOutput + "..." + newAttack;

        quiz.questions[0].text = speechOutput;
        
        quiz.title = newAttack;
        quiz.newGame = false;
        quiz.state =  "BLOCK";
        quiz.score = 20;
        quiz.computerPoints = 20;
        console.log("log: quiz.state: ", quiz.state);
        return quiz;
    }

  } 

  if(answer.indexOf("no") > -1) {
    console.log("no")
    console.log("log: no: quiz.newGame: ", quiz.newGame);
    speechOutput = "see you later ";
    if (quiz.newGame == true) {
        quiz.questions[0].text = speechOutput;
        quiz.newGame = false;
    }
    return quiz;
  } 


  const bixbyUserId = $vivContext.userId;
  
  // set level for player
  var level = quiz.level;
  var COMPUTER_POINTS_LOSS = 10;
  var PLAYER_POINTS_LOSS = 10;
  var opponentName = quiz.opponentName;

  // set up to use only first 'quiz' question but will refactor
  const j = 0;

  // setting up next attack if game is not finished by knock out
  var followUpAttack = helperFunctions.randomAttackGenerator(level);
    //var computerAttack = helperFunctions.	randomAttackGenerator("PRO");
  var computerAttack = quiz.title;
  console.log("log: computerAttack (quiz.title): ", computerAttack);
  console.log("log: computerAttack (quiz.level): ", quiz.level);

  // user block
  var userBlock = answer;
  var attackArray = helperFunctions.getDirectionalArray(computerAttack.replace(/,/g, ' '));
  var blockArray = helperFunctions.getDirectionalArray(userBlock);
  var previousAttackArray = helperFunctions.getDirectionalArray(followUpAttack.replace(/,/g, ' '));

  console.log("log: options: ", quiz.questions[j].options);
  var blockAnswer = "block";
  for (i=0; i < previousAttackArray.length; i++) {
    blockAnswer = blockAnswer + " " + previousAttackArray[i] + " ";
  }

  quiz.questions[j].options[0].text = "block left right left";
  quiz.questions[j].options[1].text = blockAnswer;
  quiz.questions[j].options[2].text = "block left right";

  console.log("log: options: ", quiz.questions[j].options);

  // ********************
  // *** HANDLE BLOCK ***
  // ********************
  console.log("log: quiz.state: ", quiz.state);

  if (quiz.state == "BLOCK") {

    console.log("log: quiz", quiz);
    console.log("log: text: ", quiz.questions[j].text);
    console.log("log: question: ", quiz.questions[0]);


    quiz.questions[j].text = computerAttack;
    quiz.textToSpeak = computerAttack;

    console.log("log: computerAttack", computerAttack);
    console.log("log: playerScore: ", quiz.questions[j].playerScore);
    console.log("log: attackArray:", attackArray );
    console.log("log: blockArray:", blockArray );
    
    var correctBlocks = helperFunctions.countCorrectBlocks(attackArray, blockArray);
    var landedPunches = attackArray.length - correctBlocks;
    
    var playerScore = quiz.score;
    playerScore = playerScore - (landedPunches * PLAYER_POINTS_LOSS);
    quiz.score = playerScore;

    console.log("log: correctBlocks:", correctBlocks );
    console.log("log: landedPunches:", landedPunches );

    // setting up responses for different situations
    var encouragementArray = commentaryFunctions.encouragementArray;
    var blockAllCommentaryArray = commentaryFunctions.blockAllCommentaryArray;
    var blockOnlyCommentaryArray = commentaryFunctions.blockOnlyCommentaryArray;
    var counterAttackArray = commentaryFunctions.counterAttackArray;

    console.log("log: encouragementArray", encouragementArray);
    console.log("log: blockAllCommentaryArray", blockAllCommentaryArray);
    console.log("log: blockOnlyCommentaryArray", blockOnlyCommentaryArray);
    console.log("log: counterAttackArray", counterAttackArray);


    // setting up random commentary
    var speechOutput = "";
    var encouragement = encouragementArray[helperFunctions.randomIntFromInterval(0,encouragementArray.length-1)];
    var blockedAllPunchesMsg = blockAllCommentaryArray[helperFunctions.randomIntFromInterval(0,blockAllCommentaryArray.length-1)];
    var blockedOnePunchesMsg = blockOnlyCommentaryArray[helperFunctions.randomIntFromInterval(0,blockOnlyCommentaryArray.length-1)];
    var counterAttackMsg = counterAttackArray[helperFunctions.randomIntFromInterval(0,counterAttackArray.length-1)];

    if (playerScore > 0) {
      if (correctBlocks === attackArray.length) {
        // user blocks all the punches
        quiz.completed = false; // ensure the boxing match is not ended as player still has points
        speechOutput = encouragement;
        if (attackArray.length > 1) { 
          speechOutput = speechOutput + blockedAllPunchesMsg + counterAttackMsg;
        } else {
          speechOutput = speechOutput + blockedOnePunchesMsg + counterAttackMsg;
        }
        
        // console.log(speechOutput);
        // console.log("generate block: ", followUpAttack);

        // generating player's attack options
        quiz.questions[j].options[0].text = helperFunctions.randomAttackGenerator("PRO").replace(/,/g, ' ');
        quiz.questions[j].options[1].text = followUpAttack.replace(/,/g, ' ');
        quiz.questions[j].options[2].text = helperFunctions.randomAttackGenerator("AMATEUR").replace(/,/g, ' ');

        // setting state for expect attack from player
        quiz.state = "ATTACK";

      } else {
        
        speechOutput = speechOutput + " He lands " + landedPunches;
        // setting state to BLOCK so user needs to block again
        quiz.state = "BLOCK";
        // handles multiple or single landed punches
        if (landedPunches > 1) {
          speechOutput = speechOutput + " punches ... ";
        } else {
          speechOutput = speechOutput + " punch ... ";
        }
        speechOutput = speechOutput + "Your health is . " + quiz.score + "...";

        // generating random commentary to say the player is attacking
        speechOutput = speechOutput + 
        commentaryFunctions.attackCommentArray[helperFunctions.randomIntFromInterval(0, commentaryFunctions.attackCommentArray.length-1)];

          speechOutput = speechOutput + followUpAttack;
          computerAttack = followUpAttack;
        }

    } else {
      // player score is zero and boxing match ends
      speechOutput = speechOutput + commentaryFunctions.knockOutCommentary[helperFunctions.randomIntFromInterval(0, commentaryFunctions.knockOutCommentary.length-1)];

			speechOutput = speechOutput + ",your health is 0,";
			//speechOutput = speechOutput + "," + knockOutCommentary[randomIntFromInterval(0,knockOutCommentary.length-1)] + "," + "<audio src='soundbank://soundlibrary/animals/amzn_sfx_bear_groan_roar_01'/>";
			
			
			if (level == "BEGINNER") {
				speechOutput = speechOutput + "this is a tough sport, are you sure you're up for it?";
			} else if (level == "AMATEUR") {
				speechOutput = speechOutput + "back to the gym.  more blood, sweat and tears are needed, ";			
			} else if (level == "PRO") {
				speechOutput = speechOutput + "too bad, you could have been somebody, you could have been,, a contender, ";	
			} else if (level == "contender") {
				speechOutput = speechOutput + "you are no longer a contender, it takes blood and guts to get back up, let's see if you're up for it, ";
				quiz.level = "PRO";			
			} else if (level == "CHAMP") {
				speechOutput = speechOutput + "you've lost the heavyweight title, and moved back to contender, it's time to climb the mountain again,";
				quiz.level = "CONTENDER";			
			}

      speechOutput = speechOutput + "..." + "Do you want to play again?";
      quiz.state = "END";
      //quiz.completed = true;
      quiz.newGame = true;
    }

    quiz.textToSpeak = speechOutput;
    quiz.questions[quiz.index].correct = true;
    quiz.questions[quiz.index].correct = speechOutput;
    //console.log("log: speechOutput: ", speechOutput);
    quiz.questions[j].text = speechOutput;

    //console.log("log: quiz: ", quiz);

  } else if (quiz.state == "ATTACK") {

    // ********************
    // *** HANDLE ATTACK ***
    // ********************

    console.log("log: quiz.state: ", quiz.state);

    var inputAttack = answer;

    var bixbyResponse = "You attack ... " + helperFunctions.getPunchWordsOnlyArray(inputAttack) + " ... ";

    // randomly generates a player attack result for the computer
    // some situations the computer gets hit, some not
    var index = helperFunctions.randomIntFromInterval(0, commentaryFunctions.computerCounterResponseArray.length-1);
    console.log("log: index: ", index);
    bixbyResponse = bixbyResponse + commentaryFunctions.computerCounterResponseArray[index] + "...";
    console.log("log: computerCounterResponseArray[index]", commentaryFunctions.computerCounterResponseArray[index]);	

    // generating followup attack (if required)	
    // followUpAttack = helperFunctions.randomAttackGenerator(level);
    // setting state to require a block from user
    quiz.state = "BLOCK";
    //var computerPoints = computerPoints;

    // randomised the situation where the computer gets hit and loses points based on the computerCounterResponseArray
    console.log("xxx");
    if (index == 0 || index == 4 || index == 5 || index == 6 || index == 7 || index == 8)  {
      console.log("yyy");
      console.log("log: computerPoints: ", quiz.computerPoints);
      quiz.computerPoints = quiz.computerPoints - COMPUTER_POINTS_LOSS;
      console.log("log: computerPoints: ", quiz.computerPoints);
      bixbyResponse = bixbyResponse + opponentName + "'s" + " health is " + quiz.computerPoints + "...";
      // win for player
      if (quiz.computerPoints < 10) {
        console.log("zzz: ", level);
        bixbyResponse = bixbyResponse  + "Congratulations, you are victorious!  your opponent is down and out...";
        
        if (level == "BEGINNER") {
          bixbyResponse = bixbyResponse + "You are now an amateur...";
          level = "AMATEUR";
        } else if (level == "AMATEUR") {
          bixbyResponse = bixbyResponse + "Welcome to the pro ranks...";
          level = "PRO";			
        } else if (level == "PRO") {
          bixbyResponse = bixbyResponse + "You are now a contender...";
          level = "CONTENDER";			
        } else if (level == "CONTENDER") {
          bixbyResponse = bixbyResponse + "You're the... heavyweight champion... of the world!...";
          level = "CHAMP";			
        } else if (level == "CHAMP") {
          bixbyResponse = bixbyResponse + "You're still... the heavyweight champion... of the world!...";
          level = "CHAMP";			
        }
        bixbyResponse = bixbyResponse + "Do you want to play again?"
        quiz.questions[j].text = bixbyResponse;
        quiz.state = "END";


          quiz.level = level;
          console.log("log: quiz.level: ", quiz.level);
          console.log("log: remoteDB.putUserData");
          // updates user data entry in remote DB
          //remoteDB.putUserData(bixbyUserId, quiz)
          //quiz.completed = true;
          quiz.newGame = true;



      } else {
        bixbyResponse = bixbyResponse + commentaryFunctions.attackCommentArray[helperFunctions.randomIntFromInterval(0, commentaryFunctions.attackCommentArray.length-1)];
        bixbyResponse = bixbyResponse + "..." + followUpAttack + "... Block now.";

        // setting bixby response
        quiz.questions[j].text = bixbyResponse;

      }
    } else {
      bixbyResponse = bixbyResponse + commentaryFunctions.attackCommentArray[helperFunctions.randomIntFromInterval(0, commentaryFunctions.attackCommentArray.length-1)];
      bixbyResponse = bixbyResponse + "..." + followUpAttack + "... Block now.";

      // setting bixby response
      quiz.questions[j].text = bixbyResponse;
    }



  }

  // *** END HANDLE ATTACK ***
  // *************************

  // set next attack
  quiz.title = followUpAttack;
  console.log("log: quiz.title: ", quiz.title);

  console.log("log: quiz: ", quiz);

  return quiz;
}


