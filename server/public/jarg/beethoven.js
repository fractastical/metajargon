async function playBeethoven() {
    const response = await fetch('/snd/');
    const text = await response.text();
    const files = text.match(/href="[^"]+"/g).map(href => href.slice(6, -1));
    const beethovenFiles = files.filter(file => file.toLowerCase().includes('beethoven'));
  
    for (const file of beethovenFiles) {
      const audio = new Audio(`/snd/${file}`);
      audio.addEventListener('canplaythrough', () => audio.play());
    }
  }
  