// Haven progressive enhancement. The site works without this file.
(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  // Photo tracks: keep dots/counter in sync, add arrow buttons for mouse users.
  for (const track of $$('[data-track]')) {
    const slides = [...track.children];
    if (slides.length < 2) continue;
    const media = track.parentElement;
    const dots = media.querySelectorAll('.hv-dots span'), counter = media.querySelector('[data-counter]');
    const index = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    const go = n => track.scrollTo({left: Math.max(0, Math.min(slides.length - 1, n)) * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    let frame = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = index();
        dots.forEach((d, k) => d.classList.toggle('on', k === i));
        if (counter) counter.textContent = (i + 1) + ' / ' + slides.length;
      });
    }, {passive: true});
    if (matchMedia('(hover: hover)').matches) {
      for (const [dir, label] of [[-1, 'Previous photo'], [1, 'Next photo']]) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'hv-round hv-card-nav ' + (dir < 0 ? 'prev' : 'next'); b.setAttribute('aria-label', label);
        b.innerHTML = '<svg class="i sm" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (dir < 0 ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6') + '"/></svg>';
        b.addEventListener('click', e => {e.preventDefault(); e.stopPropagation(); go(index() + dir);});
        media.append(b);
      }
    }
    track.addEventListener('keydown', e => {if (e.key === 'ArrowRight') go(index() + 1); else if (e.key === 'ArrowLeft') go(index() - 1);});
  }
  // Share: native share sheet, else copy the link.
  for (const btn of $$('[data-share]')) {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url || location.href, title = btn.dataset.title || document.title;
      try {
        if (navigator.share) await navigator.share({title, url});
        else {await navigator.clipboard.writeText(url); btn.setAttribute('aria-label', 'Link copied'); setTimeout(() => btn.setAttribute('aria-label', 'Share'), 2000);}
      } catch {}
    });
  }
  // Filter sheet: close on submit/close/Escape and keep focus sensible.
  const sheet = document.querySelector('[data-filter-sheet]');
  if (sheet) {
    const close = () => {if (sheet.open) {sheet.open = false; sheet.querySelector('summary').focus();}};
    $$('[data-close-filters]', sheet).forEach(b => b.addEventListener('click', () => setTimeout(close)));
    document.addEventListener('keydown', e => {if (e.key === 'Escape') close();});
    sheet.addEventListener('click', e => {if (e.target === sheet) close();});
    sheet.addEventListener('toggle', () => {document.documentElement.style.overflow = sheet.open && innerWidth < 600 ? 'hidden' : ''; if (sheet.open) sheet.querySelector('select,input')?.focus({preventScroll: true});});
  }
  // Apply ?q=&purpose=&type= from the homepage search and type chips.
  const form = document.querySelector('[data-property-filters]');
  if (form) {
    const params = new URLSearchParams(location.search);
    const set = (name, value) => {
      const field = form.elements[name]; if (!field || !value) return;
      if (field instanceof RadioNodeList) {for (const r of field) r.checked = r.value === value;} else field.value = value;
    };
    set('query', params.get('q')); set('purpose', params.get('purpose')); set('type', params.get('type'));
    if ([...params.keys()].length) addEventListener('load', () => form.dispatchEvent(new Event('change')));
  }
})();
