// Optional Skyline enhancements. Native scrolling and disclosures remain the baseline.
(() => {
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = document.querySelector('[data-photo-track]');
  if (track && track.children.length > 1) {
    const slides = [...track.children];
    const counter = document.querySelector('[data-photo-count]');
    const index = () => slides.reduce((closest, slide, i) => Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[closest].offsetLeft - track.scrollLeft) ? i : closest, 0);
    const go = dir => {
      const next = slides[Math.max(0, Math.min(slides.length - 1, index() + dir))];
      track.scrollTo({left: next.offsetLeft, behavior: reduceMotion() ? 'auto' : 'smooth'});
    };
    let frame;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (counter) counter.textContent = String(index() + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      });
    }, {passive: true});
    track.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      go(event.key === 'ArrowRight' ? 1 : -1);
    });
    const controls = document.createElement('div');
    controls.className = 'sk-gallery-nav';
    for (const [dir, text] of [[-1, 'Previous photo'], [1, 'Next photo']]) {
      const button = document.createElement('button');
      button.className = 'sk-square'; button.type = 'button'; button.setAttribute('aria-label', text);
      button.innerHTML = '<svg class="sk-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="' + (dir < 0 ? 'M20 12H4m7-7-7 7 7 7' : 'M4 12h16m-7-7 7 7-7 7') + '"/></svg>';
      button.addEventListener('click', () => go(dir));
      controls.append(button);
    }
    track.parentElement.append(controls);
  }

  const menu = document.querySelector('[data-menu]');
  const sheet = document.querySelector('[data-filter-sheet]');
  const close = details => {
    if (!details?.open) return;
    details.open = false;
    details.querySelector('summary').focus({preventScroll: true});
  };
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    close(menu); close(sheet);
    if (location.hash === '#photos') {
      location.hash = 'gallery';
      document.querySelector('a[href="#photos"]')?.focus({preventScroll: true});
    }
  });
  document.addEventListener('click', event => {
    if (menu?.open && !menu.contains(event.target)) close(menu);
    if (event.target === sheet) close(sheet);
  });
  document.querySelector('[data-apply-filters]')?.addEventListener('click', () => close(sheet));

  // Shared properties.js owns filtering. Populate its fields before firing change.
  const form = document.querySelector('[data-property-filters]');
  if (form) {
    const params = new URLSearchParams(location.search);
    for (const [name, param] of [['query', 'q'], ['purpose', 'purpose'], ['type', 'type']]) {
      const field = form.elements.namedItem(name), value = params.get(param);
      if (field && value !== null) field.value = value;
    }
    form.dispatchEvent(new Event('change', {bubbles: true}));
  }
})();
