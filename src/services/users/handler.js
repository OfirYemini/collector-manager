'use strict';

// const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// module.exports.get = (event, context, callback) => {
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       id: event.pathParameters.id,
//     },
//   };

//   // fetch todo from the database
//   dynamoDb.get(params, (error, result) => {
//     // handle potential errors
//     if (error) {
//       console.error(error);
//       callback(null, {
//         statusCode: error.statusCode || 501,
//         headers: { 'Content-Type': 'text/plain' },
//         body: 'Couldn\'t fetch the todo item.',
//       });
//       return;
//     }

//     // create a response
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify(result.Item),
//     };
//     callback(null, response);
//   });
// };
module.exports.create = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your create function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
}

module.exports.list = async event => {

  const { Client } = require('pg');  //  Needs the nodePostgres Lambda Layer.
  const client = new Client();
  await client.connect();

  const res = await client.query(`select * from users;`);
    await client.end();  

    const response = {
        statusCode: 200,
        body: JSON.stringify(res.rows),
    };
    return response;
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your list function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };
}


module.exports.getById = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your getById function executed successfully!!!',
        input: event,
      },
      null,
      2
    ),
  };
}

module.exports.delete = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your delete function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
}

module.exports.update = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your update function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
}


//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };


