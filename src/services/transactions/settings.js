const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.


    
exports.handler = async (event) => {
    const client = new Client();  
    await client.connect();
    
    const text = 'select * from transaction_types'
    
    // callback
    var response;
    try {
        const res = await client.query(text);
        response = sendRes(200,res.rows);
        
    } catch (e) {
        console.log('error getting transaction_types ',e);
        response = sendRes(500,'error has occured');
    }
    
    await client.end();  

    
    return response;
};



const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
  return response;
}