const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.



exports.handler = async (event) => {
  const client = new Client();
  await client.connect();

  const trans_types = 'select * from transaction_types';
  const templates = 'select s.template_id,s.transaction_type_id,t."name" as template_name from templates_settings s join templates t on t.id=s.template_id order by s.template_id,s.transaction_type_id';
  // callback
  var response;
  try {
    const transTypesRes = await client.query(trans_types);
    const templatesRes = await client.query(templates);
    response = sendRes(200, {
      transTypes: transTypesRes.rows,
      templates: templatesRes.rows.reduce((result, item) => {
        if (!result[item.template_id]) {
          result[item.template_id] = {name:item.template_name,trans_type_ids:[]};
        }        
        result[item.template_id].trans_type_ids.push(item.transaction_type_id);
        return result;
      }, {})
    });

  } catch (e) {
    console.log('error getting transaction_types ', e);
    response = sendRes(500, 'error has occured');
  }

  await client.end();


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