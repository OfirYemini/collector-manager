const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    console.log('event.query ',event.query)
    if(!(event && event.queryStringParameters && event.queryStringParameters.from && event.queryStringParameters.to)){
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "text/plain"
              },
            body: 'no dates variables',
        };
    }

    const client = new Client();  
    await client.connect();
    const res = await client.query(`select * from transactions where date < $1 and date > $2;`,new Date(event.queryStringParameters.from),new Date(event.queryStringParameters.to));
    await client.end();  

    const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows),
    };
    return response;
};
