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
        response = sendRes(200,{
          id:res.rows[0].id,
          userId:res.rows[0].user_id,
          typeId: res.rows[0].type_id,
          comment: res.rows[0].comment,
          amount: res.rows[0].amount,
          date: res.rows[0].exec_date
      });
        
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
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
  return response;
}