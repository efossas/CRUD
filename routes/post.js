// update - back end
exports.route = function(request,response) {
  const domain = request.path.split('/')[1];
  const db = request.app.get('_db');
  
  let result;
  try {
    result = db.collection(domain).updateOne({_id: request.body.data._id}, {$set: request.body.data},(error,result) => {
      if (error) {
        response.status(500);
        response.end(JSON.stringify({
          data:{},
          error:String(error)
        }));
      } else {
        response.end(JSON.stringify({
          data:{
            _id: request.body.data._id
          },
          error:null
        }));
      }
    });
  } catch (error) {
    response.status(500);
    response.end(JSON.stringify({
      data:{},
      error:String(error)
    }));
  };
};