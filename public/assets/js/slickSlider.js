$(window).on('load', function () {
  $('.slick').slick({
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    variableWidth: true
  });
})