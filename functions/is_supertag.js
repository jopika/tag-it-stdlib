const { MongoClient } = require("mongodb");

let db = null;

/**
 * Checks if some tag is a supertag
 * @param {string} tag tag number to check
 * @returns {boolean}
 */
module.exports = async function is_supertag(tag, context) {
	let uri = process.env["MONGO_URI"];

	if (db == null) {
		const client = await MongoClient.connect(uri);
		db = client.db("tagit");
	}

	const user = db.collection("user").findOne({ tag });
	return user.supertag;
};
