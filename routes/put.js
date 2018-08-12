// create - back end
exports.route = function(request,response) {
  const domain = request.path.split('/')[1];
  const db = request.app.get('_db');
  
  let result;
  try {
    if (typeof request.body.data._id === 'undefined') {
      request.body.data._id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    result = db.collection(domain).insertOne(request.body.data,(error,result) => {
      if (error) {
        response.status(500);
        response.end(JSON.stringify({
          data:{},
          error:String(error)
        }));
      } else {
        response.end(JSON.stringify({
          data:{
            _id: result.ops[0]._id
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