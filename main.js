const Daemon = require('start-stop-daemon')
const Express = require('express')
const Promise = require('promise')
const Twilio = require('twilio')
const Emoji = require('emoji-codex')

class Main {
    constructor () {
        Daemon(() => {
            let app = Express()
            app.listen(8764, () => {
                console.log('App is now turning on port 8764!')
            })
            app.get('/', this.onReceive.bind(this))
        })

        this.twilio = Twilio(config.twilio.sid, config.twilio.token)
    }

    onReceive (request, response) {
        if (!request && !request.query && !response) {
            return
        }

        // Token should match the registered one, or it ain't our App calling
        if (request.query.token !== config.slack.token) {
            return;
        }

        this.handleSlackQuery(request.query).done(
            (data) => {
                this.handleSuccess(response, data)
            }, (error) => {
                response.end(error)
            }
        )
    }

    handleSlackQuery (query) {
        return new Promise((resolve, reject) => {
            // There should be a search query
            if (!query.text) {
                reject('Bad request format : you sould enter a phone number and a text message to send')
            }

            // There should be a To phone number and a message to send
            const number = this.getNumberFromQuery(query.text);
            const message = this.getMessageFromQuery(query.text);
            let unicodeMessage;
            if (!number || !message) {
                reject('Bad request format : you should use \sms !+3300000000! [your message]')
            }

            // Try to convert colon format emojis to unicode
            try {
                unicodeMessage = Emoji.translate(message)
            } catch (error) {
                reject('Emoji error : you can\'t use this emoji in a sms')
            }

            return this.sendSMS(number, unicodeMessage).then(
                (response) => {
                    resolve({ number: number, message: message })
                }, (error) => {
                    reject('Twilio error : ' + error)
                }
            )
        })
    }

    handleSuccess (response, data) {
        const payload = {
            response_type: 'in_channel',
            text: '*Slack Sms* : your sms was sent to number ' + data.number,
            attachments: [
		        {
			        title: "Your text message :",
			        text: data.message
		        }
            ]
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(payload))
        response.end()
    }

    sendSMS (number, message) {
        return this.twilio.sendMessage({
            to: number,
            from: config.twilio.number,
            body: message
        })
    }

    getNumberFromQuery (query) {
        const match = query.match(/\!(.*?)\!/);
        if (!match) {
            return
        }

        return match[1];
    }

    getMessageFromQuery (query) {
        const match = query.match(/\[(.*?)\]/);
        if (!match) {
            return
        }

        return match[1];
    }
}

new Main();
