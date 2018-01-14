const { MongoClient } = require("mongodb");
const lib = require("lib");
const fetch = require("node-fetch");

let db = null;

/**
 * Log a transaction
 * @param {string} target the tap that was tapped
 * @param {string} receiver the user that tapped it
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
		await report_transaction(db, receiver, itemkey, collectible, context);
		return { ok: Boolean(r.result.ok) };
	} catch (err) {
		return { ok: false, error: err.message };
	}
};

async function report_transaction(db, receiver, exhibit, collectible, context) {
	const user = await db.collection("user").findOne({ tag: receiver });

	const { name } = user;
	const item = exhibit.collectibles[collectible].description;

	// https://www.hongkiat.com/blog/send-messages-to-slack/
	let pl = `payload= ${JSON.stringify({
		username: "@taggy",
		icon_emoji: ":thinking_face:",
		channel: "#general",
		text: name + " did a gotcha! They gotcha'd " + item + "!"
	})}`;

	const response = await fetch(
		"https://hooks.slack.com/services/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",
		{
			method: "POST",
			body: pl,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
			//{
			//	access_token: "xoxp-XXXXXXXX-XXXXXXXX-XXXXX",
			//	scope: "incoming-webhook",
			//	team_name: "Team Installing Your Hook",
			//	incoming_webhook: {
			//		url: "https://hooks.slack.com/TXXXXX/BXXXXX/XXXXXXXXXX",
			//		channel: "#channel-it-will-post-to",
			//		channel_id: "C05002EAE",
			//		configuration_url: "https://teamname.slack.com/services/BXXXXX"
			//	}
			//}
		}
	);

	if (!response.ok) {
		throw new Error("problem 5");
	}
}
