const functions = require('firebase-functions');
const line = require('@line/bot-sdk')
const express = require('express')
const message = require('line-message-builder')

const config = {
	secret = functions.config().channel.secret,
	token = functions.config().channel.accesstoken
}

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
	Promise.all(req.body.events.map(handleEvent))
	.then((result) => res.json(result))
})

const client = new line.Client(config)

async function handleEvent(e) {
	switch (e.message.type) {
		case 'text':
			return client.replyMessage(e.replyToken, message.buildReplyText('メッセージを受け取りました'))
		case 'image':
			return client.replyMessage(e.replyToken, message.buildReplyText('画像を受け取りました'))
		case 'location':
			return client.replyMessage(e.replyToken, message.buildReplyText('位置情報を受け取りました'))
		case 'sticker':
			return client.replyMessage(e.replyToken, message.buildReplyText('スタンプを受け取りました'))
		default:
			return Promise.resolve(null)
	}
}

exports.app = functions.https.onRequest(app)