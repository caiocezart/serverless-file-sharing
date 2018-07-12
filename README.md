# serverless-file-sharing
Full serverlerss application to upload and temporary share files. Being serverless, there is no upcoming costs with AWS, it is all based on usage of the following AWS services: Lambda / DynamoDB / Cognito / API Gateway / S3.

# Flow
- Administrator login, upload files and get a single link per file with 24hours expiry date.
- Admin shares the url to users and they can download the file until the date is valid.
- Admin can always edit the file and renew the expiration date.

# What is next?
- Pagination / search / sort
- Flexibility on expiration date

# Technologies
- Serverless Framework
- React
- NodeJS
- AWS Lambda
- AWS DynamoDB
- AWS API Gateway
- AWS S3
- AWS Cognito

# Instructions

## Backend
Install Serverless Framework globally

`npm install serverless -g`

Go to the backend folder

`cd backend/`

Give a name to the project editing the field `service` on the file `serverless.yaml`

Deploy the backend

`serverless deploy -v`

## Frontend
Go to the frontend folder

`cd frontend`

Install dependencies

`npm install`

Edit configurations file replacing the values with the ones created by the deploy script

`frontend/src/config.js`

Build the project

`npm run-script build`

Copy build files to s3 hosting bucket

`aws s3 sync build s3://<your-hosting-bucket>`

Go to Cognito console and create a new user or use the following commands to create and confirm one

- create username
```
aws cognito-idp sign-up \
  --region <YOUR_REGION> \
  --client-id <COGNITO_CLIENT_ID> \
  --username <EMAIL@EMAIL.COM> \
  --password <PASSWORD>`
```

- confirm password 
```
aws cognito-idp admin-confirm-sign-up \
  --region <YOUR_REGION> \
  --user-pool-id <COGNITO_CLIENT_ID>> \
  --username <PASSWORD> 
```

Access the application

`http://<HOSTING_BUCKET_NAME>.s3-website-<REGION>.amazonaws.com/`
