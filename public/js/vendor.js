function refreshList() {
  $.get('/vendors', (data) => {
    $('#vendorlist').empty();
    $('#vendorlist').append(
      `<tr>
      <th style="color:black">Name</th>
      <th style="color:black">Action</th>
    </tr>`
    )
    for (let vendor of data) {
      $('#vendorlist').append(
        
    `<tr><td>${vendor.name}</td>
      <td style="color:black">  <button class="btn btn-primary" type="button" id="${vendor.id}"
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
  