import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { S3 } from 'aws-sdk';

export async function main(event, context, callback) {
    let params = {
        TableName: process.env.tableName,
        // TableName: 'dev-files-table',
        Key: {
            fileId: event.pathParameters.id
        }
    }

    const fileData = await dynamoDbLib.call('get', params);

    const diffDataMilliseconds = fileData.Item.passwordExpiryDate - new Date().getTime();
    const diffDataSeconds = diffDataMilliseconds / 1000;
    const diffDataMinutes = diffDataSeconds / 60;
    const diffDataHours = diffDataMinutes / 60;

    if (diffDataMilliseconds <= 0) {
        callback(null, success({ status: false, message: 'File password expired.' }));
    } else {
        const s3 = new S3({ region: 'ap-southeast-2', signatureVersion: 'v4' });

        const signedUrl = await s3.getSignedUrl('getObject', {
            Bucket: process.env.bucketName,
            Key: 'public/' + fileData.Item.attachment,
            Expires: 5 * 60 // 5 minutes
        });

        if (!signedUrl) {
            callback(null, success({ status: false, message: 'Error generating download link.' }));
        } else {
            params.UpdateExpression = "SET s3Url = :s3Url";
            params.ExpressionAttributeValues = {
                ":s3Url": signedUrl
            };
            params.ReturnValues = "ALL_NEW";

            try {
                const result = await dynamoDbLib.call("update", params);
                callback(null, success({ status: true }));
            } catch (e) {
                console.log(e);
                callback(null, failure({ status: false, message: e }));
            }
        }
    }
}