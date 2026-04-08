const backToTop = document.getElementById('back-to-top');
const characterImage = document.querySelector('.character');
const nextImageButton = document.getElementById('next-image-btn');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
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
  const gallerySources =
    characterImage.dataset.gallery
      ?.split(',')
      .map((source) => source.trim())
      .filter(Boolean) || [];

  const availableImages = [];
  let currentImageIndex = 0;
  let touchStartX = null;

  const updateImage = (direction) => {
    if (availableImages.length <= 1) return;
    currentImageIndex =
      (currentImageIndex + direction + availableImages.length) % availableImages.length;
    characterImage.src = availableImages[currentImageIndex];
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
    sources.forEach((source) => source && availableImages.push(source));
    if (availableImages.length === 0) return;

    const initialIndex = availableImages.findIndex((source) => characterImage.src.endsWith(source));
    if (initialIndex >= 0) currentImageIndex = initialIndex;

    if (nextImageButton) {
      nextImageButton.addEventListener('click', () => updateImage(1));
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
        if (touchStartX !== null && touchEndX !== undefined) {
          const deltaX = touchEndX - touchStartX;
          if (Math.abs(deltaX) >= 40) {
            updateImage(deltaX < 0 ? 1 : -1);
          }
        }
        touchStartX = null;
      },
      { passive: true }
    );
  });
}
