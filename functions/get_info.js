const { MongoClient } = require("mongodb");
const lib = require("lib");

let db = null;

/**
 * Get info about exhibits
 * @param {string} id
 * @returns {object} item
 */
module.exports = async function get_info(id, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	const { [id]: exhibit } = await lib[
		`${context.service.identifier}.get_bulk_info`
	]([id]);
	return exhibit;
};
