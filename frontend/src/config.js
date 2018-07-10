const dev = {
  s3: {
    REGION: "",
    ATTACHMENTS_BUCKET: ""
  },
  apiGateway: {
    REGION: "",
    URL: ""
  },
  cognito: {
    REGION: "",
    USER_POOL_ID: "",
    APP_CLIENT_ID: "",
    IDENTITY_POOL_ID: ""
  }
};

const prod = {
  s3: {
    REGION: "",
    ATTACHMENTS_BUCKET: ""
  },
  apiGateway: {
    REGION: "",
    URL: ""
  },
  cognito: {
    REGION: "",
    USER_POOL_ID: "",
    APP_CLIENT_ID: "",
    IDENTITY_POOL_ID: ""
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};