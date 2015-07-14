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
		var editBtn =  String.format("<button class='btn btn-default btn-xs' onClick='editPolitic({0});'>" + 
						     		 "<i class='fa fa-pencil fa-lg'></i></button>", name);

		return String.format("{0}", editBtn);
	};

	renderDeleteButton = function(name){
		var deleteBtn =  String.format("<button class='btn btn-default btn-xs' onClick='removePolitic({0});'>" +
						     		   "<i class='fa fa-trash-o fa-lg'></i></button>", name);

		return String.format("{0}", deleteBtn);
	};

	editPolitic = function(name){
		$("#divToEditPolitcModal").load("http://localhost:3000/editPoliticModal", function (res, status, req) {
			if(status == "success"){
				$("#editPolitcModal").modal('show');
				$("#modalPoliticInput").val(name);
				$("#modalPoliticInputHidden").val(name)
			}
		});
	};

	removePolitic = function(data){
	};

	sendPoliticToEdit = function(){
		var oldPoliticName = $("#modalPoliticInputHidden").val();
		var newPoliticName = $("#modalPoliticInput").val();

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
				toastr.error(result);
			}
		});
		
	}

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
	}

	events = function() {
		$("#toggleBtn").attr('onclick', 'hideOrShowPoliticsGrid();');
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
 