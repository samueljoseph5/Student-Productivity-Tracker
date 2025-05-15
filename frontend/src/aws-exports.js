import { Auth } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_UD5uIpvaj', // Will be replaced after terraform apply
    userPoolWebClientId: '1trgsta70got39pvbks5npr0l8', // Will be replaced after terraform apply
    mandatorySignIn: true,
  },
  API: {
    endpoints: [
      {
        name: 'studentTrackerApi',
        endpoint: 'https://jj0bg7h2ij.execute-api.us-east-1.amazonaws.com/dev', // Will be replaced after terraform apply
        region: 'us-east-1',
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
          }
        }
      }
    ]
  }
};

export default awsConfig; 