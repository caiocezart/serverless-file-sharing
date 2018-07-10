import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

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
    UpdateExpression: "SET passwordExpiryDate = :passwordExpiryDate",
    ExpressionAttributeValues: {
      ":passwordExpiryDate": newExpiryDate.getTime()
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