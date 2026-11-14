const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.nav__toggle');

// Pages without a full-screen hero mark the header data-solid so it stays white from the top
const alwaysSolid = siteHeader.hasAttribute('data-solid');
const updateHeader = () => siteHeader.classList.toggle('is-scrolled', alwaysSolid || scrollY > 0);
addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

function setMenuOpen(open) {
	menuToggle.setAttribute('aria-expanded', open);
}

menuToggle.addEventListener('click', () => {
	setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') setMenuOpen(false);
});
matchMedia('(min-width: 1280px)').addEventListener('change', () => setMenuOpen(false));

// Photos are a skeleton until they load. Load events do not bubble, so listen on the way down.
document.addEventListener('load', (event) => {
	if (event.target instanceof HTMLImageElement) event.target.classList.add('is-loaded');
}, true);
document.querySelectorAll('img').forEach((image) => {
	if (image.complete) image.classList.add('is-loaded');
});
