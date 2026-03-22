import { cognitoConfig } from './cognitoConfig';

const region = cognitoConfig.UserPoolId.split('_')[0];
const endpoint = `https://cognito-idp.${region}.amazonaws.com/`;

async function cognitoRequest(target, body) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok || data.__type || data.message) {
    const errorMessage = data.message || data.__type || 'Cognito request failed';
    throw new Error(errorMessage);
  }

  return data;
}

export async function registerUser(email, password) {
  return cognitoRequest('SignUp', {
    ClientId: cognitoConfig.ClientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ]
  });
}

export async function loginUser(email, password) {
  try {
    return await cognitoRequest('InitiateAuth', {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: cognitoConfig.ClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });
  } catch (error) {
    const message = error?.message || '';
    const passwordAuthDisabled =
      message.includes('USER_PASSWORD_AUTH flow not enabled') ||
      message.includes('InvalidParameterException');

    if (!passwordAuthDisabled) {
      throw error;
    }

    return loginUserWithSrp(email, password);
  }
}

async function loginUserWithSrp(email, password) {
  const cognitoModule = await import('amazon-cognito-identity-js');
  const sdk = cognitoModule.default || cognitoModule;

  const { CognitoUser, AuthenticationDetails, CognitoUserPool } = sdk;

  if (!CognitoUser || !AuthenticationDetails || !CognitoUserPool) {
    throw new Error('Could not initialize Cognito SRP authentication.');
  }

  const userPool = new CognitoUserPool(cognitoConfig);

  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve({
          AuthenticationResult: {
            IdToken: session.getIdToken().getJwtToken(),
            AccessToken: session.getAccessToken().getJwtToken(),
            RefreshToken: session.getRefreshToken().getToken()
          }
        });
      },
      onFailure: (authError) => {
        reject(authError instanceof Error ? authError : new Error(authError?.message || 'Login failed.'));
      }
    });
  });
}

export async function confirmUser(email, code) {
  return cognitoRequest('ConfirmSignUp', {
    ClientId: cognitoConfig.ClientId,
    Username: email,
    ConfirmationCode: code
  });
}

export async function resendConfirmationCode(email) {
  return cognitoRequest('ResendConfirmationCode', {
    ClientId: cognitoConfig.ClientId,
    Username: email
  });
}
