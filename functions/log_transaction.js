const { MongoClient } = require("mongodb");
const lib = require("lib");
const fetch = require("node-fetch");

let db = null;

/**
 * Log a transaction
 * @param {string} target
 * @param {string} receiver
 * @param {string} itemkey
 * @param {number} collectible
 * @param {number} date
 * @returns {boolean} ok
 */
module.exports = async function log_transaction(
	target,
	receiver,
	itemkey,
	collectible,
	date = null,
	context
) {
	let uri = process.env["MONGO_URI"];
	date = date || Date.now();

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	const transaction = {
		target,
		receiver,
		item,
		collectible,
		date
	};

	const r = await db.collection("transaction").insertOne(transaction);

	await report_transaction(db, receiver, itemkey, collectible, context);

	return Boolean(r.result.ok);
};

async function report_transaction(db, receiver, itemkey, collectible, context) {
	const [user, exhibit] = await Promise.all([
		db.collection("user").findOne({ tag: receiver }),
		lib[`${context.service.identifier}.get_info`](itemkey)
	]);

	const { name } = user;
	const item = exhibit.collectibles[collectible].description;

	// https://www.hongkiat.com/blog/send-messages-to-slack/
	let em = Math.floor(Math.random() * 7);
	let mes = Math.floor(Math.random() * 4);
	let emoji = "thinking_face";
	let message = "tagged";
	switch (mes) {
		case 0:
			message = "found";
			break;
		case 1:
			message = "got";
			break;
		case 2:
			message = "retrieved";
			break;
	}
	switch (em) {
		case 0:
			emoji = "ok_hand";
			break;
		case 1:
			emoji = "thumbsup";
			break;
		case 2:
			emoji = "fist";
			break;
		case 3:
			emoji = "the_horns";
			break;
		case 4:
			emoji = "clap";
			break;
		case 5:
			emoji = "grin";
			break;
	}
	let ex = Math.floor(Math.random()*3)+1;
	let excl = "";
	for (i = 0; i <= ex; i++) {
		excl += "!";
	}
	let pl = `payload= ${JSON.stringify({
		username: "@taggy",
		icon_emoji: ":" + emoji + ":",
		channel: "#general",
		text: name + " " + message + " " + item + excl
	})}`;

	const response = await fetch(
		"https://hooks.slack.com/services/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",
		{
			method: "POST",
			body: pl,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
	);

	if (!response.ok) {
		console.error("problem 5");
	}
}
