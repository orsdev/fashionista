
window.onload = () => {
  setTimeout(function () {
    gsap.timeline()
      .add(loaderAnimation())
      .add(removeLoader())
      .add(heroAnimation())
  }, 3000);
};

function loaderAnimation() {
  const tl = gsap.timeline();

  tl.to('.left', {
    duration: 1,
    xPercent: -100
  });

  tl.to('.right', {
    duration: 1,
    xPercent: 100
  }, .5);

  tl.to('.left-right', {
    duration: 1,
    xPercent: -100
  }, .6);

  tl.to('.right-left', {
    duration: 1,
    xPercent: 100
  }, .3);

  return tl;
};

function removeLoader() {
  const tl = gsap.timeline();

  tl.to('.loader', {
    duration: 1,
    yPercent: -100
  }, .1);

  tl.to('body', {
    overflowY: 'auto'
  });

  return tl;
};

function heroAnimation() {
  const tl = gsap.timeline();

  tl.from('.main-header', {
    duration: .8,
    opacity: 0,
    scale: 10,
    ease: Linear.easeInOut
  }, .2);

  tl.to('.main-header', {
    duration: .8,
    color: "hsl(16,100,50)",
    ease: Linear.easeInOut
  }, .2);

  tl.from('.sub-header', {
    duration: .8,
    opacity: 0,
    scale: .5,
    ease: 'back'
  }, .1);

  tl.from('.social a', {
    duration: .7,
    opacity: 0,
    height: 0,
    stagger: .2
  }, .4);

  return tl;
};