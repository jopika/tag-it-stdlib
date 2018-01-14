const { MongoClient } = require("mongodb");
const lib = require("lib");
const fetch = require("node-fetch");

let db = null;

/**
 * Log a transaction
 * @param {string} target the tag key that was tapped
 * @param {string} receiver the user tag that tapped it
 * @param {object} exhibit object for the exhibit
 * @param {number} collectible bit flag for the piece
 * @param {number} date the current time, as milliseconds since epoch
 * @returns {object}
 */
module.exports = async function log_transaction(
	target,
	receiver,
	exhibit,
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

	const r = await db.collection("transaction").insertOne({
		target,
		receiver,
		exhibit: exhibit.key,
		collectible,
		date
	});

	try {
		await report_transaction(db, receiver, exhibit, collectible, context);
		return { ok: Boolean(r.result.ok) };
	} catch (err) {
		throw { ok: false, message: err.message };
	}
};

async function report_transaction(db, receiver, exhibit, collectible, context) {
	const user = await db.collection("user").findOne({ tag: receiver });

	const { name } = user;
	const item = exhibit.collectibles[collectible].name;

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
	let ex = Math.floor(Math.random() * 3) + 1;
	let excl = "";
	for (i = 0; i <= ex; i++) {
		excl += "!";
	}
	let pl = `payload= ${JSON.stringify({
		username: "@taggy",
		icon_emoji: ":" + emoji + ":",
		channel: "#general",
		text: name + " " + message + " " + item
		// + excl
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
		throw new Error("problem 5");
	}
}
