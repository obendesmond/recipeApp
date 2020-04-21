const dev = {
  cognito: {
    REGION: "eu-west-1",
    USER_POOL_ID: "eu-west-1_GAYe9tDpz",
    APP_CLIENT_ID: "1fnklins9hln18jnff8i3qimqk",
    IDENTITY_POOL_ID: "eu-west-1:889a937c-c4a9-4163-a4bb-5387b74d3ac2"
  },
  apiGateway: {
    Recipes: {
      NAME: "Food_Buddy_Recipe",
      REGION: "eu-west-1",
      URL: "https://udm04yd5tf.execute-api.eu-west-1.amazonaws.com/dev"
    },
    Menu: {
      NAME: "Food_Buddy_Menu",
      REGION: "eu-west-1",
      URL: "https://vqnxrpryz5.execute-api.eu-west-1.amazonaws.com/dev"
    }
  },
  s3: {
    REGION: 'eu-west-1',
    BUCKET: 'food-buddy-uploads-dev-s3bucket-2yb3b14neoww'
  }
};

const prod = {
  cognito: {
    REGION: "eu-west-1",
    USER_POOL_ID: "eu-west-1_J4cjuyy1P",
    APP_CLIENT_ID: "7t15tr15697c2ldsuofcmc0ccl",
    IDENTITY_POOL_ID: "eu-west-1:29460559-582f-4cfe-a3fb-133b84bead57"
  },
  apiGateway: {
    Recipes: {
      NAME: "Food_Buddy_Recipe",
      REGION: "eu-west-1",
      URL: "https://8rjm2qi36m.execute-api.eu-west-1.amazonaws.com/prod"
    },
    Menu: {
      NAME: "Food_Buddy_Menu",
      REGION: "eu-west-1",
      URL: "https://s8n8ua4leb.execute-api.eu-west-1.amazonaws.com/prod"
    }
  },
  s3: {
    REGION: 'eu-west-1',
    BUCKET: 'food-buddy-uploads-prod-s3bucket-jzo9vfnzghlh'
  }
};

const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
