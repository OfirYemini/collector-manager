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
    var res = [];
    
    data.rows.forEach(function (row) {
      var currentUser = res.find(o => o.userId === row.user_id);
      
      if(currentUser === undefined){
        currentUser = {
          userId:row.user_id,
          transactions:[],
        };
        res.push(currentUser);
      }      
      console.log('currentUser ', currentUser);
      if(row.type_name==='closingBalance'){
        currentUser.closingBalance = row.amount;
      } else{
        currentUser.transactions.push({
          typeName:row.type_name,
          amount:row.amount,
          date:row.exec_date,
          hebrewDate:row.hebrewDate
        });
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



// --drop function get_transactions_reports
// create or replace function get_transactions_reports(fromDate date, toDate date) 
// returns TABLE(user_id int2, type_name varchar(20), exec_date date,amount numeric(10,2))AS
// $$
// BEGIN
// DROP TABLE IF EXISTS user_balances;
// CREATE TEMP TABLE user_balances AS
// select 
// 	t.user_id,
// 	'העברת יתרה'::varchar(20) as type_name,
// 	fromDate as exec_date,
// 	sum(t.amount) as amount
// from transactions t where t.exec_date < fromDate group by t.user_id;

// DROP TABLE IF EXISTS user_transactions;
// CREATE TEMP TABLE user_transactions AS
// select 
// t.user_id,
// tt."name" as type_name,
// t.exec_date,
// t.amount
// from transactions t 
// join transaction_types tt 
// on tt.id=t.type_id 
// where t.exec_date>=fromDate and t.exec_date < toDate;

// RETURN QUERY SELECT b.user_id,b.type_name,b.exec_date,b.amount
// from user_balances b 
// union 
// select t.user_id,t.type_name,t.exec_date,t.amount from user_transactions t
// union 
// (select totals.user_id,
// 	'יתרה'::varchar(20) as type_name,
// 	toDate as exec_date,
// 	sum(totals.amount) as amount from (select ub.user_id,ub.amount from user_balances ub union SELECT uti.user_id,uti.amount from user_transactions uti) as totals
// 	group by totals.user_id)
// order by user_id,exec_date asc;

// END
// $$
// language 'plpgsql';

// select * from get_transactions_reports('2019-03-18', '2019-10-13')