var AboutScript = (function (){


    handlePageAccordingScreenResolution = function(){

        var resolution = $(window).width();

        if(resolution < 1170 )
            setPageAsLowResolution(resolution);
        else
            setPageAsHighResolution();
    };

    setPageAsLowResolution = function(resolution){
        $(".imgwrap").find('img').width('270');
        $(".imgwrap").addClass("small");
        $(".img-overlay").addClass("small");

        $('#developers').find('h1').css({ 'font-size': 30 });
        $('#developers').removeClass('col-xs-3').addClass('col-xs-2');


        if (resolution >= 1024){
            $('.images-row > div').first().css({ 'margin-left' : 37 });
            $('.names-row > div').first().css({ 'padding-left' : 10 });
        }
        else {
            $('.images-row > div').first().css({ 'margin-left' : 20 });
            $('.names-row > div').first().css({ 'padding-left' : 20 });
        }

        $('.names-row').find('#hammer').removeClass('col-xs-3').addClass('col-xs-2')
                                       .css({ 'padding-left' : 40 });
    };

    setPageAsHighResolution = function(){
        $(".imgwrap").find('img').width('400');
        $(".imgwrap").removeClass("small");
        $(".img-overlay").removeClass("small");

        $('#developers').find('h1').css({ 'font-size': 40 });
        $('#developers').addClass('col-xs-3').removeClass('col-xs-2');


        $('.names-row > div').first().css({ 'padding-left' : 0 });


        $('.images-row > div').first().css({ 'margin-left' : 0 });
        $('.names-row > div').first().css({ 'padding-left' : 0 });


        $('.names-row').find('#hammer').addClass('col-xs-3').removeClass('col-xs-2')
            .css({ 'padding-left' : 15 });
    };

    init = function (){
        $('.navbar-default').css('background-color', 'rgba(0, 30, 79, 0.7)');
        $("#logo").attr('onclick', '$("html,body").animate({scrollTop:0}, "slow");');

        handlePageAccordingScreenResolution();

        $(window).resize(function(){
            handlePageAccordingScreenResolution();
        });
    };


    //Public Methods
    return {
        init: init,
    };

})();

$(document).ready(function(){
    AboutScript.init();
});
 