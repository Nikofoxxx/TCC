var streamControl = function(){

    var socket = getSocket();

    handlePauseButtonPress = function(){
        $(".pause-stream").attr('disabled', 'disabled');
        $(".resume-stream").attr('disabled', false);

        socket.emit('pause');
        toastr.error("<strong>Modo leitura Ativado!</strong>");
    };

    handleResumeButtonPress = function(){
        $(".resume-stream").attr('disabled', 'disabled');
        $(".pause-stream").attr('disabled', false);

        socket.emit('resume');
        toastr.success("<strong>Modo leitura Desativado!</strong>");
    };

    handleInModalClose = function(){
        $('#tweetsModal').on('hidden.bs.modal', function () {
            socket.emit('resume');
        });
    };

    init = function(){
        $(".pause-stream").attr('onclick', 'handlePauseButtonPress();');
        $(".resume-stream").attr('onclick', 'handleResumeButtonPress();');
        handleInModalClose();
    };

    return {
        init: init
    }

}();

$(document).ready(function(){
    streamControl.init();
});