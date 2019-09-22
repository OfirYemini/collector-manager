const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.


    
exports.handler = async (event) => {
    
    const id = event.pathParameters.id;
    
    const client = new Client();  
    await client.connect();
    
    const text = 'select * from transactions where id=$1'
    
    // callback
    var response;
    try {
        const res = await client.query(text, [id]);
        response = sendRes(200,res.rows[0]);
        
    } catch (e) {
        response = sendRes(404,'transaction not found');
    }
    
    await client.end();  

    
    return response;
};



const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  return response;
}