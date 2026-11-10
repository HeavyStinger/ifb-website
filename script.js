const menuToggle = document.querySelector('.nav__toggle');
const heroVideo = document.querySelector('.hero__video');
const categories = document.querySelector('.categories');
const track = categories.querySelector('.categories__track');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion) heroVideo.pause();

function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', open);
}

menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});
matchMedia('(min-width: 900px)').addEventListener('change', () => setMenuOpen(false));

// The carousel loops: the cards are cloned before and after so the strip can
// wrap around, and the view is kept inside the middle set.
const cards = [...track.children];
const cloneCards = () => cards.map((card) => {
  const clone = card.cloneNode(true);
  clone.inert = true;
  return clone;
});
track.prepend(...cloneCards());
track.append(...cloneCards());

const cardStep = () =>
  cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
const jumpTo = (left) => track.scrollTo({ left, behavior: 'instant' });
const scrollByCards = (count) =>
  track.scrollBy({ left: cardStep() * count, behavior: reducedMotion ? 'instant' : 'smooth' });

// Fires on load and whenever the track's width changes: start on the first real card
new ResizeObserver(() => jumpTo(cardStep() * cards.length)).observe(track);

track.addEventListener('scrollend', () => {
  const setWidth = cardStep() * cards.length;
  if (track.scrollLeft >= setWidth * 2 - 2) jumpTo(track.scrollLeft - setWidth);
  else if (track.scrollLeft < setWidth - 2) jumpTo(track.scrollLeft + setWidth);
});

let autoplay;
const stopAutoplay = () => clearInterval(autoplay);
const startAutoplay = () => {
  stopAutoplay();
  if (!reducedMotion) autoplay = setInterval(() => scrollByCards(1), 3500);
};

categories.addEventListener('pointerenter', stopAutoplay);
categories.addEventListener('pointerleave', startAutoplay);
categories.addEventListener('focusin', stopAutoplay);
categories.addEventListener('focusout', startAutoplay);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoplay();
  else startAutoplay();
});

categories.querySelectorAll('.carousel-btn').forEach((button) => {
  button.addEventListener('click', () => scrollByCards(Number(button.dataset.step)));
});

startAutoplay();
