$(document).ready(function () {

    $.validator.addMethod("checkName", function (value) {
        return /^[a-zA-z]+$/.test(value);
    }, "Name not contain number or any spacial character");

    $.validator.addMethod("checkEmail", function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    }, "Invalid Email Id");

    $.validator.addMethod("checkPassword", function (value) {
        return /(?!.*[\s])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(value);
    }, "Password must contain Upper case latter, Lowwer case latter, Number and spacial characters");

    $("#signUpForm").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            firstName: {
                required: true,
                checkName: true
            },
            lastName: {
                required: true,
                checkName: true
            },
            email: {
                required: true,
                checkEmail: true,
                remote:{
                    url:`/sign-up/emailValidate/${$("#email").val()}`,
                    type:'get'
                }
            },
            gender: {
                required: true
            },
            password: {
                required: true,
                checkPassword: true,
                minlength: 6
            },
            conformPassword: {
                required: true,
                equalTo: "#password"
            },
            checkbox: {
                required: true
            }
        },
        messages: {
            email: {
                remote: "Email already in exist"
            },
            password: {
                minlength: "Password Contain Minimum 6 characters"
            },
            conformPassword: {
                equalTo: "Password is not same"
            }
        },
        submitHandler: function (form) {
            const fname = $("#firstName").val().charAt(0).toUpperCase() + $("#firstName").val().slice(1).toLowerCase();
            const lname = $("#lastName").val().charAt(0).toUpperCase() + $("#lastName").val().slice(1).toLowerCase();
            $.ajax({
                type: "post",
                url: "/sign-up",
                data: {
                    firstName: fname,
                    lastName: lname,
                    email: $("#email").val().trim().toLowerCase(),
                    gender: $('input[name="gender"]:checked').val(),
                    password: $("#password").val(),
                },
                success: function (response) {
                    console.log(response.message);
                    alert(JSON.stringify(response.message));
                    form.reset();
                    location.href = '/sign-in'
                },
                error: function(error){
                    console.log("error");
                    console.log(error);
                    if(error && error.responseJSON && error.responseJSON.message){
                        console.log(error.message);
                        alert(JSON.stringify(error))
                    }else{
                        console.log(error.message);
                        alert(error.message)
                    }
                }
            });
        },
        errorPlacement: function (error, element) {
            if (element.attr("name") == "password" || element.attr("name") == "conformPassword" || element.attr("name") == "gender") {
                error.insertAfter($(element).parent('div').next($('#showError')))
            } else {
                error.insertAfter(element)
            }
        },
        errorClass: "text-danger",
        highlight: function (element) {
            $(element).parent().addClass('error')
        },
        unhighlight: function (element) {
            $(element).parent().removeClass('error')
        }
    });
})