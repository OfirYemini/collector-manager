const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    const id = event.pathParameters.id;
    if (!(event && event.pathParameters && event.pathParameters.id)) {
        return sendRes(400, { error: 'no user id' });
    }
    if (!(data && data.firstName && data.lastName && data.email && data.isGuest !== undefined)) {
        console.log('not all details were sent, data:',data);
        return sendRes(400, { error: 'not all details were sent' });
    }
    
    try{
        const client = new Client();  
        await client.connect();
    
        const text = 'Update users SET first_name= $1, last_name=$2, email=$3, is_guest=$4 where id=$5';
        const values = [data.firstName,data.lastName,data.email,data.isGuest,id];
        // callback
        
        const res = await client.query(text, values);
       
        await client.end();
        return sendRes(res.rowCount == 1? 204:404,null);
    } catch(e) {
        console.log(`error on updating user ${id} with details ${data}`,e);
        return sendRes(500,{error:e.details});
    }
};

const sendRes = (status, body) => {
    var response = {
      statusCode: status,
      headers: {        
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }      
    };
    if(body!==null) {
        response.headers["Content-Type"] = "application/json";
        response.body = JSON.stringify(body);
    }
    return response;
  }