const facts = [
  'Katachi is tuned for a soft and expressive Japanese vocal style.',
  'He is a great match for lo-fi, ballads, and atmospheric songs.',
  'Favorite vibe: rainy nights with synth pads and warm chords.',
  'Katachi Onsha was designed as a free UTAU voicebank project.',
  'His profile style combines calm energy with emotional depth.'
];

const factButton = document.getElementById('fact-btn');
const factOutput = document.getElementById('fact-output');
const moodButtons = document.querySelectorAll('.chip');
const backToTop = document.getElementById('back-to-top');

if (factButton && factOutput) {
  factButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    factOutput.textContent = facts[randomIndex];
  });
}

moodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedMood = button.dataset.mood || 'default';
    document.body.setAttribute('data-mood', selectedMood);

    moodButtons.forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
  });
});

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
