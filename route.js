exports.route = function(request,response) {
  const config = request.app.get(request.path);
  
  console.log(config);
  
}