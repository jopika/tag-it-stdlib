const { MongoClient } = require("mongodb");

let db = null;

const ASC = 1;
const DESC = -1;

/**
 * Create or update a user
 * @param {string} tag tag string
 * @param {string} name name of the user
 * @param {string} hint user written hint about their location
 * @returns {boolean} true if user did not exist
 */
module.exports = async function put_user(tag, name, hint, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// get a user where tag equals tag from the user table
	const collection = db.collection("user");
	const user = await collection.findOne({ tag });
	if (user) {
		await collection.updateOne(user, { $set: { tag, name, hint } });
		return false;
	} else {
		await collection.insertOne({ tag, name, hint, supertag: null });
		return true;
	}
};
