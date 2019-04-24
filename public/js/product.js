function refreshList() {
  $.get('/products', (data) => {
    $('#productlist').empty()
    $('#productlist').append(
      `<tr>
      <th>Name</th>
      <th>price</th>
      <th>quantity</th>
      <th>Action</th>
    </tr>`
    )
   
    for (let product of data) {
      $('#productlist').append(
       // `<li>name: ${product.name} ,  price ${product.price} ,  qantity ${product.quantity}</li>`
       `<tr>
       <td>${product.name}</td>
       <td>${product.price}</td>
       <td>${product.quantity}</td>
       <td><button  value="${product.id}"onclick="deleteElement(event)">
       Delete</button></td>
     </tr>`
      )
    }
  })
}

function deleteElement(event){
  console.log(event.target.value);
  $.post('/deleteProduct',
  {
    id:event.target.value
  }
  ).then(data=>{
    if(data.success){
      refreshList()
    }
  })
}

$(() => {
  
    refreshList()
  
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
  