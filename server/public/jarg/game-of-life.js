const winningConditions = [
    {
      goal: 'Gain 100,000 gold coins',
      actions: ['work', 'trade', 'explore', 'steal'],
    },
    {
      goal: 'Discover the hidden secret of the ancient temple',
      actions: ['explore', 'research', 'decode', 'solve'],
    },
    {
      goal: 'Master the art of sword fighting',
      actions: ['train', 'practice', 'compete', 'spar'],
    },
  ];

  terminal.writeln('Choose your winning condition:');
  for (let i = 0; i < winningConditions.length; i++) {
    terminal.writeln(`${i + 1}: ${winningConditions[i].goal}`);
  }
  
  return new Promise((resolve) => {
    onTerminalData = (data) => {
      const choice = parseInt(data.trim(), 10);
      if (choice >= 1 && choice <= winningConditions.length) {
        resolve(winningConditions[choice - 1]);
        terminal.offData(onTerminalData); // Stop listening for input
      } else {
        terminal.writeln('Invalid choice. Please try again.');
      }
    };
  });
}



// Simple state management
const state = {
  memory: {},
  time: 0,
  artifacts: [],
  coreArtifacts: { name: '', location: '' },
  body: { energy: 100 },
  winningCondition: null
};

const processInput = (input) => {
  // Game logic based on user input
  // Example: if (input === 'eat') { state.body.energy += 10; }

  term.write(`\r\nYou entered: ${input}`);
};

// Listen for user input
term.onData((data) => {
  switch (data) {
    case '\r': // Enter key
      processInput(term.buffer.active.cursorX);
      term.write('\r\n> ');
      break;
    case '\x7F': // Backspace key
      term.write('\b \b');
      break;
    default:
      term.write(data);
  }
});

// Start the game
term.write('Welcome to Life: The Text-Based Adventure!\r\n');
term.write('Enter your actions below:\r\n> ');
const move = () => {
    // Add code to change the player's location
    term.write('\r\nYou move to a new location...');
  };
  
  const explore = () => {
    // Add code for exploring the current location
    term.write('\r\nYou start exploring the area...');
  };
  
  const read = (objectName) => {
    const object = objects[objectName];
  
    if (object) {
      term.write(`\r\nYou read the ${object.title}:`);
      term.write(`\r\n${object.content}`);
    } else {
      term.write('\r\nThere is nothing to read with that name.');
    }
  };


  const talk = () => {
    // Add code for talking to characters in the game
    term.write('\r\nYou strike up a conversation...');
  };
  
  const look = (objectName) => {
    const object = surroundings[objectName];
  
    if (object) {
      term.write(`\r\nYou look at the ${objectName}:`);
      term.write(`\r\n${object.description}`);
    } else {
      term.write('\r\nThere is nothing to look at with that name.');
    }
  };
    
  const eat = () => {
    state.body.energy += 10;
    term.write('\r\nYou ate some food and gained 10 energy.');
  };
  
  const sleep = () => {
    state.body.energy += 20;
    term.write('\r\nYou slept well and gained 20 energy.');
  };
  
  const status = () => {
    term.write(`\r\nEnergy: ${state.body.energy}`);
  };
  
  const processInput = (input) => {
    // Remove extra whitespace and split input into command and arguments
    const [command, ...args] = input.trim().split(/\s+/);
  
    switch (command.toLowerCase()) {
      case 'eat':
        eat();
        break;
      case 'sleep':
        sleep();
        break;
      case 'move':
        move();
        break;
      case 'explore':
        explore();
        break;
        case 'read':
            if (args.length > 0) {
              read(args[0]);
            } else {
              term.write('\r\nPlease specify an object to read.');
            }
            break;
            case 'talk':
        talk();
        break;
    case 'look':
      if (args.length > 0) {
        look(args[0]);
      } else {
        term.write('\r\nPlease specify an object to look at.');
      }
      break;
    case 'status':
        status();
        break;
      default:
        term.write('\r\nUnknown command. Try again.');
    }
  
    term.write('\r\n> ');
  };
  

chooseWinningCondition().then((winningCondition) => {
  terminal.writeln(`Your chosen winning condition is: "${winningCondition}"`);
});

  const objects = {
    book: {
      title: "The Mysterious Island",
      content: "This is a novel by Jules Verne about a group of people who become stranded on an island...",
    },
    note: {
      title: "A Crumpled Note",
      content: "You can barely make out the scribbled words: 'Beware the creature in the forest...'",
    },
    sign: {
      title: "Weathered Sign",
      content: "The sign reads: 'Welcome to the Village of Mysteria.'",
    },
  };

  const surroundings = {
    tree: {
      description: "A tall, sturdy oak tree with branches reaching for the sky.",
    },
    house: {
      description: "A small, weathered house with a thatched roof and a wooden door.",
    },
    river: {
      description: "A clear, bubbling river that winds its way through the forest.",
    },
  };
  
  