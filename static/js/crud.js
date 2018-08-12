function CRUD() {
  
};

CRUD.submitForm = (form) => {  
  let btns = form.querySelectorAll('button');
  
  let method;
  for (let btn of btns) {
    if (btn.clicked) {
      switch(btn.value) {
        case 'create':
          method = 'PUT'; break;
        case 'edit':
          method = 'POST'; break;
        case 'delete':
          if (confirm('Are you sure you want to delete this record?') === false) {
            btn.clicked = false;
            return false;
          }
          method = 'DELETE'; break;
        default:
      }
    }
  }
  
  if (typeof method === 'undefined') {
    console.error('No valid button click detected');
    return false;
  }
  
  let json = {
    data:{}
  };
  try {
    for (let input of form.elements) {
      if (input.tagName === "INPUT") {
        json.data[input.name] = input.value;
      } else if (input.tagName === "SELECT") {
        if (input.selectedIndex > -1) {
          json.data[input.name] = input[input.selectedIndex].value;
        } else {
          json.data[input.name] = '';
        }
      }
    }
  } catch(err) {
    json.error = err;
  }
  
  fetch(location.pathname, {
      method: method,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(json)
  })
  .then(response => {
    response.json().then(json => {
      if (json.error) {
        alert(json.error);
      } else {
        switch(method) {
          case 'DELETE':
            alert('SUCCESS - DELETED: _id = ' + json.data._id);
            window.location = window.location.origin + '/' + window.location.pathname.split('/')[1]; break;
          case 'PUT':
            alert('SUCCESS - CREATED: _id = ' + json.data._id);
            window.location.reload(); break;                                                                                                                                                                                             
          case 'POST':
            alert('SUCCESS - UPDATED: _id = ' + json.data._id);
            window.location.reload(); break;
          default:
        }
      }
    })
  })
  .catch(error => console.error(`ERROR:\n`, error));
  
  return false;
};
