function animate() {
    requestAnimationFrame(animate);
  
    // Update frequency data
    analyzer.getByteFrequencyData(frequencyData);
  
    // Loop through all the cubes in the scene
    scene.traverse((object) => {
      if (object.isMesh && object.geometry.type === 'BoxGeometry') {
        const distance = distanceToCamera(object);
        const frequencyBand = mapDistanceToFrequencyBand(
          distance,
          0, // Minimum distance (you can adjust this value)
          50, // Maximum distance (you can adjust this value)
          0, // Minimum frequency band
          frequencyData.length - 1 // Maximum frequency band
        );
  
        // Update cube color based on its associated frequency band
        const colorValue = frequencyData[frequencyBand] / 255;
        object.material.color.setRGB(colorValue, colorValue, colorValue);
      }
    });
  
    renderer.render(scene, camera);
  }
  
  

// Create an analyzer node
const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 1024; // You can change this value for a different frequency resolution
analyzer.connect(audioContext.destination);

// Get the frequency data array
const frequencyData = new Uint8Array(analyzer.frequencyBinCount);


<!-- SECTION: analyzeFrequencyAndHighlightCubes -->
async function updateColors() {
  analyser.getByteFrequencyData(dataArray);

  // Determine the average value of the high-frequency bands
  const highFreqStart = Math.floor(bufferLength * 0.7);
  const highFreqEnd = bufferLength;
  let highFreqSum = 0;
  
  for (let i = highFreqStart; i < highFreqEnd; i++) {
    highFreqSum += dataArray[i];
  }
  console.log("hf+" + highFreqSum);

  const highFreqAvg = highFreqSum / (highFreqEnd - highFreqStart);

  console.log("ha+" + highFreqAvg);

  // Define the colors based on the high-frequency bands
  const baseColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
  const newColors = baseColors.map((color) => {
    const hsl = new THREE.Color(color).getHSL({});
    const lightness = Math.min(1, hsl.l + ((highFreqSum / 255) ));
    highlightCube(highFreqSum+20, hsl);
    return new THREE.Color().setHSL(hsl.h, hsl.s, lightness).getStyle();
    // return new THREE.Color().setHSL(240, 240, 244).getStyle();

  });


  // beethovenText = "boo";
  // Update the ASCII art with the new colors
  const textCanvas = createTextCanvas(beethovenText, newColors);
  const texture = new THREE.CanvasTexture(textCanvas);
  console.log(beethovenCube);
  beethovenCube.material.map = texture;
  beethovenCube.material.needsUpdate = true;
}

function analyzeFrequencyAndHighlightCubes() {
  console.log("analyzeFrequencyAndHighlightCubes");

  // Create an array to store the frequency data
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  console.log(frequencyData);

  // Get the frequency data from the analyser
  analyser.getByteFrequencyData(frequencyData);

  // Process the frequency data and highlight the cubes
  for (let i = 0; i < frequencyData.length; i++) {
    // Normalize the frequency value (0 to 1)
    const normalizedFrequency = frequencyData[i] / 256;
    console.log("nf" + normalizedFrequency);
    // Determine the index of the cube to highlight based on the normalized frequency
    const cubeIndex = Math.floor(normalizedFrequency * (5*5*5));
    // Highlight the cube with the index cubeIndex
    highlightCube(cubeIndex, frequencyData[i]);
  }

  // Call this function again using requestAnimationFrame
  requestAnimationFrame(analyzeFrequencyAndHighlightCubes);
}


// changeTextCubeColor(beethovenCube, 'red');
//       // player = new Tone.Player("snd/beethoven_op131_allegro_001.mp3").toDestination();
//       // const audioSource = audioContext.createMediaElementSource(audioElement);
//       // analyser = audioContext.createAnalyser();
//       // analyser.fftSize = 256;
//       // audioSource.connect(analyser);
//       // audioSource.connect(audioContext.destination);
//       // audioElement.play();
//     console.log("beethoven");
//     const audioContext = new AudioContext();
//     const audioElement = new Audio('snd/beethoven_symphony_n7.mp3');
//     const audioSource = audioContext.createMediaElementSource(audioElement);
//     analyser = audioContext.createAnalyser();
//     analyser.fftSize = 256;
//     audioSource.connect(analyser);
//     audioSource.connect(audioContext.destination);
//     audioElement.play();

//     bufferLength = analyser.frequencyBinCount;
//     dataArray = new Uint8Array(bufferLength);



            // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // const audioElement = new Audio('beethoven_op131_allegro_001.mp3');
            // const sourceNode = audioContext.createMediaElementSource(audioElement);
            // analyser = audioContext.createAnalyser();
            // sourceNode.connect(analyser);
            // analyser.fftSize = 256; // Set the FFT size (power of 2, default is 2048)
            // sourceNode.connect(audioContext.destination);


            // audioElement.play();
            // analyzeFrequencyAndHighlightCubes();
