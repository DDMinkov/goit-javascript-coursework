export function initHeader() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');

    const href = link.getAttribute('href');
    
    if (currentPath.includes('favorites.html') && href.includes('favorites.html')) {
      link.classList.add('active');
    } else if ((currentPath === '/' || currentPath.includes('index.html')) && href.includes('index.html')) {
      link.classList.add('active');
    }
  });
}