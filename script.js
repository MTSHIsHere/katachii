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
const characterImage = document.querySelector('.character');
const nextImageButton = document.getElementById('next-image-btn');

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

if (characterImage) {
  const fallbackImages = ['character.png', 'character2.png', 'character3.png'];
  const gallerySources =
    characterImage.dataset.gallery
      ?.split(',')
      .map((source) => source.trim())
      .filter(Boolean) || fallbackImages;

  const availableImages = [];
  let currentImageIndex = 0;
  let touchStartX = null;
  const swipeThreshold = 40;

  const updateImage = (direction) => {
    if (availableImages.length <= 1) {
      return;
    }

    currentImageIndex =
      (currentImageIndex + direction + availableImages.length) % availableImages.length;
    characterImage.src = availableImages[currentImageIndex];
  };

  const registerSwipe = (touchEndX) => {
    if (touchStartX === null) {
      return;
    }

    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) < swipeThreshold) {
      return;
    }

    if (deltaX < 0) {
      updateImage(1);
    } else {
      updateImage(-1);
    }
  };

  Promise.all(
    gallerySources.map(
      (source) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(source);
          img.onerror = () => resolve(null);
          img.src = source;
        })
    )
  ).then((sources) => {
    sources.forEach((source) => {
      if (source) {
        availableImages.push(source);
      }
    });

    if (availableImages.length === 0) {
      return;
    }

    const initialIndex = availableImages.findIndex((source) =>
      characterImage.src.endsWith(source)
    );
    if (initialIndex >= 0) {
      currentImageIndex = initialIndex;
    } else {
      characterImage.src = availableImages[0];
    }

    characterImage.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.touches[0]?.clientX ?? null;
      },
      { passive: true }
    );

    characterImage.addEventListener(
      'touchend',
      (event) => {
        const touchEndX = event.changedTouches[0]?.clientX;
        if (touchEndX !== undefined) {
          registerSwipe(touchEndX);
        }
        touchStartX = null;
      },
      { passive: true }
    );
  });
}

if (characterImage && nextImageButton) {
  const fallbackImages = ['character.png', 'icon.png'];
  const availableImages =
    characterImage.dataset.gallery
      ?.split(',')
      .map((source) => source.trim())
      .filter(Boolean) || fallbackImages;

  let currentImageIndex = 0;

  const showNextImage = () => {
    if (availableImages.length <= 1) {
      return;
    }

    currentImageIndex = (currentImageIndex + 1) % availableImages.length;
    characterImage.src = availableImages[currentImageIndex];
  };

  const initialIndex = availableImages.findIndex((source) => characterImage.src.endsWith(source));
  if (initialIndex >= 0) {
    currentImageIndex = initialIndex;
  }

  nextImageButton.addEventListener('click', showNextImage);
}
