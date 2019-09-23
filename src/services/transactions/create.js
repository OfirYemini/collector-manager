const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    
    // TODO implement
    
    const client = new Client();  
    await client.connect();

    const text = 'INSERT INTO transactions (user_id,type_id,amount,exec_date) VALUES($1, $2, $3, $4) RETURNING id'
    const values = [data.userId,data.transactionTypeId,data.amount,data.date];
    // callback
    var response;
    try {
        const res = await client.query(text, values);
        response = sendRes(201,res.rows[0],"application/json");
        
    } catch (e) {
        console.log('create transactions failed ',e);
        response = sendRes(500,e.detail,"text/plain");
    }
    
    await client.end();  

    
    return response;
};

const sendRes = (status, body,contentType) => {
  var response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      "Content-Type": contentType
    },
    body: JSON.stringify(body)
  };
  return response;
}