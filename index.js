require('dotenv').config();

const express = require('express')
	, bodyParser = require('body-parser')
	, mongoose = require('mongoose')
	, { nanoid } = require('nanoid')
	, app = express()
	, port = process.env.PORT;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO, {useNewUrlParser: true});
const db = mongoose.connection;
const linkSchema = new mongoose.Schema({
	url: { type: String, required: true },
	id: { type: String, index: true, default: nanoid(10), unique: true },
	views: { type: Number, default: 0 }
});
const Link = mongoose.model('Link', linkSchema);

db.on('error', console.error.bind(console, '[!] Connection error:'));
db.once('open', function() {
	app.listen(port, () => {
		console.log(`[+] Listening on ${port}`);
	});

	app.post('/shorten', (req, res) => {
		if(typeof req.body.urlToShorten !== 'string') 
			return res.status(400).send('urlToShorten is required!');

		const link = new Link({url: req.body.urlToShorten});
		link.save(function (err) {
			console.log('saved');
		})
		res.status(201).send(JSON.stringify({
			status: 'Created',
			shortenedUrl: `http://localhost:${port}/${link.id}`
		}));
	});

	app.get('/:url', (req, res) => {
		Link.findOne({ id: req.params.url }, function (err, link) {
			if(!link) return res.status(404).send('url not found!');

			link.views++;
			link.save();

			res.status(301).location(link.url).send(JSON.stringify({
				redirectTo: link.url
			}));
		});
	});

	app.get('/:url/views', (req, res) => {
		Link.findOne({ id: req.params.url }, function (err, link) {
			if(!link) return res.status(404).send('url not found!');

			res.status(200).send(JSON.stringify({
				viewCount: link.views
			}));
		});
	});
});
