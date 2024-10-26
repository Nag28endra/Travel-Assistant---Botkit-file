// botkit initialization
var config         = require('./config.json');
var botId          = config.credentials.botId;
var botName        = config.credentials.botName;
// response- is an object in Express Library that is used to handle response in Node.js application.
const { response } = require("express");
// importing kore ai's SDK
var sdk = require("./lib/sdk");
//request - makes HTTP request to interact with Kore ai API
var request = require('request');

/*
 * This is the most basic example of BotKit.
 *
 * It showcases how the BotKit can intercept the message being sent to the bot or the user.
 *
 * We can either update the message, or chose to call one of 'sendBotMessage' or 'sendUserMessage'
 */

// module.exports - exports an object that represents bot's configuration and behavior.
module.exports = {
    botId   : botId,
    botName : botName,

    // a callback function that triggers when user sends a message.
       on_user_message : function(requestId, data, callback) {
         /*
        requestID - contains ID for tracking the request
        data - contains user message along with meta information about the message
        callback - a function that is invoked when the message is sent to bot.
        */
        console.log("@on user Message-meta info:",data.metaInfo);
        console.log("@on user Message-actual message:",data.message);
        
        if(!data.agent_transfer){
            //Forward the message to bot
            return sdk.sendBotMessage(data, callback);
        } else {
            data.message = "Agent Message";
            return sdk.sendUserMessage(data, callback);
        }
    },
    // callback function that triggers when bot sends message to user.
    on_bot_message  : function(requestId, data, callback) {
        // console.log("@on bot Message",data.metaInfo);
        console.log("@on bot Message",data);
        if (data.message === 'hello') {
            data.message = 'The Bot says hello!';
        }
        //Sends back the message to user
        
        return sdk.sendUserMessage(data, callback);
    },
    on_agent_transfer : function(requestId, data, callback){
        return callback(null, data);
    },
    on_event : function (requestId, data, callback) {
        console.log("on_event -->  Event : ", data.event);
        return callback(null, data);
    },
    on_alert : function (requestId, data, callback) {
        console.log("on_alert -->  : ", data, data.message);
        return sdk.sendAlertMessage(data, callback);
    }

};

