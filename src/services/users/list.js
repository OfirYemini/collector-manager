const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    
    const client = new Client();  
    await client.connect();
    const res = await client.query(`select * from users;`);
    await client.end();  

    const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows),
    };
    return response;
};
