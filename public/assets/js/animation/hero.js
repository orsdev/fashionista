
window.onload = () => {
  document.body.style.overflowY = "auto";

  setTimeout(function () {
    gsap.timeline()
      .add(heroAnimation())
  }, 100);
};

function heroAnimation() {
  const tl = gsap.timeline();

  tl.from('.discount', {
    duration: .8,
    xPercent: -100
  });

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