const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.


    
exports.handler = async (event) => {
    
    const id = event.pathParameters.id;
    
    const client = new Client();  
    await client.connect();
    
    const text = 'select * from users where id=$1'
    
    // callback
    var response;
    try {
        const res = await client.query(text, [id]);
        response = sendRes(200,{
            id: res.rows[0].id,
            firstName: res.rows[0].first_name,
            lastName: res.rows[0].last_name,            
            email:res.rows[0].email,
            isGuest:res.rows[0].is_guest,
            isActive:res.rows[0].in_activity_date ==null
            
        });
        
    } catch (e) {
        response = sendRes(404,'user not found');
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  return response;
}