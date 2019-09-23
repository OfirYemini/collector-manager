const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.


    
exports.handler = async (event) => {
    
    const id = event.pathParameters.id;
    
    const client = new Client();  
    await client.connect();
    
    const text = 'delete from transactions where id=$1'
    
    // callback
    var response;
    try {
        const res = await client.query(text, [id]);
        response = sendRes(204,{});
        
    } catch (e) {
        response = sendRes(404,{});
    }
    
    await client.end();  

    
    return response;
};



const sendRes = (status, body) => {
  var response = {
    statusCode: status,    
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body:JSON.stringify(body)
  };
  return response;
}