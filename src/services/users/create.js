const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    
    // TODO implement
    
    const client = new Client();  
    await client.connect();

    const text = 'INSERT INTO users (first_name,last_name,email) VALUES($1, $2, $3) RETURNING id'
    const values = [data.first_name,data.last_name,data.email];
    // callback
    var response;
    try {
        const res = await client.query(text, values);
        response = sendRes(201,res.rows[0]);
        
    } catch (e) {
      
        response = sendRes(500,e.detail);
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