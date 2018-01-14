const { MongoClient } = require("mongodb");

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
		date
	};

	const r = await db.collection("transaction").insertOne(transaction);
	return r.result.ok;
};
