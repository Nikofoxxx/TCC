var Events = (function (){

  configureToastr = function(){
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
}
  };

  refreshTable = function(tableId, urlData, message){
    $.getJSON(urlData, null, function( json )
    {
      table = $(tableId).dataTable();
      oSettings = table.fnSettings();
       
      table.fnClearTable(this);
   
      for (var i=0; i<json.data.length; i++)
      {
        table.oApi._fnAddData(oSettings, json.data[i]);
      }
   
      oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
      table.fnDraw();
    });  
    toastr.success(message);
  };

  init = function (){
    configureToastr();
  };

  //Public Methods
  return {
    init: init,
  };

})();

$(document).ready(function(){
  Events.init();
});
 