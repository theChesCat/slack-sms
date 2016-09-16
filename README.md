# Slack-sms
A trivial Slack integration to send sms using Twillio. The server is listening for a Slack slash command webhook and responding with a Slack payload.


### What's in
* An [ExpressJS](https://expressjs.com/) server
* A [daemon](https://www.npmjs.com/package/start-stop-daemon) to let the server run forever


### What's not in
Slack or Twilio API keys :)


### How do I get set up?
1/ [Set up a slash command](https://api.slack.com/slash-commands) in slack.

2/ Run a web service somewhere. If you just want to test Beerfinder on a local environment, I highly recommand you [localtunnel](https://localtunnel.github.io/www/)

3/ Clone this repository, and run `$ npm install`.

4/ Create a config.js file (there's a config.sample.js) and fill it with your API credentials.

5/ run `$ node main.js` to test the server, or `$ node main.js start` to start it with the daemon. To stop the daemon, just run `$ node main.js stop`.


The slash command in action should look like this :
![screenshot](https://raw.githubusercontent.com/theChesCat/slack-sms/master/screenshot.png)
