var TweetsModalControl = (function () {

    openWebSocket = function () {
        var socket = io.connect('http://localhost:3000');
        socket.on('data', function (data) {
            getTweet(data);
            getLocationByAddress(data.location);
        });
    };

    getTweet = function (tweet) {

        twttr.ready(function (twttr) {

            $("#tabs li a").each(function () {
                if (tweet.keyword == $(this).text()) {
                    var href = $(this).attr('href');
                    var container = $(href).find("#right-container")[0];
                    $(container).find("#rightNoRegisterMsg").hide();
                    twttr.widgets.createTweet(
                        tweet.tweet_id,
                        container
                    );
                }
            });
        });
    };

    getActiveTab = function(){
        var activeLi = $("ul#tabs li.active")[0];
        var activeTab = $(activeLi).find("a").attr('href');
        var activeRowTab = $(activeTab).find(".row");

        return activeRowTab;
    };

    getInitialDate = function(){
        var activeRowTab = getActiveTab();
        var initialDate = $(activeRowTab).find("#initialDate")[0];
        return initialDate;
    };

    getFinalDate = function(){
        var activeRowTab = getActiveTab();
        var finalDate = $(activeRowTab).find("#finalDate")[0];
        return finalDate;
    };

    getFirstDate = function(){
        var initialDate = getInitialDate();
        var firstDate = $(initialDate).find("#firstDate")[0];
        return firstDate;
    };

    getSecondDate = function(){
        var finalDate = getFinalDate();
        var secondDate = $(finalDate).find("#secondDate")[0];
        return secondDate;
    };

    validateDatepickers = function(){

        var initialDate = getInitialDate();
        var finalDate = getFinalDate();
        var firstDate = getFirstDate();
        var secondDate = getSecondDate();

        if(firstDate.value == '' || secondDate.value == '') {

            if(firstDate.value == '')
                addAndRemoveErrorClassInDatepickers(initialDate, firstDate);

            if(secondDate.value == '')
                addAndRemoveErrorClassInDatepickers(finalDate, secondDate);

            toastr.error('Por favor, informe a data inicial e final para a busca!');
        }else{
            if (!verifyIfSecondDateIsLess(firstDate, secondDate)){ getTweetsByFilter($(firstDate).datepicker("getDate"),
                                                                                     $(secondDate).datepicker("getDate")); }
            else {
                addAndRemoveErrorClassInDatepickers(finalDate, secondDate);
                toastr.error('A data final não pode ser menor que a data inicial!');
            }
        }
    };

    addAndRemoveErrorClassInDatepickers = function (div, field) {
        $(div).addClass('has-error');
        $(field).focus(function() { $(div).removeClass('has-error'); });
    };

    verifyIfSecondDateIsLess = function(firstDate, secondDate){

        if($(firstDate).datepicker("getDate") > $(secondDate).datepicker("getDate"))
            return true;
        return false;
    };

    getTweetsByFilter = function (firstDate, secondDate) {

        var currentPoliticTab = $("ul#tabs li.active").text();

        secondDate.setHours(23, 59, 59);

        var data = {
            politic: currentPoliticTab,
            initialDate: firstDate,
            finalDate: secondDate
        };

        $.ajax({
            url: "/getCommentsByDate",
            data: data,
            type: "POST",
            success: function (result) { handleFindTweets(result) },
            error: function (result) { toastr.warning(result.responseText); }
        });
    };

    handleFindTweets = function(tweets){

        var activeLi = $("ul#tabs li.active")[0];
        var activeTab = $(activeLi).find("a").attr('href');
        var filterContainer = $(activeTab).find("#left-container")[0];
        $(filterContainer).find("#leftNoRegisterMsg").hide();

        tweets = JSON.parse(tweets);

        $.each(tweets, function(index, value){
            twttr.widgets.createTweet(
                value,
                filterContainer
            );
        });
    };

    cleanDateFields = function () {

        var initialDate = getInitialDate();
        var finalDate = getFinalDate();
        var firstDate = getFirstDate();
        var secondDate = getSecondDate();

        $(firstDate).val('');
        $(secondDate).val('');
        $(initialDate).removeClass('has-error');
        $(finalDate).removeClass('has-error');
    };

    init = function () {
        openWebSocket();
    };

//Public Methods
    return {
        init: init,
    };

})();

$(document).ready(function () {
    TweetsModalControl.init();
});
