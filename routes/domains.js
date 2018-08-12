// landing page, show domains "collections"
exports.route = function(request,response) {
  const host = request.get('host');
  const domains = request.app.get('domains');
  
  let links = [];
  links.push(`<h2>Welcome To RESTful CRUD!</h2>
    <p>Select A Domain Below To Start Creating Records.</p>
    <p>To Search For Records, Go To: ${host}/<b style="color:red">DOMAIN</b>/<b style="color:blue">FIELD</b>/<b style="color:green">VALUE</b>.<br><b style="color:green">VALUE</b> can be a regex expression or use an asterisk * to get all records.</p>
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