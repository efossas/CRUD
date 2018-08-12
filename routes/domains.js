// landing page, show domains "collections"
exports.route = function(request,response) {
  const host = request.get('host');
  const domains = request.app.get('domains');
  
  let links = [];
  links.push(`<h2>Welcome To RESTful CRUD!</h2><p>Select A Domain Below To Start Creating Records.</p>
    <hr>
    <div class="height-20"></div>
    <ul>`);
  for (let domain of domains) {
    links.push(`<li><a href="/${domain}">${domain}</a></li>`);
  };
  links.push('</ul>');
  
  response.render('template',{
    form: links.join('')
  });
};