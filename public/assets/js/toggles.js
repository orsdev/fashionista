const hambugerMenu = document.getElementById('hambuger-menu');
const categories = document.getElementById('categories');
const auth = document.getElementById('auth');

hambugerMenu.addEventListener('click', toggleNav);
categories.addEventListener('click', categoriesDropdown);
auth.addEventListener('click', authDropdown);


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

function categoriesDropdown(e) {
  const elem = document.querySelector('.categories-dropdown');
  elem.classList.toggle('show-dropdown');
  gsap.from('.show-dropdown', {
    duration: .2,
    height: 0
  });
}

function authDropdown(e) {
  const elem = document.querySelector('.auth-dropdown');
  elem.classList.toggle('show-dropdown');
  gsap.from('.show-dropdown', {
    duration: .2,
    height: 0
  });
}