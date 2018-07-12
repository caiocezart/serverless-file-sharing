import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

function makeid(chars) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < chars; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  const dateNow = new Date();
  const newExpiryDate = new Date();
  newExpiryDate.setDate(dateNow.getDate() + 1);

  const params = {
    TableName: process.env.tableName,
    // TableName: 'dev-files-table',
    Key: {
      fileId: event.pathParameters.id
    },
    UpdateExpression: "SET passwordExpiryDate = :passwordExpiryDate, password = :password",
    ExpressionAttributeValues: {
      ":passwordExpiryDate": newExpiryDate.getTime(),
      ":password": makeid(8)
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    console.log(e);
    callback(null, failure({ status: false, message: e }));
  }
}