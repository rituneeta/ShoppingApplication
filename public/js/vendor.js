function refreshList() {
  $.get('/vendors', (data) => {
    $('#vendorlist').empty();
    $('#vendorlist').append(
      `<tr>
      <th>Name</th>
      <th>Action</th>
    </tr>`
    )
    for (let vendor of data) {
      $('#vendorlist').append(
        
    `<tr><td>${vendor.name}</td>
      <td>  <button class="btn btn-primary" type="button" id="${vendor.id}"
            onclick="deleteVendor(event)">Delete</button> 
       </td>
      </tr>`
      )
    }
  })
}
function deleteVendor(event)
 {
    $.post('/deleteVendor',{
      id: event.target.id
    },(data)=>{
      if(data.success){
       refreshList()
      }
  })
}

$(() => {

    

    refreshList()
   
    $('#add').click(() => {
      $.post(
        '/vendors',
        {
          name: $('#name').val()
        },
        (data) => {
          if (data.success) {
            refreshList()
          }
        }
      )
    })

})
  