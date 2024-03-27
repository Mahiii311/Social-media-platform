$(document).ready(function () {

    $("#editPostForm").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            title: {
                required: true,
                maxlength: 30
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
        submitHandler: function () {
            var formData = new FormData();
            // formData.append('postId',postId);
            formData.append('title', $("#title").val());
            formData.append('description', $("#description").val());
            formData.append('postImg', $("#postImg")[0].files[0]);
            console.log(formData);
            $.ajax({
                type: "post",
                url: "/post/edit",
                processData: false,
                contentType: false,
                data: formData,
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
                        alert(JSON.stringify(error))
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