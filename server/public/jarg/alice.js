



function yes() {
  // terminal.write("\r\nwhere are you?\r\n");

    shrinkTerminal();

  }


  function expand() {
    // terminal.write("\r\nwhere are you?\r\n");
  
      shrinkTerminal();
  
    }
  
  async function loadAlice() {

    console.log("loadalice");
    const aliceText = await fetch("jarg/alice.txt").then(response => response.text());
    const length = 101;
    terminal.write('\n\r');
  
    for(i=length;i<aliceText.length;i+=length)
    {
    terminal.write(aliceText.substring(i-length,i) + '\r');
    }
  
    terminal.write('Hello my name is Alice. Would you like to find your way to the heart of the maze?\r\n');
  
}

 async function no() {

      // const aliceText = await fetch("jarg/alice.txt").then(response => response.text());
      // const length = 101;
      // terminal.write('\n\r');

      // for(i=length;i<aliceText.length;i+=length)
      // {
      // terminal.write(aliceText.substring(i-length,i) + '\r');
      // }

      // terminal.write(aliceText);

  }

  // var aliceImage = "
  //                                             ....:                                                  
  //                                          ::::^^:   :^::::7~:..     .^:::                          
  //                       .:.             :^^:::.      ...::^?7:^^^^.   .^..^.     :^..               
  //            ~^:..     .^..:::   ^:::. .^:.:::^~!!!~~.       ..         ^:.^:     .^^^:.            
  //          .^^~.^!: ^?~^.   .~..^  !~::  :~!!7777!^..          ...:      :::!:       :^~^:          
  //         .~^ ^~^: ^:!: ?!^.^.:: ^J ::   ..:^.:.             ^!77777~.       .  .::~::: ..          
  //        :~^..:!. ^:.?7 ~~^: ^^ ~!.^:....::.^^                 .~7?777~:        ::.Y^ ^             
  //       ^^ :77:^^!J:.^~:~^:   .:~~^.~.. .YJ  ^^           .       :!7!77~       .~    ~.            
  //       . ^:^^ ^7~!. ?~^   ~^:   .  :^  .^~::::          ??^        ...          ~ !J ^.            
  //       .^: .?:^~:.:^!^  .^77.!!~    ^^^::..         ..^7?77~                    ^:!!.^.            
  //      :!!? .:~YJ.!~^.  :~.^:.7J:                   ~^^^^!777                     .    :::::~       
  //      .^~::!?....J7:  .?~..7:^.   :~^:.          :~:.!~^~!~:    ^!7!77?JYJ!:          !    ~.      
  //       ^   ^..J5 .:   ^7~:57^  :..7!??7.      .:^: .7~..       ?5P5J7!!?JJP#5^        ^.~Y7.^      
  //      ^::.^?Y.^7:^ .^:...^7^.:^777!!?7.     .^^.  ~?:        .!..^7Y?!~^~!7Y#&Y.      .^.?^ ~      
  //     ^:^ .::!7??~.:~!?77! ^^!77!77!!7^     :~.  .J!         .?.    ^?77?!??75G&5       ~^...^.     
  //    ^.^^:. .~?! .Y!!~Y7?~.:^7!!!^?!!77    :!    JJ          :P!5Y^   :Y?^:J!PP##J      ...         
  //   :::^7??^~  . .7!~J77J777!J~^^!7!77.   .!  .^JG:    .^.  :~::PPY:  !G7!^5555GPG5~                
  //   .:^75?!!..^?! :::Y7?7!7!??~~~7!!J^    ^7.  ^!7??~?^JG!7~~Y:  ... .PY7JGP5PGP5#BGY~.             
  //   ::~J57!?J.  ~.^:! :!!^!^!~:~!~!~7~~  :.^!~:    :!G55?7~^^P!     75J^J5PJ7JG?5G#PGB5!.   .       
  //   .~5Y!^~!7  5J: :!. .~!.^!~^^~!~!!?~  :^^..^^^:. :?5?~!!:!~.    ^YY!7YY?777JYGPPPGGP5?^:::^.     
  //  .~JJ7J!JG!::!!. ^~!!~?7.^7:^^~~!!7!~^ .^~^.  .:~7?5Y!7J!^^?J7YGGGP5!JYJ??~?J5GGG555Y5J?^  :Y.    
  //  ^77!!?7JJ: ~!: .^!7!77!^:^ ^^~~!!?77~ .:!7!^: .?PPY7^!?!7YP5^?#BY777?5?YJ 5JYYGGGPP?!~!~ ..77    
  //   .:^~77J: :!?.:5!.!5GJ.:~. :~7!?JJJ??7?JJ?Y?~.   7PP^77J5PPJ^:!5777?YPJB! 557YB#B5GP5J~7:.^:?:   
  //    .!~:^~^.~7^ .J^.Y5G~:^:  :7!??J?YJ55YY?7JYJ!:   7B~::^J!P7.^^JY77?Y5P#B~~75YJPBGP55YY7^..~.    
  //    ~!?  J?^:~ .!. 75P5.   .~J?!?JYJJPG555???JYJ?~: :P^.^^:^~5:.^YPJ~^7PJP#G..:Y55PB#BJ?7?!::.:    
  //   :~~..^~^  ::~P~^J?P~    :?YJJ?55YPPGP55JYJ?JJ7!!::J:.!~:^.~J..:^Y! .!^J##?   ^?5PBPJ?7^!~^.^.   
  //   ~~J?.^!7^^^. ~Y^.7J:.... !5Y5J555GGGGPPPGYYYYJ77!^7^ ~~^   !J.   ..^^75BPG~    :7PY7PJ...7!~    
  //  :~^^^  ^?~:~::!!::~.:7!^:^?5Y?7?JYPBGBPGGGGGPP?7777~: ~~~    ^^  .^^~J5GY5PP:     !P:?!   ^~^    
  //  .~~!!:::^^~^ ~P5: ! ^Y5! 7P575~ 5!5GGBGGGGBBB5?77??!..!?! ~^    .^~JGYJPP?5YJ:    :G:.   .:7^    
  //  .!^77.  ?!7   .. ::   . .5GG^ Y7~!YYPBBBGGG#GJ!!!7?7~~~7!^~J7::^7JYGP^!!?7?!?!!~. ~5^^::^!~7?^   
  //  ^^^^::~7^^^^.!^..^ ~J7. !557?~7Y!!~!BG##BGPJ77!!JYYYJ?!^^^^^~!7JG5Y7~!.:~.~~~!~7!7??~^~^^!777    
  //  ^^~^^!!?^::^::...^^:?! .?7?!:^^J7~^JBPB#GY~~!^^!7~!~:...!.~7!^7J#Y~!!!!~~. .:~!^^!~7!:^~~~7~^    
  //  :^^~?@J   JG~^  :~^.   .:^~Y~~7?7~!PPGP?!!!^:77^:~~:77~~~^~.~^^7G#P!!!!!J^.~~^Y7 !?JJ!~^^^~^.    
  //   ^^^ ^.   YP7. .~:J??7?!:7^~~~7Y!~75GY!^^^^^^.:!!^^~^:~~J#7.~^ 7B?^!?YY77Y7!!^.  :YPYJ!!~!^ ^    
  //  :^~.:       7..^^!.~!^7J7?^~~?!!^!?YJ^:~:^^ .!!^^~ ^. .?Y~:!~ .GP::!YBY7J77?.:^^Y!^PGY?~~7~.     
  //  .^^5#.   !:^Y55^::7~^~!^YPY~~7~~!!?!.~!..^ ^?7~^^.:^..^^ ^?!: 5GPJ .J#PJY7^~!..^!?7?#PJ~^~.^     
  //   ~^#P.  ?&??7GG: .J7!7!^#&G~~~~~?Y^:~7..~.~Y!~~~!~^::.   7J! !G!JP!^7YB#PYY~.!~:!~J?PB??!:!~^    
  //  :^ :    7JJJ:    ~&BP5Y5B#?~!^7GJ.:?!..~^7?7^.~!:^:  :~.:5Y..G:7!!J:^~!5#PJY?~7!7~~YJJ?J7~^.:.   
  //  ^:7       J5P:   YPGG5?G5P7~:JB7. ~?^ ^^??7:~^:.:. ^~!: !5? ^5.^: .:  .^BBP5YJYYJ?!^!?7!!!~.     
  //  ^?@^  .5?:JPG~  ~GPPPPPBP?:^YB!.^~?J  ^7J!:~::~~. 7?7~ :5P~ !P.:~.   .!:!B#PY5YYJ: : ?!^5?~:.    
  // ::G#:  5@Y~!^    JGGB#B#P~^JGP~ ~~75~ .~?7 ~^~!: .?J~^. ~YJ. .J.:~~  .::.^7YG55Y!^:~?J^ ^YP^      
  // : ~:   5#7~^.~777JPPPPPJ:~JGY~:^!!?? .!?57^~!~^^~7J~~: ^!7^ . ^7.~!^    .!~!J#7 .::!JB&Y?!^       
  //  ::.  :.   ^~5&5^7YP557::?#Y!:^!?~~!.~Y?J~!JPBBG577!~^^~!~::?!:?7:^^...^^~77!PG:  . .7GB!  ....   
  //  ^?~ .?:.^JJ !YJ75JPGG?^JB?^.^Y7!.~77J57^7J?7?P5GGPYJJJ?7~!7J55YJJ?7!7?YYPGGPP#5     ~GGB5!~~^^   
  // ^!?7!!P7~!#?  .?#Y^!?GBGGB^.^7J::^~!JPJ~~??!~:^^~!~^...:::^^~!~~:?BY?55P5PGB#BGB~   ^?!^~^~~7!^   
  // ^~JY?Y?:?PJ...?JB!..~??BBBY:~7~::^77YJ!~?J7::.::!7!!:::.......^::~JY..:::^!J##G#7!!^~!77!!7~...   
  // .??JJ5^?!..:~7?5JJ~~!YB@#G#? ~~!7^75~::!!!?7^::^~!~::..:::..:7Y?.^~5Y^::::^~J##GJPY?JJY5???7^.    
  //  .~JJ!?~ .~!~J?J5~^::~!77YPJ.7YPBGP5PP?^^^.::::::^^^::~~:::~Y?!^ .:^JJ~. .:^?!JPPYJYPYJYYJJ77~    
  //   .^!~~^^.~7?P5YJ7J!:...~7!~7PBBBBYJJ55YYJ!!^^::^~~~^~~^:::!~^~^~5#?7!!!^::^7?YYJYYJYPP7?77?7!:   
  //   !7^:^ .:^!JJ?7~.     .!:^?5B&@@#BY?7J5YJ?YJJ?Y55PPG5YPG?JBG#&B#&5!7JYJJY?PPPJJJ7J?JGG555Y!:^.   
  // :^~?Y?^~7J7!~!~~!!       :...:!YPB&#G5JJJ7?JYJY775PPGB##Y!P##&##&G!JJ5BPPPPPP5JJYGP?Y5YPPGB5^.    
  // .!???JJJ?JPP55?J5PY~^^~JJJ7~.. ..~77JPP557?YYYY .~J55GG?!7GBBB#&GY5PPPPPGGPP5Y5PGG#BB#GJJPGBY^    
  //  .^?J5Y5?GGJ!!J5GG##GPBBBPP55GJYJJ7JJ5G7!7???Y!    ~YYY???YY5PGBYY5YYJY?775PPBP5PPP?~7PP5GPPJ7.   
  // .!Y?~~7??!^^^!5#BBP?7?YJ7!!~~^^~Y##Y~^Y.^~!77?.   ^J77JJ?77JJYGYYP??????7!Y5G#GYYJJJ^::5YY?77~    
  // :Y   !!7.~!~^^5Y!!!7!~^^!7J??~^. :JY^:J!!!~.:^   ~7!~777?7^7?Y5JJJ7JYY55JY5J~:.  ^Y?7YY^??7~^.    
  // :P7. :Y: :..^^^^^:  ^?YPGGBBBBGB5!:~!~^!7JY:~.  7?!77!!!7?^7Y5Y7^JPPGJYY??~   ^7?57!^^~7~YYJ7~    
  // ~!P7~YGJ^   .:!PY75PBGP5P5YYY5PPB#5Y!^!!~^^?7^!!Y~!~!!7?YPY?!~~7?JJ5YY?JY^  .5J75P!!?JY?!?:^..    
  //  ^!!^:7JY:^7?GGYYP&BG#B~~!!!7JJ?JJ7^!??!^~J7^^?GJJJ?~!?Y7?!!JYGBP555~!!~!^~^J5~7JJ7~^  !!~  .     
  //  ~!^ .:777:Y#P5YY5PPGB5!~~~!!!!!~^!7!~~^^Y^   !#G5YP7!??5PG##GGYPB&#Y^:~!Y5555!7JJJ^ .^~!~!?J^    
  //      ^~~:. ^JJ?!^!YJ7?7?J5PP5PP?7!77!^  :#5GGYBGJ?~7??!7Y?!:..^^~!?J7?!^7#!7GY?.^YY7~^!Y5JJJ!~    
  //            ..   ~!:.~7?J7JJ?!?!~:::.     ~JBBB5..  ..               .~!!?5!~^.  :^!?!^!5?:        
  //                          ...               .::.                     ..:::             .           "
