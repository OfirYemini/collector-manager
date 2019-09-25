const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    
    const client = new Client();  
    await client.connect();
    const res = await client.query(`select * from users where is_active=true;`);
    await client.end();  

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(res.rows.map(function(r){
            return {
                id:r.id,
                firstName:r.first_name,
                lastName:r.last_name,
                email:r.email,
                isGuest:r.is_guest
            }
        })),
    };
    return response;
};
