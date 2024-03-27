$(document).ready(function () {

    $("#addPostForm").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            title: {
                required: true,
                maxlength: 30
            },
            postImg: {
                required: true
            },
            description: {
                maxlength: 300
            }
        },
        message: {
            title: {
                maxlength: "maximum 30 character allowed"
            },
            description: {
                maxlength: "maximum 300 character allowed"
            }
        },
        submitHandler: function (form) {
            const fd = new FormData(form);
            console.log(fd);
            $.ajax({
                type: "post",
                url: "/post/create",
                processData: false,
                contentType: false,
                data: fd,
                success: function (response) {
                    console.log(response.message);
                    alert(JSON.stringify(response.message));
                    form.reset();
                    location.href = '/post'
                },
                error: function (error) {
                    console.log("error");
                    console.log(error);
                    if (error && error.responseJSON && error.responseJSON.message) {
                        console.log(error.message);
                        alert(JSON.stringify(error.responseJSON.message))
                    } else {
                        console.log(error.message);
                        alert(error.message)
                    }
                }
            });
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element)
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