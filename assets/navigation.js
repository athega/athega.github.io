const menu = document.querySelector('.mobile-menu');

if (menu) {
  const toggle = menu.querySelector('summary');

  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      toggle.focus();
      event.preventDefault();
    }
  });

  document.addEventListener('focusin', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });

  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });

  // Don't restore an old open menu when returning from the desktop layout.
  matchMedia('(min-width: 981px)').addEventListener('change', event => {
    if (event.matches) menu.open = false;
  });
}
