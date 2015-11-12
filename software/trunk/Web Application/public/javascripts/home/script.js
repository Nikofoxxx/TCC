var PoliticStatusScript = (function () {

    var politicsInGrid = [];

    //Private Methods
    mountGrid = function () {

        $table = $('#politicsGrid');
        $table.dataTable({
            "ajax": '/getAll',
            "sDom": 'Rfrtlip',
            "bSort": false,

            "columns": [
                {"data": "politic_name", "sWidth": "60%", "sClass": "center"},
                {"sWidth": "1%", "sClass": "center"},
                {"sWidth": "1%", "sClass": "center"}
            ],

            "columnDefs": [
                {
                    "targets": 1,
                    "render": function (data, type, row) {
                        return renderEditButton(JSON.stringify(row.politic_name));
                    }
                },

                {
                    "targets": 2,
                    "render": function (data, type, row) {
                        return renderDeleteButton(JSON.stringify(row.politic_name));
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                politicsInGrid = [];
                if (oSettings.aoData.length > 0) {
                    for (var i = 0; i < oSettings.aoData.length; i++) {
                        politicsInGrid.push(oSettings.aoData[i]._aData.politic_name);
                    }
                }
            }
        });

        var tableTools = new $.fn.dataTable.TableTools($table, {
            sRowSelect: "os",
        });

        $(tableTools.fnContainer()).appendTo('#politicsGrid .col-sm-3:eq(0)');
        $(".dataTables_length").addClass("col-md-9");
    };

    renderEditButton = function (name) {
        var editBtn = String.format("<button class='btn btn-default btn-xs' onClick='getModalToEditPolitic({0});'>" +
            "<i class='fa fa-pencil fa-lg'></i></button>", name);

        return String.format("{0}", editBtn);
    };

    renderDeleteButton = function (name) {
        var deleteBtn = String.format("<button class='btn btn-default btn-xs' onClick='getModalToRemovePolitic({0});'>" +
            "<i class='fa fa-trash-o fa-lg'></i></button>", name);

        return String.format("{0}", deleteBtn);
    };

    getModalToCreatePolitic = function () {
        bootwait.show();
        $("#divToCreatePolitcModal").load("/createPoliticModal", function (res, status, req) {
            if (status == "success") {
                bootwait.hide();
                $("#createPolitcModal").modal('show');
            }
        });
    };

    createPolitic = function () {
        if(validate($("#createModalInput"))) {
            bootwait.show();
            var politicName = $("#createModalInput").val();

            var data = {'name': politicName};
            $.ajax({
                url: "/createPolitic",
                data: data,
                type: "POST",
                success: function (result) {
                    bootwait.hide();
                    $("#createPolitcModal").modal('toggle');
                    refreshTable('#politicsGrid', '/getAll', result);
                },
                error: function (result) {
                    bootwait.hide();
                    toastr.error(result.responseText);
                }
            });
        }
    };

    getModalToEditPolitic = function (name) {
        bootwait.show();
        $("#divToEditPolitcModal").load("/editPoliticModal", function (res, status, req) {
            if (status == "success") {
                bootwait.hide();
                $("#editPolitcModal").modal('show');
                $("#editModalInput").val(name);
                $("#editModalInputHidden").val(name);
            }
        });
    };

    editPolitic = function () {
        if(validate($("#editModalInput"))){
            bootwait.show();
            var oldPoliticName = $("#editModalInputHidden").val();
            var newPoliticName = $("#editModalInput").val();

            var data = {'oldName': oldPoliticName, 'newName': newPoliticName};
            $.ajax({
                url: "/editPolitic",
                data: data,
                type: "POST",
                success: function (result) {
                    bootwait.hide();
                    $("#editPolitcModal").modal('toggle');
                    refreshTable('#politicsGrid', '/getAll', result);
                },
                error: function (result) {
                    bootwait.hide();
                    toastr.error(result.responseText);
                }
            });
        }
    };

    validate = function($input){
        if($input.val() == '') { toastr.error('O campo não pode estar vazio!'); $input.focus(); return false; }
        if($input.val().length <= 2) { toastr.warning('O campo não pode conter menos que 3 caracteres!'); $input.focus(); return false; }
        return true;
    };

    getModalToRemovePolitic = function (name) {
        bootwait.show();
        $("#divToRemovePolitcModal").load("/removePoliticModal", function (res, status, req) {
            if (status == "success") {
                bootwait.hide();
                $("#deletePolitcModal").modal('show');
                $("#removeModalInputHidden").val(name);
            }
        });
    };

    removePolitic = function () {
        bootwait.show();
        var politicName = $("#removeModalInputHidden").val();

        var data = {'name': politicName};
        $.ajax({
            url: "/removePolitic",
            data: data,
            type: "POST",
            success: function (result) {
                bootwait.hide();
                $("#deletePolitcModal").modal('toggle');
                refreshTable('#politicsGrid', '/getAll', result);
            },
            error: function (result) {
                bootwait.hide();
                toastr.error(result.responseText);
            }
        });
    };

    hideOrShowPoliticsGrid = function () {
        if ($(".panel-body").is(":visible")) {
            $(".panel-body").hide('slow');
            $("#toggleBtn").find("i").removeClass("fa fa-eye-slash fa-lg").addClass("fa fa-eye fa-lg");
            $("#politicsGrid tbody tr").removeClass('active');
        } else {
            $(".panel-body").show('slow');
            $("#toggleBtn").find("i").removeClass("fa fa-eye fa-lg").addClass("fa fa-eye-slash fa-lg");
        }
    };

    getTweetsModal = function () {
        if(politicsInGrid.length > 0){
            bootwait.show();
            $("#divToTweetsModal").load("/tweetsModal", function (res, status, req) {
                if (status == "success") {
                    bootwait.hide();
                    $("#tweetsModal").modal('show');
                    generateTweetsModalContent();
                }
            });
        }else{
            toastr.warning("Não existe nenhum político cadastrado na busca! Por favor, cadastre ao menos um.");
        }
    };

    generateTweetsModalContent = function () {

        if (politicsInGrid.length == 1) {
            $("#tabs").html(String.format('<li class="active">' +
                '<a href="#tab0" data-toggle="tab">{0}</a></li>',
                politicsInGrid[0]));

            getTweetModalContent(function (result) {
                $("#tab0").append(String.format('{0}', result));
            });
        } else {
            var content = getNavsToShowInModal();

            $("#tabs").html(String.format('<li class="active">' +
                '<a href="#tab0" data-toggle="tab">{0}</a></li>' +
                '{1}', politicsInGrid[0], content));

            getTweetModalContent(function (result) {
                $("#tab0").append(String.format('{0}', result));

                for (var i = 1; i < politicsInGrid.length; i++) {
                    $(".tab-content").append(String.format('<div class="tab-pane" id="tab{0}" style="height: 400px;">{1}</div>', i, result));
                }
            });
        }
    };

    getTweetModalContent = function (callback) {
        $.ajax({
            url: '/getTweetModalContent',
            type: 'GET',
            success: function (result) {
                callback(result)
            }
        });
    };

    getNavsToShowInModal = function () {
        var htmlToAppend = "";

        for (var i = 1; i < politicsInGrid.length; i++) {
            htmlToAppend += String.format('<li><a href="#tab{0}" data-toggle="tab">{1}</a></li>', i, politicsInGrid[i]);
        }

        return String.format("{0}", htmlToAppend);
    };

    getEditUserModal = function(){
        bootwait.show();
        $("#divToEditUserModal").load("/editUserModal", function (res, status, req) {
            if (status == "success") {
                bootwait.hide();
                $("#editUserModal").modal('show');

                var name = $("#userPanel > label").text();
                var firstName = name.split(" ")[0];
                var lastName = name.split(" ")[1];

                $("#firstName").val(firstName);
                $("#lastName").val(lastName.substring(0, lastName.length - 1));
                $("#userNameDisabled").val($("#hiddenUserName").val());
                $("#userName").val($("#hiddenUserName").val());
            }
        });
    };

    getDonutChartModal = function(){
        bootwait.show();
        getPoliticsMentionCountObject(function(politicsObject){
            if(politicsObject.length > 0){
                bootwait.hide();
                $("#donutChartModal").modal('show');
                setChartValues();
            } else {
                bootwait.hide();
                toastr.warning("Ainda não foram contabilizados os tweets! Por favor, aguarde!");
            }
        });
    };

    setButtonEvents = function () {
        $("#editUserBtn").attr('onclick', 'getEditUserModal();');
        $("#toggleBtn").attr('onclick', 'hideOrShowPoliticsGrid();');
        $("#createPolitic").attr('onclick', 'getModalToCreatePolitic();');
        $("#logo").attr('onclick', '$("html,body").animate({scrollTop:0}, "slow");');
        $("#twitterBtn").attr('onclick', 'getTweetsModal();');
        $("#donutChartBtn").attr('onclick', 'getDonutChartModal();')
    };

    events = function () {
        $('.navbar-default').css('background-color', 'rgba(0, 30, 79, 0.7)');

        $('#secondDate').datepicker({
            orientation: "bottom left",
            todayBtn: true
        });

        setButtonEvents();
    };

    init = function () {
        events();
        mountGrid();
    };

    //Public Methods
    return {
        init: init,
    };

})();

$(document).ready(function () {
    PoliticStatusScript.init();
});