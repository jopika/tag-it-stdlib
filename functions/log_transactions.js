const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");

let db = null;

/**
 * Log a transaction
 * @param {string} target
 * @param {string} receiver
 * @param {string} item
 * @param {number} date
 * @returns {boolean} ok
 */
module.exports = async function log_transaction(
	target,
	receiver,
	item,
	date = Date.now(),
	context
) {
	let uri = process.env["MONGO_URI"];

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
		date
	};

	const r = await db.collection("transaction").insertOne(transaction);

	const response = await fetch(
		"https://hooks.slack.com/services/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",
		{
			method: "POST",
			body: {
				access_token: "xoxp-XXXXXXXX-XXXXXXXX-XXXXX",
				scope: "incoming-webhook",
				team_name: "Team Installing Your Hook",
				incoming_webhook: {
					url: "https://hooks.slack.com/TXXXXX/BXXXXX/XXXXXXXXXX",
					channel: "#channel-it-will-post-to",
					channel_id: "C05002EAE",
					configuration_url: "https://teamname.slack.com/services/BXXXXX"
				}
			}
		}
	);

	if (!response.ok) {
		console.error("problem 5");
	}

	return r.result.ok;
};
