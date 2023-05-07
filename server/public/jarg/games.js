
function simplifiedTextBattleship() {
    const hiddenShip = Math.floor(Math.random() * 10);
    let guesses = 3;
    
    while (guesses > 0) {
      const playerGuess = parseInt(prompt("Guess a number between 0-9:"));
      if (playerGuess === hiddenShip) {
        alert("You sunk my battleship!");
        break;
      } else {
        guesses--;
        alert("Miss! " + guesses + " guesses remaining.");
      }
    }
    
    if (guesses === 0) {
      alert("Game over! My battleship was at position " + hiddenShip);
    }
  }
  

function bettingGame() {
  let balance = 100;
  const placeBet = () => {
    term.write('\nEnter your bet (1-10): ');
    term.onData(data => {
      const bet = parseInt(data.trim());
      if (bet >= 1 && bet <= 10 && bet <= balance) {
        const outcome = Math.floor(Math.random() * 10) + 1;
        if (bet === outcome) {
          balance += bet * 2;
          term.write(`\nYou won! Your new balance is ${balance}.`);
        } else {
          balance -= bet;
          term.write(`\nYou lost. The outcome was ${outcome}. Your new balance is ${balance}.`);
        }
        if (balance > 0) {
          playAgain();
        } else {
          term.write('\nGame over. You have no more balance.');
        }
      } else {
        term.write('\nInvalid bet. Try again.');
        placeBet();
      }
    });
  };
  bettingGame.gameText = "betting game"

  const playAgain = () => {
    term.write('\nDo you want to play again? (y/n): ');
    term.onData(data => {
      const choice = data.trim().toLowerCase();
      if (choice === 'y') {
        placeBet();
      } else if (choice === 'n') {
        term.write('\nThanks for playing!');
      } else {
        term.write('\nInvalid choice. Try again.');
        playAgain();
      }
    });
  };

  term.write(`Welcome to the betting game! You start with a balance of ${balance}.`);
  placeBet();
}


function simplifiedTextBattleship() {
    const hiddenShip = Math.floor(Math.random() * 10);
    let guesses = 3;
    
    while (guesses > 0) {
      const playerGuess = parseInt(prompt("Guess a number between 0-9:"));
      if (playerGuess === hiddenShip) {
        alert("You sunk my battleship!");
        break;
      } else {
        guesses--;
        alert("Miss! " + guesses + " guesses remaining.");
      }
    }
    
    if (guesses === 0) {
      alert("Game over! My battleship was at position " + hiddenShip);
    }
  }
  