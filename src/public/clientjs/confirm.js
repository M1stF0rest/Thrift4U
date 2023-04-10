function confirmDelete(id) {
    if (confirm("Are you sure you want to delete this item?")) {
      // User clicked "OK"
      // Send a request to the server to perform the delete operation
      fetch('/delete/'+id, { method: 'GET' })
        .then(function(res){
          alert('delete successfully');
        });
    } else {
      // User clicked "Cancel"
      // Do nothing or show a message to the user
    }
  }