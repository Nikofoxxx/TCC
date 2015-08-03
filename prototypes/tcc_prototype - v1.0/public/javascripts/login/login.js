var LoginScript = (function() {

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

	validateLoginForm = function(){
		$(document).ready(function(){
			
			$("#loginForm").bootstrapValidator({
				excluded: [':disabled', ':hidden', ':not(:visible)'],

				fields : {
					UserName: {
		                validators: {
		                    notEmpty: {
		                        message: 'Informe o usuário!'
		                    }
		                }
					},

					Passwd: {
		                validators: {
		                    notEmpty: {
		                        message: 'Informe a senha!'
		                    }
		                }
					}
				},

				submitHandler: function() {
			  		$.ajax({
					    url: "/login",
					    data: $("#loginForm").serialize(),
					    type: "POST",
					    success: function(result){
		                    window.location = result.redirect
					    },
					    error: function(result){
					    	toastr.error(result.responseText);
					    	clearUserFields(); 
					    }
			  		});
				}
			});
		});
	};

	clearUserFields = function(){
		$("#UserName").val('');
		$("#Passwd").val('');
		$("#loginForm")
    		.bootstrapValidator('updateStatus', 'UserName', 'NOT_VALIDATED')
    		.bootstrapValidator('updateStatus', 'Passwd', 'NOT_VALIDATED')
	};

	getModalToRegister = function(){
		$("#divToRegisterModal").load("/registerModal", function (res, status, req) {
			if(status == "success"){
				$("#registerModal").modal('show');
			}
		});
	};

	setEvents = function(){
		configureToastr();
		validateLoginForm();
	};

	init = function(){
		setEvents();
	};

	//Public Methods
	return {
		init: init,
	};

})();

$(document).ready(function(){
	LoginScript.init();
});