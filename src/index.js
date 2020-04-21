import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify from 'aws-amplify';

import Config from "./Components/Config";
import App from './Components/App';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: Config.cognito.REGION,
    userPoolId: Config.cognito.USER_POOL_ID,
    identityPoolId: Config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: Config.cognito.APP_CLIENT_ID
  },
  API: {
   endpoints: [
     {
       name: Config.apiGateway.Recipes.NAME,
       endpoint: Config.apiGateway.Recipes.URL,
       region: Config.apiGateway.Recipes.REGION,
     },
     {
       name: Config.apiGateway.Menu.NAME,
       endpoint: Config.apiGateway.Menu.URL,
       region: Config.apiGateway.Menu.REGION
     }
   ]
 },
 Storage: {
   region: Config.s3.REGION,
   bucket: Config.s3.BUCKET,
   identityPoolId: Config.cognito.IDENTITY_POOL_ID
 }
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
