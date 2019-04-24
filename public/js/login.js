$(() => {
 
  $('#login').click(() => {
      $.post(
      '/login',
      {
          name: $('#name').val()
      },
      (data) => {
          if (data.success) {
              // console.log(window.location,"||",window.location.origin,"||",window.location.href)
              // alert("User addes sucsessfully, please login")
            window.location.href = window.location.origin;
          }else{
            alert("Invalid Data !!")
          }
      }
      )
  })
})
