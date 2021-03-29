var aws = require('aws-sdk');
var ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {
    let date = new Date();

    if(event.request.userAttributes.sub) {
        let params = {
            Item: {
                'id' : {S: event.request.userAttributes.sub},
                '__typename' : {S: 'User'},
                'username' : {S: event.userName},
                'email' : {S: event.request.userAttributes.email},
                'createdAt' : {S: date.toISOString()},
                'updatedAt' : {S: date.toISOString()},
            },
            TableName: 'User-zrlwnyr7pvg4hjb5okhp3i6uru-dev'
        };
        try{
            await ddb.putItem(params).promise();
            console.log("Sucess");
        } catch(err) {
            console.log("Error", err);
        }
        context.callback(null, event);
    } else {
        console.log("Error: Nothing was written to DynamoDB");
        context.callback(null, event);
    }
};