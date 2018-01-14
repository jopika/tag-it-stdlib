const { MongoClient, ObjectID } = require("mongodb");

let db = null;

/**
 * Download EVERYTHING
 * @param {string} wipe clean the collection for testing
 * @returns {object} everything.
 */
module.exports = async function debug(wipe = "", context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	if (wipe) {
		if (wipe.endsWith("s")) wipe = wipe.substring(0, -1);
		await db.collection(wipe).deleteMany();
	}

	const collections = [
		db.collection("user"),
		db.collection("exhibit"),
		db.collection("transaction")
	];
	const [users, exhibits, transactions] = await Promise.all(
		collections.map(async collection => collection.find().toArray())
	);

	return {
		users,
		exhibits,
		transactions
	};
};
