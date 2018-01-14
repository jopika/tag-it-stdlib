const { MongoClient } = require("mongodb");

let db = null;

/**
 * Create or update a user
 * @param {string} tag tag string
 * @param {string} name name of the user
 * @param {string} hint user written hint about their location
 * @returns {boolean} ok
 */
module.exports = async function create_user(tag, name, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// set tag and name for user, upsert/create if does not exist
	const r = await db
		.collection("user")
		.findOneAndUpdate({ tag }, { tag, name, inventory: [] }, { upsert: true });
	return r.ok;
};
