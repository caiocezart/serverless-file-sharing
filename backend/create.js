import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import AWS from "aws-sdk";

AWS.config.update({ region: "ap-southeast-2" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);

    const dateNow = new Date();
    const newExpiryDate = new Date();
    newExpiryDate.setDate(dateNow.getDate() + 1);

    const params = {
        TableName: process.env.tableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            userEmail: data.userName,
            fileId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now(),
            password: uuid.v1(),
            passwordExpiryDate: newExpiryDate.getTime()
        }
    };
    console.log('params: ' + JSON.stringify(params));

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log(e)
        callback(null, failure({ status: false, message: e }));
    }
}