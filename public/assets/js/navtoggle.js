const hambugerMenu = document.getElementById('hambuger-menu');

hambugerMenu.addEventListener('click', toggleNav);

function toggleNav() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('show-menu');

  if (menu.classList.contains('show-menu')) {
    gsap.to(menu, {
      duration: .6,
      top: '0px'
    })
  } else {
    gsap.to(menu, {
      duration: .6,
      top: '-300px'
    })
  }
}