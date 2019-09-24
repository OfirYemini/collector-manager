const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {

  if (!(event && event.queryStringParameters && event.queryStringParameters.from && event.queryStringParameters.to)) {
    return sendRes(400, { error: 'no dates variables' });
  }

  const from = new Date(parseInt(event.queryStringParameters.from));
  const to = new Date(parseInt(event.queryStringParameters.to));

  const client = new Client();
  await client.connect();

  var response;
  try {
    const data = await client.query('select * from get_transactions_reports($1,$2)', [from, to]);
    await client.end();
    var res = {};
    const transactions = new Map();
    data.rows.forEach(function (row) {
      var currentUser = res.filter(r=>r.userId==row.user_id);
      currentUser = currentUser.length == 1 ? currentUser[0] : {
        userId:row.user_id,
        transactions:[],l
      }
      const collection = map.get(r.user_id);
      if (!collection) {
          map.set(key, [item]);
      } else {
          collection.push(item);
      }
    });
    response = sendRes(200, res);
  }
  catch (e) {
    console.log('get reports failed ', e);
    response = sendRes(500, { error: e.error });
  }
  return response;
};


const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
  return response;
}

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}