

function bots() {

    terminal.write(`\nYou have zero bots\r\n$ `);
    context="Bot";
}

function createBot() {

    // terminal.write("\nYou need a place to have a bot\n");

      terminal.write("\nYou are creating one bot at a cost of 0.05 ETH per bot\n\n");
      chooseBot();
}

function chooseBot() {

    terminal.write("\nSet your initial bot type: defender, predator, harvester\n");

}


function defenderBot() {

    terminal.write("\nBot created\n");

    terminal.write("\nInitial stats:  70 speed, 30 health, 25 firepower");

}

function listBot() {


    terminal.write("\nYou have one defender bot\n");

}

function updateBot() {

    terminal.write("\nYou have one defender bot\n");

}
