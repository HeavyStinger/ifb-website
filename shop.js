const filters = document.querySelectorAll('input[name="category"]');
const heading = document.querySelector('.shop h1');

// The filter itself is CSS only. This script opens the page on the category in
// the link (shop.html?category=rings) and keeps the heading, tab title and address in step.
function showCategory(radio) {
	const label = radio.labels[0].querySelector('.browse__label').textContent;
	heading.textContent = label;
	document.title = `${label} | IFB`;
}

const requested = new URLSearchParams(location.search).get('category');
const initial = [...filters].find((radio) => radio.value === requested);
if (initial) {
	initial.checked = true;
	showCategory(initial);
}

filters.forEach((radio) => {
	radio.addEventListener('change', () => {
		showCategory(radio);
		const url = radio.value === 'all' ? location.pathname : `?category=${radio.value}`;
		history.replaceState(null, '', url);
	});
});
