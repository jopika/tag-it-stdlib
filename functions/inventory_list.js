const { MongoClient, ObjectID } = require("mongodb");

let db = null;

/**
 * Return list of item names in user's inventory
 * @param {string} user tag of user
 * @returns {array} string list
 */
module.exports = async function inventory_list(user, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	const user = await db.collection("user").findOne({ tag: user });
	if (!user) throw { ok: false, message: "User does not exist" };
};
