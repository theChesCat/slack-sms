const config = require('./config.js')

const Daemon = require('start-stop-daemon')
const Express = require('express')
const Twilio = require('twilio')

class Main {
    constructor () {
        Daemon(() => {
            let app = Express()
            app.listen(8765, () => {
                console.log('App is now turning on port 8765!')
            })
            app.get('/', this.onReceive.bind(this))
        })

        const message = 'this is a test message'

        const client = Twilio(config.twilio.sid, config.twilio.token)
        client.sendMessage({
            to: number,
            from: config.twilio.number,
            body: message
        }, (err, resp) => {
            console.log(err)
            console.log(resp)
        })
    }

    onReceive (request, response) {
        if (!request && !request.query && !response) {
            return
        }

        const token = request.query.token
        const search = request.query.text

        console.log(search);

        // Token should match the registered one, or it ain't our App calling
        if (token !== config.slack.token) {
            return;
        }
    }
}

new Main();
