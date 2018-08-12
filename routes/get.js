// read front & back end, update/delete - front end
exports.route = function(request,response) {
  const domain = request.path.split('/')[1];
  const data = request.app.get(domain);
  const field = request.params.field;
  const value = request.params.value;
  const db = request.app.get('_db');
  
  if (value === '*') {
    try {
      let projection = {_id:1};
      projection[field] = 1;
      db.collection(domain).find({},projection).toArray((error, result) => {
        if (result.length < 1) {
          response.render('template',{
            form: '<input id="crud-none" type="text" value="No Results Found" readonly></input>'
          });
          return;
        }
        
        let links = [];
        links.push(`<h2>Search Of: ${domain}/${field}</h2><ul>`);
        for (let doc of result) {
          let fvalue = doc[field];
          links.push(`<li><a href="/${domain}/_id/${doc._id}" target="_blank" title="${doc._id}">${fvalue}</a></li>`);
        };
        links.push('</ul>');
        
        response.render('template',{
          form: links.join('')
        });
      });
    } catch(error) {
      response.status(500);
      response.end(JSON.stringify({
        data:{},
        error:String(error)
      }));
      return;
    }
  }
  
  try {
    let query = {};
    query[field] = value;
    db.collection(domain).findOne(query,(error, result) => {
      if (error) {
        response.status(500);
        response.end(JSON.stringify({
          data:{},
          error:String(error)
        }));
      } else {
        
        /* no result, search for like instead */
        if (result === null) {
          let queryMany = {};
          
          try {
            queryMany[field] = new RegExp('.*' + value + '.*', 'i');
          } catch(error) {
            // the user entered something invalid, like just an asterisk
            response.status(400);
            response.end(JSON.stringify({
              data:{},
              error:String(error)
            }));
            return;
          }
          
          let projection = {_id:1};
          projection[field] = 1;
          db.collection(domain).find(queryMany,projection).toArray((error, result) => {
            
            if (result.length < 1) {
              response.render('template',{
                form: '<input id="crud-none" type="text" value="No Results Found" readonly></input>'
              });
              return;
            }
            
            let links = [];
            links.push(`<h2>Search Of: ${domain}/${field}</h2><ul>`);
            for (let doc of result) {
              let fvalue = doc[field];
              links.push(`<li><a href="/${domain}/_id/${doc._id}" target="_blank" title="${doc._id}">${fvalue}</a></li>`);
            };
            links.push('</ul>');
            
            response.render('template',{
              form: links.join('')
            });
          });
        } else {
          /* create edit form from single result */
          let irray = [];
          
          let idvalue = result['_id'];
          irray.push(`
              <label for="crud-_id">_id</label>
              <input id="crud-_id" name="_id" type="text" value="${idvalue}" readonly required></input>
          `);
          
          for (let key in result) {
            
            let i = { category:null };
            
            if (key === '_id') {
              continue;
            }
            
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
                i.value = 'value="' + result[key] + '"';
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
                i.value = 'value="' + result[key] + '"';
                i.required = data[key].required ? 'required' : '';
                irray.push(`
                    <label for="${key}">${key}</label>
                    <input name="${key}" type="${i.type}" ${i.min} ${i.max} ${i.placeholder} ${i.value} ${i.required}></input>
                `); break;
              case 'time':
                i.min = data[key].min ? 'min="' + data[key].min + '"' : '';
                i.max = data[key].max ? 'max="' + data[key].max + '"' : '';
                i.value = 'value="' + result[key] + '"';
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
              <button type="submit" style="background-color:aqua" onclick="this.clicked=true;" value="edit"><i class="far fa-edit"></i> Edit</button>
              <div class="height-20"></div>
              <hr>
              <div class="height-20"></div>
              <button type="submit" style="background-color:red;color:white" onclick="this.clicked=true;" value="delete"><i class="far fa-trash-alt"></i> Delete</button>
            </form>
          `;
          
          response.render('template',{
            form: form
          });
        }
      }
    });
  } catch(error) {
    response.status(500);
    response.end(JSON.stringify({
      data:{},
      error:String(error)
    }));
  }
};