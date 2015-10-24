var RegisterScript = (function() {

	validateRegisterAndSave = function(){
		$(document).ready(function(){
			
			$('#registerBtn').attr('disabled','disabled');

			$("#newUserForm").bootstrapValidator({
				excluded: [':disabled', ':hidden', ':not(:visible)'],

				feedbackIcons: {
            		valid: 'glyphicon glyphicon-ok-circle',
            		invalid: 'glyphicon glyphicon-remove-circle',
            		validating: 'glyphicon glyphicon-refresh'
        		},

				fields : {
					firstName: {
		                validators: {
		                    notEmpty: {
		                        message: 'O campo de nome não pode estar vazio!'
		                    },

		                    stringLength: {
		                    	min: 3,
		                        max: 20,
		                        message: 'O campo de nome deve ter no mínimo 3 e no máximo 20 caracteres!'
		                    },

		                    regexp: {
		                    	regexp: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
		                    	message: 'O nome pode consistir somente de letras!'
		                    }
		                }
					},

					lastName: {
		                validators: {
		                    notEmpty: {
		                        message: 'O campo de sobrenome não pode estar vazio!'
		                    },

		                    stringLength: {
		                    	min: 3,
		                        max: 20,
		                        message: 'O campo de sobrenome deve ter no mínimo 3 e no máximo 20 caracteres!'
		                    },

		                    regexp: {
		                    	regexp: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
		                    	message: 'O sobrenome pode consistir somente de letras!'
		                    }
		                }
					},

					userName: {
		                validators: {
		                    notEmpty: {
		                        message: 'O campo de usuário não pode estar vazio!'
		                    },

		                    stringLength: {
		                    	min: 3,
		                        max: 15,
		                        message: 'O campo de usuário deve ter no mínimo 3 e no máximo 15 caracteres!'
		                    },

		                    regexp: {
		                        regexp: /^[a-zA-Z0-9_]+$/,
		                        message: 'O usuário pode consistir somente de letras, números ou underline!'
		                    }
		                }
					},

					passwd: {
						validators: {
                    		notEmpty: {
                        		message: 'O campo de senha não pode estar vazio!'
                    		},

                    		identical: {
                        		field: 'retypePasswd',
                        		message: 'As senhas devem corresponder!'
                    		}
                		}
					},

					retypePasswd: {
						validators: {
                    		notEmpty: {
                        		message: 'Por favor, digite a senha novamente!'
                    		},

                    		identical: {
                        		field: 'passwd',
                        		message: 'As senhas devem corresponder!'
                    		}
                		}
					}
				},

				submitHandler: function() {
			  		$.ajax({
					    url: "/newUser",
					    data: $("#newUserForm").serialize(),
					    type: "POST",
					    success: function(result) {
							toastr.success(result);
							$("#registerModal").modal('toggle');
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
		$("#userName").val('');
		$("#passwd").val('');
		$("#retypePasswd").val('');	
		$("#newUserForm")
    		.bootstrapValidator('updateStatus', 'userName', 'NOT_VALIDATED')
    		.bootstrapValidator('updateStatus', 'passwd', 'NOT_VALIDATED')
    		.bootstrapValidator('updateStatus', 'retypePasswd', 'NOT_VALIDATED')
		$("#userName").focus();
	};

	//Private Methods
	setEvents = function(){
		validateRegisterAndSave();
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
	RegisterScript.init();
});