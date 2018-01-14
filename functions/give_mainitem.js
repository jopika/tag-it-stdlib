const { MongoClient } = require("mongodb");

let db = null;

const ASC = 1;
const DESC = -1;

/**
 * Give user a main item
 * @param {string} tag user's tag
 * @param {string} item what item will they supply
 * @returns {any}
 */
module.exports = async function give_mainitem(tag, item, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// get a user where tag equals tag from the user table
	await db
		.collection("user")
		.findOneAndUpdate({ tag }, { $set: { mainitem: item } });
	return true;
};
