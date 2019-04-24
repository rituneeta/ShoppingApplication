$(() => {
 
    $('#signup').click(() => {
        $.post(
        '/signup',
        {
            name: $('#name').val(),
            email: $('#email').val()
        },
        (data) => {
            if (data.success) {
                console.log(window.location,"||",window.location.origin,"||",window.location.href)
                alert("User addes sucsessfully, please login")
                window.location.href = window.location.origin
            }else{
                alert("unable to Create user")
            }
        }
        )
    })
})
  