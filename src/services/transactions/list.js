const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {

    if (!(event && event.queryStringParameters)) {
        return sendRes(400,{error:'no qs parameters'},{});        
    }
    let values = [];
    let text;
    if(event.queryStringParameters.from && event.queryStringParameters.to){
        const from = new Date(parseInt(event.queryStringParameters.from));
        const to = new Date(parseInt(event.queryStringParameters.to));
        text = `select * from transactions where exec_date >= $1 and exec_date <= $2;`;
        values = [from,to];
    } else if(event.queryStringParameters.id){        
        text = `select * from transactions where id in (` + event.queryStringParameters.id + `)`;        
        values = [];        
    } else{
        return sendRes(400,{error:'no suitable qs variables were found'},{});
    }

    
    try{
        const client = new Client();
        await client.connect();
        const res = await client.query(text, values);
        await client.end();
        return sendRes(200, res.rows.map(function (r) {
            return {
                id: r.id,
                userId: r.user_id,
                typeId: r.type_id,
                comment: r.comment,
                amount: r.amount,
                date: r.exec_date.toLocaleDateString()
            };
        }), {});
    } catch(e){
        console.log(e);
        return sendRes(500,{error:e.details},{});
    }
    

    // const response = {
    //     statusCode: 200,
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Credentials': true
    //     },
    //     body: JSON.stringify(res.rows.map(function(r){
    //         return {
    //             id:r.id,
    //             userId:r.user_id,
    //             typeId: r.type_id,
    //             amount: r.amount,
    //             date: r.exec_date.toLocaleDateString()
    //         };            
    //     })),
    // };
    
};

const sendRes = (status, body, headers) => {
    headers = {
        ...{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }, ...headers
    }
    var response = {
        statusCode: status,
        headers: headers,
        body: JSON.stringify(body)
    };
    return response;
}
