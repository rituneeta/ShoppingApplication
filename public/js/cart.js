
function refreshList() {
    $.get('/cartItems', (data) => {
      $('#productList').empty()
      let n = 0;
      let cost = 0;
      while(n<data.length){
        console.log("printing line")
        let txt = '<div class="row">';
        for(let i =0;i<3; i++,n++){
          console.log(n,data.length)
          if(n<data.length){
            cost = cost + data[n].price * data[n].quantity;

            txt +=
            `
            <div class=" col-md-4">
              <div class="card">
                <h4><b>Name : ${data[n].name}</b></h4> 
                <h4>Price : ${data[n].price}</h4>
                <h4>Quantity : ${data[n].quantity}</h4>
                <button class="btn btn-primary glyphicon glyphicon-remove" type="button" value="${data[n].productId}" onclick="removeFromCart(event)"></button> 
                <button class="btn btn-primary glyphicon glyphicon-plus" type="button" value="${data[n].productId}" onclick="addToCart(event)"></button> 
                <button class="btn btn-primary glyphicon glyphicon-minus" type="button" value="${data[n].productId}" onclick="subFromCart(event)"></button> 
              </div>
            </div>
            `;
          }else{
            txt +=
            `
            <div class=" col-md-4">
            </div>
            `;
          }
        }
        txt+=`</div>`;
        $('#productList').append(txt);
        if(n >= data.length){
          break;
        }
        
      }

      if(data.length>0){
        $('#productList').append(`
        <div class="row" style="color:white">
          <div class="col-md-4">Grand Total</div>
          <div class="col-md-4"></div>
          <div id="total" class="col-md-4">${cost}</div>
        </div>
        `);
      }
    })
  }

  // function refreshCart(){
  //   $.get('/cartLen',(data)=>{
  //       $("#cart").html(`Cart( ${data.length} )`)
  //   })  
  // }

  function removeFromCart(event){
    console.log(event.target.value)
    console.log("remove me aya")
      $.post('/removeFromCart',{
          productId:event.target.value
      },(data)=>{
          if(data.success){
           refreshList()
          }
      })
  }

function addToCart(event){
  console.log(event.target.value);
  $.post('/addToCart',{
      productId:event.target.value
  },(data)=>{
      if(data.success){
        refreshList()
      }
    }
  )
}

function subFromCart(event){
  console.log(event.target.value);

  $.post('/subFromCart',{
    productId:event.target.value
},(data)=>{
    if(data.success){
      refreshList()
    }
  }
)
}
$(() => {

    
  
    refreshList()
    // refreshCart()
  
    $('#add').click(() => {
      $.post(
        '/products',
        {
          name: $('#name').val(),
          price: $('#price').val(),
          quantity :$('#quantity').val(),
          vendorId :$('#vendorId').val()
        },
        (data) => {
          if (data.success) {
            refreshList()
          }
        }
      )
    })
  
   
    
  });
  
  