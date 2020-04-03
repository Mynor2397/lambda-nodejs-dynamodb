'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const experience = requestBody.experience;

  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof experience !== 'number') {
    callback(new Error('Revise su data'));
    return;
  }

  submitCandidateP(candidateInfo(fullname, email, experience))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Creado satisfactoriamente, email ${email}`,
          candidateId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `No se puede crear el registro con email ${email}`
        })
      })
    });
};


const submitCandidateP = candidate => {
  const candidateInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: candidate,
  };
  return dynamoDb.put(candidateInfo).promise()
    .then(res => candidate);
};

const candidateInfo = (fullname, email, experience) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    experience: experience,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};


module.exports.list = (event, context, callback) => {
  var params = {
    TableName: process.env.CANDIDATE_TABLE,
    ProjectionExpression: "id, fullname, email"
  };

  const onScan = (err, data) => {
    if (err) {
      callback(err);
    } else {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          candidates: data.Items
        })
      });
    }

  };

  dynamoDb.scan(params, onScan);

};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('No se puede obtenere el registro'));
      return;
    });
};


module.exports.updateCandidate = (event, context, callback) => {
  const data = JSON.parse(event.body);
  data.id = event.pathParameters.id;

  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: data
  }

  dynamoDb.put(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({message:"Registro actualizado exitosamente!!"}),
      };
      callback(null, response);
    })
    .catch(error => {
      callback(error, params.Item);
      return;
    })

}

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  dynamoDb.delete(params).promise()
  .then(result => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({message:"Registro borrado exitosamente!!"}),
    };
    callback(null, response);
  })
  .catch(error => {
    callback(error, params.Key.id);
    return;
  })

}