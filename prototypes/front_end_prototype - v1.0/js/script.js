$(document).on('scroll', function (e) {

     var alpha = ($(document).scrollTop() / 550) + 0.6;

     $('.navbar-default').css('background-color', 'rgba(0, 151, 255,' + alpha + ')');
});