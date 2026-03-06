export function initHeader() {
  const currentPath = window.location.pathname;
  
  // Select BOTH desktop and mobile links
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  const openMenuBtn = document.querySelector('#open-menu');
  const closeMenuBtn = document.querySelector('#close-menu');
  const mobileMenu = document.querySelector('#mobile-menu');

  // --- 1. Toggle Logic ---
  const toggleMenu = () => {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  openMenuBtn?.addEventListener('click', toggleMenu);
  closeMenuBtn?.addEventListener('click', toggleMenu);

  // --- 2. Resize Guard ---
  // If the user makes the screen big, force the menu to close
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu?.classList.contains('is-open')) {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // --- 3. Active Link Logic ---
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');

    // Normalize paths for comparison
    const isFavorites = currentPath.includes('favorites.html') && href.includes('favorites.html');
    const isHome = (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/')) 
                   && href.includes('index.html');

    if (isFavorites || isHome) {
      link.classList.add('active');
    }
  });
}