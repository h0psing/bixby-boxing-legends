var console = require("console");

module.exports = {
    sum: function(a,b) {
        return a+b
    },
    multiply: function(a,b) {
        return a*b
    },	
		fighterArray : [
			"lights out",
			"thunder",
			"bonecrusher",
			"hitman",
			"nigerian mightmare",
			"south paw",
			"fists of fury",
			"golden boy",
			"chop chop",
			"hurricane",
			"big daddy",
			"the greatest",
			"boom boom",
			"real deal",
			"the razor",
			"the duke",
			"pac man",
			"rocky",
			"iron mike"
  	],
		randomAttackGenerator(level) {
				
			var attackMovesArray = [
				"left jab",
				"right jab",
				"left hook",
				"right hook",
				"left uppercut",
				"right uppercut",
				"left cross",
				"right cross"
			];
				
			var defenceMovesArray = [
				"bob",
				"weave",
				"Parry",
				"block",
				"cover up",
				"clinch"
			];

			var preMoveCommentary = [
				"here comes the ",
				"he's coming ",
				"attacking ",
				"this is a great match "
			];
			
			var min=1; // beginner
			var max=5; // champ
			var output = "";
			var welcome = "welcome back, you're playing at  " + level + " level ,,";

			//console.log("[debug: randomAttackGenerator]");
			
			if (level.toLowerCase() == "beginner") {
				
				min = 1;
				max = 2;
				var moveCount = randomIntFromInterval(min,max); 
				//console.log("[debug: randomAttackGenerator] beginner");
				//console.log("[debug: randomAttackGenerator] moveCount: " + moveCount);
				output = getRandomMoves(attackMovesArray, moveCount);
				//console.log("[debug: randomAttackGenerator] output: " + output);
				
			} else if (level.toLowerCase() == "amateur") {
				//console.log("[debug: randomAttackGenerator] beginner");
				
				min = 1;
				max = 3;
				var moveCount = randomIntFromInterval(min,max); 
				//console.log("[debug: randomAttackGenerator] moveCount: " + moveCount);
				output = getRandomMoves(attackMovesArray, moveCount);
				
			} else if (level.toLowerCase() == "pro") {
				//console.log("[debug: randomAttackGenerator] beginner");
				
				min = 2;
				max = 4;
				
				var moveCount = randomIntFromInterval(min,max); 
				//console.log("[debug: randomAttackGenerator] moveCount: " + moveCount);
				output = getRandomMoves(attackMovesArray, moveCount);
				
			} else if (level.toLowerCase() == "contender") {
				//console.log("[debug: randomAttackGenerator] beginner");
				
				min = 3;
				max = 4;
				
				var moveCount = randomIntFromInterval(min,max); 
				//console.log("[debug: randomAttackGenerator] moveCount: " + moveCount);
				output = getRandomMoves(attackMovesArray, moveCount);
				
			} else if (level.toLowerCase() == "champ") {
				console.log("[debug: randomAttackGenerator] beginner");
			
				min = 3;
				max = 5;
				
				var moveCount = randomIntFromInterval(min,max); 
				//console.log("[debug: randomAttackGenerator] moveCount: " + moveCount);
				
				output = getRandomMoves(attackMovesArray, moveCount);
			
			}
		
			return output;
	
	},
	// Takes an array and converts it to a string separated by a space
	arrayToString (array) {
		let string = "";
		for (i=0; i < array.length - 1; i++) {
			string = string + " " + array[i];
		}
  	return string;
	},
	randomIntFromInterval (min, max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	// Takes the string and extracts left or right and puts it into an array (removes other words)
	getDirectionalArray(userBlock) {
		var blockSplitArray = userBlock.split(' ');
		var countBlock = blockSplitArray.length;
		var blockArray = [];
		//console.log("log: userBlock: ", userBlock);
		for (i = 0; i < blockSplitArray.length; i++) {
			if (blockSplitArray[i] == "left" || blockSplitArray[i] == "right") {
				blockArray.push(blockSplitArray[i]);
			}
		}
		//console.log("log: filtered string leaving only left/right: ", blockArray);
		return blockArray;
	},
	// Takes the string and removes other words non-punch words
	getPunchWordsOnlyArray(userAttack) {
		var blockSplitArray = userAttack.split(' ');
		var countBlock = blockSplitArray.length;
		var attackArray = [];
		//console.log("log: userAttack: ", userAttack);
		for (i = 0; i < blockSplitArray.length; i++) {
			if (blockSplitArray[i] == "hook" || blockSplitArray[i] == "uppercut" || 
					blockSplitArray[i] == "cross" || blockSplitArray[i] == "jab" || 
					blockSplitArray[i] == "left" || blockSplitArray[i] == "right") {
				attackArray.push(blockSplitArray[i]);
			}
		}
		let filteredAttack = " ";
		//console.log("log: filtered string leaving only attack: ", attackArray);
		for (i = 0; i < attackArray.length; i++) {
			filteredAttack = filteredAttack + " " + attackArray[i];
		}
		return filteredAttack;
	},
	getWelcomeMessage(attack) {
		var  speechOutput = "Welcome to Boxing Legends...";
	//speechOutput = speechOutput + "Rise up the ranks from beginner to the champion of the world...";
	//speechOutput = speechOutput + "but first... To punch... say left or right.  Then jab, cross, hook or . uppercut... ";
	//speechOutput = speechOutput + "To block punches, say, block, left or right, depending on the direction of the punch...";
  speechOutput = speechOutput + "He attacks..." +  attack + "... Block now...";
	console.log("log: getWelcomeMessage function: ", speechOutput);
		return speechOutput;
	},
	getNewGameMessage(attack) {
		var  speechOutput = "Great to see you back inthe ring..";
  speechOutput = speechOutput + "He attacks..." +  attack + "... Block now...";
	console.log("log: getWelcomeMessage function: ", speechOutput);
		return speechOutput;
	},
	countCorrectBlocks(attackArray, blockArray) {
		var count = 0;
		for (i = 0; i < attackArray.length; i++) {
			if (attackArray[i] === blockArray[i]) {
				count++;
			}
		}
		return count;
	},
	startNewMatch(match, attack, opponent) {


    var newAttack = attack;
    var speechOutput = "new game bro " + newAttack;



// **************

  console.log("log: speechOutput: ", speechOutput);
  console.log("log: opponent[0]: ", match);
  // setting opponent object to pass through the fight loop
  match.questions[0].text = speechOutput;
  console.log("opponent[0]: ", match[0]);
  match.title = newAttack;
  match.state = "BLOCK";
  match.computerPoints = 30;
  match.opponentName = opponent;

  var attackArray = newAttack.split(',');
  console.log("log: attackArray: ", attackArray);
  
  console.log("log: options: ", match.questions[0].options);
  var blockAnswer = "block ";
  for (i=0; i < attackArray.length; i++) {
    var array = attackArray[i].split(" ");
    console.log("log: array: ", array);
    for (k=0; k < array.length; k++) {
      if (array[k] == "left" || array[k] == "right") {
        blockAnswer = blockAnswer + " " + array[k] + " ";
      }
    }
    
  }

  console.log("log: match: ", match);

  match.questions[0].options[0].text = "block left right left";
  match.questions[0].options[1].text = blockAnswer;
  match.questions[0].options[2].text = "block left right";

// **************


  match.playerPoints = 10;
  match.computerPoints = 10;




		return match;
	}
};

// Private variables and functions which will not be accessible outside this file

var randomIntFromInterval = function (min, max) 
{
	return Math.floor(Math.random()*(max-min+1)+min);
};

var getRandomMoves = function (attackMovesArray, moveCount) // min and max included
{
	//console.log("[debug: getRandomMoves]");
	var output = "";
	console.log(moveCount);
	//console.log("[debug: getRandomMoves] attackMovesArray " + attackMovesArray);
	console.log(randomIntFromInterval(0,attackMovesArray.length));
	for (i=0; i<moveCount; i++) {
		if (i==0) {
			output = attackMovesArray[randomIntFromInterval(0,attackMovesArray.length-1)];	
		} else {
			output = output + "," + attackMovesArray[randomIntFromInterval(0,attackMovesArray.length-1)];	
		}				
	}
	
	console.log(output);
	
	return output;
}
