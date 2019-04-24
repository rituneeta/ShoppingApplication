function refreshList() {
    $.get('/products', (data) => {
      $('#productList').empty()

      let n = 0;
      while(n<data.length){
        console.log("printing line")
        let txt = '<div class="row">';
        for(let i =0;i<3; i++,n++){
          console.log(n,data.length)
          if(n<data.length){
            txt +=
            `
            <div class=" col-md-4">
              <div class="card">
                <h4><b>Name : ${data[n].name}</b></h4> 
                <h4>Price : ${data[n].price}</h4>
                <h4>Quantity : ${data[n].quantity}</h4>
                <button class="btn btn-primary" style="margin: 0 40%" type="button" id="${data[n].id}" onclick="addToCart(event)">Add TO CART</button> 
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
    })
  }

  function refreshCart(){
    $.get('/cartLen',(data)=>{
        $("#cart").html(`Cart( ${data.length} )`)
    })  
  }

  function addToCart(event){
      $.post('/addToCart',{
          productId:event.target.id
      },(data)=>{
          if(data.success){
              refreshCart()
              refreshList()
          }
      })
  }

$(() => {

    
  
    refreshList()
    refreshCart()
  
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
  
    
  })
  