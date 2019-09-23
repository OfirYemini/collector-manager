const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    const id = event.pathParameters.id;
    
    // TODO implement
    
    const client = new Client();  
    await client.connect();

    const text = 'Update users SET first_name= $1, last_name=$2, email=$3, is_guest=$4 where id=$5';
    const values = [data.first_name,data.last_name,data.email,data.isGuest,id];
    // callback
    
    const res = await client.query(text, values);
   
    await client.end();  

    const response = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 204,
        body:JSON.stringify({})
    };
    return response;
};
