const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.


    
exports.handler = async (event) => {
    
    const id = event.pathParameters.id;
    
    const client = new Client();  
    await client.connect();
        
    const text = 'Update users SET is_active=false where id=$1';
    // callback
    var response;
    try {
        const res = await client.query(text, [id]);
        response = sendRes(204,{});
        
    } catch (e) {
        console.log(`error deleting user ${id}`,e)
        response = sendRes(404,{error:e.details});
    }
    
    await client.end();  

    
    return response;
};



const sendRes = (status, body) => {
  var response = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    statusCode: status,    
    body:JSON.stringify(body)
  };
  return response;
}