const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  
  if (!(data && data.firstName && data.lastName && data.isGuest !== undefined && data.isActive !== undefined)) {
    console.log('not all details were sent, data:', data);
    return sendRes(400, { error: 'not all details were sent' });
  }

  const client = new Client();
  await client.connect();

  const text = 'INSERT INTO users (first_name,last_name,email,is_guest,is_active) VALUES($1, $2, $3, $4, $5) RETURNING id'
  const values = [data.firstName, data.lastName, data.email, data.isGuest,isActive];
  // callback
  var response;
  try {
    const res = await client.query(text, values);
    response = sendRes(201, res.rows[0]);

  } catch (e) {
    console.log(`adding user failed with data ${data}, error: `,e);
    response = sendRes(500, e.detail);
  }

  await client.end();


  return response;
};

const sendRes = (status, body) => {
  var response = {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
  return response;
}