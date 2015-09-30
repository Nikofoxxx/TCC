var userControl = (function () {

    validateUserFormAndSave = function(){
        $(document).ready(function(){

            $('#submitUserBtn').attr('disabled','disabled');

            $("#editUserForm").bootstrapValidator({
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
                                regexp: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/,
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
                                regexp: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/,
                                message: 'O sobrenome pode consistir somente de letras!'
                            }
                        }
                    },

                    userName: {
                        validators: {
                        }
                    },

                    passwd: {
                        validators: {
                            identical: {
                                field: 'retypePasswd',
                                message: 'As senhas devem corresponder!'
                            }
                        }
                    },

                    retypePasswd: {
                        validators: {
                            identical: {
                                field: 'passwd',
                                message: 'As senhas devem corresponder!'
                            }
                        }
                    }
                },

                submitHandler: function() {
                    $.ajax({
                        url: "/editUser",
                        data: $("#editUserForm").serialize(),
                        type: "POST",
                        success: function(result) {
                            handleNewUser(JSON.parse(result));
                            toastr.success("Usuario editado com sucesso!");
                            $("#editUserModal").modal('toggle');
                        },
                        error: function(result){
                            toastr.error(result.responseText);
                        }
                    });
                }
            });
        });
    };

    handleNewUser = function(user){
        $("#userPanel > label").text(user.firstName + " " + user.lastName + "!");
    };

    init = function(){
        validateUserFormAndSave();
    };

    return {
        init : init
    }
})();

$(document).ready(function () {
    userControl.init();
});

