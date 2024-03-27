$(document).ready(function () {
    $.ajax({
        url: '/list',
        type: 'get',
        async: false,
        success: function (response) {
            $(".postList").html(response);
        },
        error: function (response) {
            console.log("Error call")
            console.log(response);
        }
    });

    $(".viewPost").on('click', function () {
        // console.log($(this).data('id'));
        $.ajax({
            url: `/post/view?viewId=${$(this).data('id')}`,
            type: 'get',
            async: false,
            success: function (response) {
                $("#model").html(response);
            },
            error: function (response) {
                console.log("Error call")
                console.log(response);
            }
        });
    });
    $(document).on('click', "#closeModel", function () {
        $(this).parentsUntil('#model').remove();
    });
    $(".editPost").on('click', function (){
        $.ajax({
            url: `/post/view?editId=${$(this).data('id')}`,
            type: 'get',
            async: false,
            success: function (response) {
                $("#model").html(response);
            },
            error: function (response) {
                console.log("Error call")
                console.log(response);
            }
        });
    });
    $(".savePost").on('click', function () {
        // if ($(this).attr('data-value') == 'true') {
        //     $(this).attr('data-value', false)
        // } else {
        //     $(this).attr('data-value', true)
        // }
        $.ajax({
            url: `/post/savePost?btnValue=${$(this).attr('data-value')}`,
            type: 'post',
            async: false,
            data: {
                _postId: $(this).attr('data-id')
            },
            success: (response) => {
                // console.log(response)
                $(this).children().removeClass()
                if (response.message == 'successfully save') {
                    $(this).children().addClass("bi bi-bookmark-fill")
                } else {
                    $(this).children().addClass("bi bi-bookmark")
                }
            },
            error: function (response) {
                console.log("Error call")
                console.log(response);
            }
        });
    });

    $(".archivePost").on('click', function () {
        $.ajax({
            url: `/post/archive/${$(this).data('id')}`,
            type: 'delete',
            async: false,
            success: (response) => {
                console.log(response.message);
                $(this).closest('.postCard').remove();
            },
            error: function (response) {
                console.log("Error call")
                console.log(response);
            }
        });
    });
});