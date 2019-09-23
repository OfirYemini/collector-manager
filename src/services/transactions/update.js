const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    const id = event.pathParameters.id;
    
    // TODO implement
    
    const client = new Client();  
    await client.connect();

    const text = 'Update transactions SET user_id= $1, type_id=$2, amount=$3, exec_date=$4 where id=$5';
    const values = [data.userId,data.transactionTypeId,data.amount,data.date,id];
    // callback
    
    const res = await client.query(text, values);
   
    await client.end();  

    const response = {
        statusCode: res.rowCount == 1? 204:404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body:JSON.stringify({})
    };
    return response;
};
