var TweetsModalControl = (function () {

    var chart;
    var politicsMentionCountObject = {
        data: []
    };

    openWebSocket = function () {
        var socket = io.connect('http://localhost:3000');
        socket.on('data', function (data) {
            getTweet(data);
            getLocationByAddress(data.location, data.keyword);
            updatePoliticsCounter(data.keyword);
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

    getActiveTab = function () {
        var activeLi = $("ul#tabs li.active")[0];
        var activeTab = $(activeLi).find("a").attr('href');
        var activeRowTab = $(activeTab).find(".row");

        return activeRowTab;
    };

    getInitialDate = function () {
        var activeRowTab = getActiveTab();
        var initialDate = $(activeRowTab).find("#initialDate")[0];
        return initialDate;
    };

    getFinalDate = function () {
        var activeRowTab = getActiveTab();
        var finalDate = $(activeRowTab).find("#finalDate")[0];
        return finalDate;
    };

    getFirstDate = function () {
        var initialDate = getInitialDate();
        var firstDate = $(initialDate).find("#firstDate")[0];
        return firstDate;
    };

    getSecondDate = function () {
        var finalDate = getFinalDate();
        var secondDate = $(finalDate).find("#secondDate")[0];
        return secondDate;
    };

    getFilterContainer = function () {
        var activeLi = $("ul#tabs li.active")[0];
        var activeTab = $(activeLi).find("a").attr('href');
        var filterContainer = $(activeTab).find("#left-container")[0];
        return filterContainer;
    };

    validateDatepickers = function (action) {

        var initialDate = getInitialDate();
        var finalDate = getFinalDate();
        var firstDate = getFirstDate();
        var secondDate = getSecondDate();

        if (firstDate.value == '' || secondDate.value == '') {

            if (firstDate.value == '')
                addAndRemoveErrorClassInDatepickers(initialDate, firstDate);

            if (secondDate.value == '')
                addAndRemoveErrorClassInDatepickers(finalDate, secondDate);

            toastr.error('Por favor, informe a data inicial e final para a busca!');
        } else {
            if (!verifyIfSecondDateIsLess(firstDate, secondDate)) {
                getTweetsByFilter($(firstDate).datepicker("getDate"),
                    $(secondDate).datepicker("getDate"), action);
            }
            else {
                addAndRemoveErrorClassInDatepickers(finalDate, secondDate);
                toastr.error('A data final não pode ser menor que a data inicial!');
            }
        }
    };

    addAndRemoveErrorClassInDatepickers = function (div, field) {
        $(div).addClass('has-error');
        $(field).focus(function () {
            $(div).removeClass('has-error');
        });
    };

    verifyIfSecondDateIsLess = function (firstDate, secondDate) {
        return ($(firstDate).datepicker("getDate") > $(secondDate).datepicker("getDate")) ? true : false;
    };

    getTweetsByFilter = function (firstDate, secondDate, action) {
        bootwait.show();

        var filterContainer = getFilterContainer();
        $(filterContainer).find(".showMoreBtn").hide();

        var currentPoliticTab = $("ul#tabs li.active").text();

        secondDate.setHours(23, 59, 59);

        var data = {
            politic: currentPoliticTab,
            initialDate: firstDate,
            finalDate: secondDate,
            action: action
        };

        $.ajax({
            url: "/getCommentsByDate",
            data: data,
            type: "POST",
            success: function (result) {
                checkAndDisableDatepickersAfterSuccess(action);
                handleFindTweets(result);
            },
            error: function (result) {
                bootwait.hide();
                toastr.warning(result.responseText);
            }
        });
    };

    checkAndDisableDatepickersAfterSuccess = function (action) {
        if (action == 'filter') {
            var firstDate = getFirstDate();
            var secondDate = getSecondDate();

            var activeLi = $("ul#tabs li.active")[0];
            var activeTab = $(activeLi).find("a").attr('href');

            $(activeTab).find('#filterBtn').attr('disabled', 'disabled');
            $(firstDate).attr('disabled', 'disabled');
            $(secondDate).attr('disabled', 'disabled');
        }
    };

    handleFindTweets = function (tweets) {

        var filterContainer = getFilterContainer();
        var tweetsDiv = $(filterContainer).find("#tweetsDiv")[0];

        $(filterContainer).find("#leftNoRegisterMsg").hide();

        tweets = JSON.parse(tweets);

        tweets.forEach(function (tweet) {
            twttr.widgets.createTweet(
                tweet,
                tweetsDiv
            ).then(function (el) {
                    setTimeout(function () {
                        $(filterContainer).find(".showMoreBtn").css({display: 'block'});
                        bootwait.hide();
                    }, 5000);
                });
        });
    };

    cleanAll = function () {

        var initialDate = getInitialDate();
        var finalDate = getFinalDate();
        var firstDate = getFirstDate();
        var secondDate = getSecondDate();
        var filterContainer = getFilterContainer();

        var activeLi = $("ul#tabs li.active")[0];
        var activeTab = $(activeLi).find("a").attr('href');

        $(firstDate).val('');
        $(secondDate).val('');
        $(initialDate).removeClass('has-error');
        $(finalDate).removeClass('has-error');
        $(filterContainer).find('#tweetsDiv').empty();
        $(filterContainer).find(".showMoreBtn").hide();
        $(filterContainer).find("#leftNoRegisterMsg").show();
        $(activeTab).find('#filterBtn').attr('disabled', false);
        $(firstDate).attr('disabled', false);
        $(secondDate).attr('disabled', false);
    };

    setChartConfigurations = function () {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'politicChart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Porcentagem de menções no Twitter  ' + getDate()
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: "% Menções",
                colorByPoint: true,
            }]
        });
    };

    getDate = function () {

        var date = new Date();
        var day = date.getDate();

        if (day.toString().length == 1)
            day = "0" + day;

        var month = date.getMonth() + 1;

        if (month.toString().length == 1)
            month = "0" + month;

        var year = date.getFullYear();

        return day + "/" + month + "/" + year
    };

    getPoliticsMentionCountObject = function(callback){
        callback(politicsMentionCountObject.data);
    };

    updatePoliticsCounter = function (politic) {
        if (politicsMentionCountObject.data.length > 0) {
            if (checkIfPoliticExistsInObject(politicsMentionCountObject.data, politic)) {
                $(politicsMentionCountObject.data).each(function () {
                    if (this.name == politic) {
                        this.y = this.y + 1;
                        console.info(this.y);
                    }
                });
            } else {
                politicsMentionCountObject.data.push({name: politic, y: 1});
            }
        } else {
            politicsMentionCountObject.data.push({name: politic, y: 1});
        }
    };

    checkIfPoliticExistsInObject = function (politicsObject, politic) {
        for (var i = 0; i < politicsObject.length; i++) {
            if (politicsObject[i].name == politic)
                return true;
        }
    };

    setChartValues = function () {
        if (politicsMentionCountObject.data.length > 0) {
            chart.series[0].setData(politicsMentionCountObject.data, true);
        }
    };

    init = function () {
        openWebSocket();
        setChartConfigurations();
    };

//Public Methods
    return {
        init: init
    };

})();

$(document).ready(function () {
    TweetsModalControl.init();
});
