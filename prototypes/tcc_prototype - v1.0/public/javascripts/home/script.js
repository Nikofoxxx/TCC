var PoliticStatusScript = (function() {

	//Private Methods
	changeTransparencyOfNavbar = function(){
		$(document).on('scroll', function (e) {
    		var alpha = ($(document).scrollTop() / 550) + 0.6;
    		$('.navbar-default').css('background-color', 'rgba(0, 151, 255,' + alpha + ')');
		});
	};

	mountGrid = function (){

		 $table = $('#politicsGrid');
			$table.dataTable({
				"ajax": 'http://localhost:3000/getAll',
				"sDom": 'Rfrtlip',
				"bSort": false,

				"columns": [
					{ "data": "politic_name", "sWidth": "60%", "sClass": "center"  },
					{ "sWidth": "1%", "sClass": "center" },
					{ "sWidth": "1%", "sClass": "center" }
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
				]
			});

			var tableTools = new $.fn.dataTable.TableTools($table, {
        		sRowSelect: "os",
    		});
   			
   			$(tableTools.fnContainer()).appendTo('#politicsGrid .col-sm-3:eq(0)');
			$(".dataTables_length").addClass("col-md-9");
	};

	renderEditButton = function(name){
		var editBtn =  String.format("<button class='btn btn-default btn-xs' onClick='getModalToEditPolitic({0});'>" + 
						     		 "<i class='fa fa-pencil fa-lg'></i></button>", name);

		return String.format("{0}", editBtn);
	};

	renderDeleteButton = function(name){
		var deleteBtn =  String.format("<button class='btn btn-default btn-xs' onClick='getModalToRemovePolitic({0});'>" +
						     		   "<i class='fa fa-trash-o fa-lg'></i></button>", name);

		return String.format("{0}", deleteBtn);
	};

	getModalToCreatePolitic = function(){
		$("#divToCreatePolitcModal").load("http://localhost:3000/createPoliticModal", function (res, status, req) {
			if(status == "success"){
				$("#createPolitcModal").modal('show');
			}
		});
	};

	createPolitic = function(){
		var politicName = $("#createModalInput").val();

		var data = { 'name' : politicName };
		$.ajax({
			url: "http://localhost:3000/createPolitic",
			data : data,
			type: "POST",
			success: function(result){
				$("#createPolitcModal").modal('toggle');
				refreshTable('#politicsGrid', 'http://localhost:3000/getAll', result);
			},
			error: function(result){
				toastr.error(result.responseText);
			}
		});
		
	};

	getModalToEditPolitic = function(name){
		$("#divToEditPolitcModal").load("http://localhost:3000/editPoliticModal", function (res, status, req) {
			if(status == "success"){
				$("#editPolitcModal").modal('show');
				$("#editModalInput").val(name);
				$("#editModalInputHidden").val(name);
			}
		});
	};

	editPolitic = function(){
		var oldPoliticName = $("#editModalInputHidden").val();
		var newPoliticName = $("#editModalInput").val();

		var data = { 'oldName' : oldPoliticName, 'newName' : newPoliticName };
		$.ajax({
			url: "http://localhost:3000/editPolitic",
			data : data,
			type: "POST",
			success: function(result){
				$("#editPolitcModal").modal('toggle');
				refreshTable('#politicsGrid', 'http://localhost:3000/getAll', result);
			},
			error: function(result){
				toastr.error(result.responseText);
			}
		});
		
	};	

	getModalToRemovePolitic = function(name){
		$("#divToRemovePolitcModal").load("http://localhost:3000/removePoliticModal", function (res, status, req) {
			if(status == "success"){
				$("#deletePolitcModal").modal('show');
				$("#removeModalInputHidden").val(name);
			}
		});
	};

	removePolitic = function(){
		var politicName = $("#removeModalInputHidden").val();

		var data = { 'name' : politicName };
		$.ajax({
			url: "http://localhost:3000/removePolitic",
			data : data,
			type: "POST",
			success: function(result){
				$("#deletePolitcModal").modal('toggle');
				refreshTable('#politicsGrid', 'http://localhost:3000/getAll', result);
			},
			error: function(result){
				toastr.error(result.responseText);
			}
		});
	};

	hideOrShowPoliticsGrid = function() {
		if($(".panel-body").is(":visible")){
			$(".panel-body").hide('slow');
			$("#toggleBtn").find("i").removeClass("fa fa-eye-slash fa-lg");
			$("#toggleBtn").find("i").addClass("fa fa-eye fa-lg");
			$("#politicsGrid tbody tr").removeClass('active');
		}else{
			$(".panel-body").show('slow');
			$("#toggleBtn").find("i").removeClass("fa fa-eye fa-lg");
			$("#toggleBtn").find("i").addClass("fa fa-eye-slash fa-lg");
		}
	};

	events = function() {
		$("#toggleBtn").attr('onclick', 'hideOrShowPoliticsGrid();');
		$("#createPolitic").attr('onclick', 'getModalToCreatePolitic();');
	};
	
	init = function (){
		events();
		changeTransparencyOfNavbar();
		mountGrid();
	};

	//Public Methods
	return {
		init: init,
		events: events
	};

})();

$(document).ready(function(){
	PoliticStatusScript.init();
});
 