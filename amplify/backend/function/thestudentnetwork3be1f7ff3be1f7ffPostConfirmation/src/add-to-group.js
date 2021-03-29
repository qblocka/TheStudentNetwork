/* eslint-disable-line */ const aws = require('aws-sdk');

exports.handler = async (event, context) => {
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
  const groupParams = {
    GroupName: 'students',
    UserPoolId: event.userPoolId,
  };

  const addUserParams = {
    GroupName: 'students',
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }

  try {
    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
    context.callback(null, event);
  } catch (error) {
    context.callback(null, event);
  }
};
//test