
function create()  {

        terminal.write("\r\nwhat type of game would you like to create?\r\n");
        context = "create";      
      

}
create.helpText = "Create a game"

async function createGame(command)  {


    const response = await fetch('http://localhost:3000/metagame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: command })
      });
      const result = await response.json();
      console.log(result);

      // const joke = JSON.parse(result.joke);
      // const jokeText = joke["text"];
    //   const cleanJoke = cleanJsonString(result.joke);
    //   activeJokeData = JSON.parse(cleanJoke);
    //   const jokeText = activeJokeData.text;


    terminal.write("\r\nGame created. Type 'play' to play the game\r\n");

    

}