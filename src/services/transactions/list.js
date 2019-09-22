const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
    
    if(!(event && event.queryStringParameters && event.queryStringParameters.from && event.queryStringParameters.to)){
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "text/plain"
              },
            body: 'no dates variables',
        };
    }
    const from = new Date(parseInt(event.queryStringParameters.from));
    const to = new Date(parseInt(event.queryStringParameters.to));
    
    const client = new Client();  
    await client.connect();
    const res = await client.query(`select * from transactions where exec_date > $1 and exec_date < $2;`,[from,to]);
    await client.end();  

    const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows.map(function(r){
            return {
                id:r.id,
                userId:r.user_id,
                typeId: r.type_id,
                amount: r.amount,
                date: r.exec_date
            };            
        })),
    };
    return response;
};
