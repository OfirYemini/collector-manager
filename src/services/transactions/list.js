const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    if(!(event && event.query. && event.query.from && event.query.to)){
        return {
            statusCode: 400,
            body: 'no dates variables',
        };
    }

    const client = new Client();  
    await client.connect();
    const res = await client.query(`select * from transactions where date < $1 and date > $2;`,event.query.from,event.query.to);
    await client.end();  

    const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows),
    };
    return response;
};
