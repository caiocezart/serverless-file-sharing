import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import { S3 } from 'aws-sdk';

export async function main(event, context, callback) {
    console.log(event.pathParameters.id);
    const data = JSON.parse(event.body);


    const params = {
        TableName: process.env.tableName,
        // TableName: 'dev-file-sharing-table',
        Key: {
            fileId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        const diffDataMilliseconds = result.Item.passwordExpiryDate - new Date().getTime();

        // if still valid
        if (diffDataMilliseconds <= 0) {
            callback(null, success({ status: false, message: 'File expired.' }));
        }
        else {
            if (result.Item.password !== data.password) {
                callback(null, success({ status: false, message: 'Wrong password or File ID.' }));
            }
            else {
                const s3 = new S3({ region: 'ap-southeast-2', signatureVersion: 'v4' });

                const signedUrl = await s3.getSignedUrl('getObject', {
                    Bucket: process.env.bucketName,
                    Key: 'public/' + result.Item.attachment,
                    Expires: 5 * 60 // 5minutes
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
                        callback(null, success({ status: true, message: result.Attributes }));
                    } catch (e) {
                        console.log(e);
                        callback(null, failure({ status: false, message: e }));
                    }
                }
            }
        }
    } catch (e) {
        console.log(e)
        callback(null, failure({ status: false, message: e }));
    }
}