const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    
    // TODO implement
    
    const client = new Client();  
    await client.connect();

    const text = 'Update users SET first_name= $1, last_name=$2, email=$3 where id=$4';
    const values = [data.first_name,data.last_name,data.email,data.id];
    // callback
    
    const res = await client.query(text, values);
   
    await client.end();  

    const response = {
        statusCode: 204
    };
    return response;
};
