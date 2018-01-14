const { MongoClient } = require("mongodb");

let db = null;

/**
 * Checks if some tag is a supertag
 * @param {string} tag tag number to check
 * @returns {boolean}
 */
module.exports = async function is_supertag(tag, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// get a user where tag equals tag from the user table
	const user = await db.collection("user").findOne({ tag });
	// if user is not null, return has mainitem property
	return user && user.mainitem != null;
};
