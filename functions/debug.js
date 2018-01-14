const { MongoClient, ObjectID } = require("mongodb");

let db = null;

/**
 * Download EVERYTHING
 * @returns {object} everything.
 */
module.exports = async function debug(context) {
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

	const [users, exhibits, transactions] = await Promise.all(
		collections.map(async collection => collection.find().toArray())
	);

	return {
		users,
		exhibits,
		transactions
	};
};
