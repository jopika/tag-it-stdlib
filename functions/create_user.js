const { MongoClient } = require("mongodb");

let db = null;

/**
 * Create or update a user
 * @param {string} tag tag string
 * @param {string} name name of the user
 * @returns {object} ok
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

	const collection = db.collection("user");

	const user = await collection.findOne({ tag });
	if (user) {
		const r = await collection.updateOne(user, { $set: { tag, name } });
		return {
			ok: Boolean(r.result.ok),
			message: `Updated ${tag}`
		};
	} else {
		const r = await collection.insertOne({ tag, name, inventory: [] });
		return { ok: Boolean(r.result.ok), message: "New user" };
	}
};
