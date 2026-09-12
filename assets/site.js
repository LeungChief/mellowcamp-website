/* Progressive enhancement: core navigation, product links and FAQs work without JS. */
'use strict';
const menuGroups = [...document.querySelectorAll('.nav-group, .mobile-menu')];
menuGroups.forEach(group => group.addEventListener('toggle', () => {
  if (group.open) menuGroups.forEach(other => { if (other !== group) other.open = false; });
}));
document.addEventListener('click', event => {
  menuGroups.forEach(group => { if (!group.contains(event.target)) group.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') menuGroups.forEach(group => {
    if (group.open) { group.open = false; group.querySelector('summary').focus(); }
  });
});
document.querySelectorAll('.mobile-panel a').forEach(a => a.addEventListener('click', () => {
  a.closest('details').open = false;
}));

const filters = document.querySelector('[data-filters]');
if (filters) {
  filters.hidden = false;
  const cards = [...document.querySelectorAll('[data-product-type]')];
  const count = document.querySelector('[data-filter-count]');
  const buttons = [...filters.querySelectorAll('button')];
  function filter(type) {
    if (!buttons.some(b => b.dataset.filter === type)) type = 'all';
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === type)));
    cards.forEach(card => { card.hidden = type !== 'all' && card.dataset.productType !== type; });
    count.textContent = `${cards.filter(c => !c.hidden).length} ${count.dataset.label}`;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    filter(button.dataset.filter);
  }));
  filter(new URLSearchParams(location.search).get('type') || 'all');
}

const mainImage = document.querySelector('[data-main-image]');
if (mainImage) {
  document.querySelectorAll('[data-gallery-thumb]').forEach(thumb => {
    thumb.addEventListener('click', event => {
      event.preventDefault();
      mainImage.src = thumb.href;
      mainImage.alt = thumb.querySelector('img').alt;
      mainImage.closest('a').href = thumb.href;
      document.querySelectorAll('[data-gallery-thumb]').forEach(t => t.removeAttribute('aria-current'));
      thumb.setAttribute('aria-current', 'true');
    });
  });
}
const imageDialog = document.querySelector('[data-image-dialog]');
if (imageDialog && typeof imageDialog.showModal === 'function') {
  document.querySelectorAll('[data-zoom]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const img = imageDialog.querySelector('img');
    img.src = link.href;
    img.alt = link.querySelector('img').alt;
    imageDialog.querySelector('.dialog-caption').textContent = img.alt;
    imageDialog.showModal();
  }));
  imageDialog.querySelector('button').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', event => {
    const box = imageDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) imageDialog.close();
  });
}
const copyButton = document.querySelector('[data-copy-email]');
if (copyButton && navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('[data-copy-status]');
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
      status.textContent = copyButton.dataset.success;
    } catch {
      status.textContent = copyButton.dataset.failure;
    }
  });
}
