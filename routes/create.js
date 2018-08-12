// create - front end
exports.route = function(request,response) {
  const domain = request.path.split('/')[1];
  const data = request.app.get(domain);
  
  /* 
   * character data
     text
     secret
     hidden
     
     attributes: placeholder, value, min, max, pattern, required
     
   * numeric data
     number
     
     attributes: placeholder, value, min, max, required
     
   * time data
     month
     week
     day
     date
     time
     
     attributes: value, min, max, required
  
   * select data
     single
     multiple
     textlist
  
     attributes: options[], placeholder (textlist only)
  */
  
  let irray = [];
  for (let key in data) {
    let i = { category:null };
    switch(data[key].type) {
      // character data
      case undefined:
      case 'text':
        i.type = 'text';
        i.category = 'character'; break;
      case 'secret':
        i.type = 'password';
        i.category = 'character'; break;
      case 'hidden':
        i.type = 'hidden';
        i.category = 'character'; break;
      // numeric data
      case 'number':
        i.type = 'number';
        i.category = 'numeric'; break;
        break;
      // time data
      case 'month':
        i.type = 'month';
        i.category = 'time'; break;
      case 'week':
        i.type = 'week';
        i.category = 'time'; break;
      case 'date':
        i.type = 'date';
        i.category = 'time'; break;
      case 'time':
        i.type = 'time';
        i.category = 'time'; break;
        break;
      case 'single':
        i.type = 'single';
        i.required = data[key].required ? 'required' : '';
        i.open = `
            <label for="${key}">${key}</label>
            <select name="${key}"  ${i.required}>`;
        i.close = `</select>`;
        i.category = 'select'; break;
      case 'multiple':
        i.type = 'multiple';
        i.required = data[key].required ? 'required' : '';
        i.open = `
            <label for="${key}">${key}</label>
            <select name="${key}"  ${i.required} multiple>`;
        i.close = `</select>`;
        i.category = 'select'; break;
      case 'textlist':
        i.type = 'textlist';
        i.required = data[key].required ? 'required' : '';
        i.open = `
            <label for="${key}">${key}</label>
            <input name="${key}" list="${key}-datalist" ${i.required}></input>
            <datalist id="${key}-datalist">`;
        i.close = `</datalist>`;
        i.category = 'select'; break;
      default:
    }
    
    switch(i.category) {
      case 'character':
        i.min = data[key].min ? 'minlength="' + data[key].min + '"' : '';
        i.max = data[key].max ? 'maxlength="' + data[key].max + '"' : '';
        i.placeholder = data[key].placeholder ? 'placeholder="' + data[key].placeholder + '"' : '';
        i.pattern = data[key].pattern ? 'pattern="' + data[key].pattern + '" title="' + data[key].pattern + '"' : '';
        i.value = data[key].value ? 'value="' + data[key].value + '"' : '';
        i.required = data[key].required ? 'required' : '';
        if (i.type === "hidden") {
          irray.push(`<input id="${key}" name="${key}" type="${i.type}" ${i.min} ${i.max} ${i.pattern} ${i.placeholder} ${i.value} ${i.required}></input>`); break;
        }
        irray.push(`
            <label for="${key}">${key}</label>
            <input id="${key}" name="${key}" type="${i.type}" ${i.min} ${i.max} ${i.pattern} ${i.placeholder} ${i.value} ${i.required}></input>
        `); break;
      case 'numeric':
        i.min = data[key].min ? 'min="' + data[key].min + '"' : '';
        i.max = data[key].max ? 'max="' + data[key].max + '"' : '';
        i.placeholder = data[key].placeholder ? 'placeholder="' + data[key].placeholder + '"' : '';
        i.value = data[key].value ? 'value="' + data[key].value + '"' : '';
        i.required = data[key].required ? 'required' : '';
        irray.push(`
            <label for="${key}">${key}</label>
            <input name="${key}" type="${i.type}" ${i.min} ${i.max} ${i.placeholder} ${i.value} ${i.required}></input>
        `); break;
      case 'time':
        i.min = data[key].min ? 'min="' + data[key].min + '"' : '';
        i.max = data[key].max ? 'max="' + data[key].max + '"' : '';
        i.value = data[key].value ? 'value="' + data[key].value + '"' : '';
        i.required = data[key].required ? 'required' : '';
        irray.push(`
            <label for="${key}">${key}</label>
            <input name="${key}" type="${i.type}" ${i.min} ${i.max} ${i.value} ${i.required}></input>
        `); break;      
      case 'select':
        irray.push(i.open);
        i.options = data[key].options ? data[key].options : [];
        for (option of i.options) {
          irray.push(`<option>${option}</option>`);
        }
        irray.push(i.close);
        break;
      default:
        irray.push(`
          <label for="${key}">${key}</label>
          <input name="${key}" type="text" placeholder="Invalid type in config file: ${data[key].type}" style="border: 2px solid red;" disabled></input>
        `);
    }
  }
  
  let form = `
    <form id="crud-form" onsubmit="return CRUD.submitForm(this);">
      ${irray.join('')}
      <div class="height-20"></div>
      <hr>
      <div class="height-20"></div>
      <button type="submit" style="background-color:aquamarine" onclick="this.clicked=true;" value="create"><i class="far fa-plus-square"></i> Create</button>
    </form>
  `;
  
  response.render('template',{
    form: form
  });
};