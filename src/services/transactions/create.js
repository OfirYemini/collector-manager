const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
const format = require('pg-format');
exports.handler = async (event) => {
    const data = JSON.parse(event.body);
    
    // var format = require('pg-format');

    // var values = [
    //     [ 1, 'jack' ],
    //     [ 2, 'john' ],
    //     [ 3, 'jill' ],
    // ];
    // console.log(format('INSERT INTO test_table (id, name) VALUES %L', values));
    // // INSERT INTO test_table (id, name) VALUES ('1', 'jack'), ('2', 'john'), ('3', 'jill')
//console.log(format('INSERT INTO test_table (id, name) VALUES %L', values));

    const client = new Client();  
    await client.connect();

    
    
    // callback
    var response;
    try {
        let values = [];
        data.forEach(function(v){ 
          //values.push(Object.values(v));
          values.push([v.userId,v.typeId,v.amount,v.date]);
        }); 
        const text = format('INSERT INTO transactions (user_id,type_id,amount,exec_date) VALUES %L returning id',values);
        console.log(text);
        const res = await client.query(text);
        response = sendRes(201,res.rows,"application/json");
        
    } catch (e) {
        console.log('create transactions failed ',e);
        response = sendRes(500,e.detail,"text/plain");
    }
    
    await client.end();  

    
    return response;
};

const sendRes = (status, body,contentType) => {
  var response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      "Content-Type": contentType
    },
    body: JSON.stringify(body)
  };
  return response;
}