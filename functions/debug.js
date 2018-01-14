const { MongoClient, ObjectID } = require("mongodb");

let db = null;

/**
 * Download EVERYTHING
 * @param {boolean} wipe clean the db for testing
 * @returns {object} everything.
 */
module.exports = async function debug(wipe = false, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	const collections = [
		db.collection("user"),
		db.collection("exhibit"),
		db.collection("transaction")
	];

	if (wipe) {
		await Promise.all(
			collections.map(async collection => collection.deleteMany())
		);

		return {
			users: [],
			exhibits: [],
			transactions: []
		};
	} else {
		const [users, exhibits, transactions] = await Promise.all(
			collections.map(async collection => collection.find().toArray())
		);

		return {
			users,
			exhibits,
			transactions
		};
	}
};
