const { MongoClient, ObjectID } = require("mongodb");

let db = null;

/**
 * Get info about exhibits
 * @param {array} ids
 * @returns {array} items
 */
module.exports = async function get_bulk_info(ids, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// Return a map of all items that match the given IDs
	const cursor = db
		.collection("exhibit")
		.find({ _id: { $in: ids.map(id => ObjectID.createFromHexString(id)) } });

	let exhibits = {};
	while (await cursor.hasNext()) {
		const exhibit = await cursor.next();
		const id = exhibit._id.toHexString();
		exhibits[id] = {
			id,
			name: exhibit.name,
			photoUrl: exhibit.photoUrl,
			collectibles: exhibit.collectibles
		};
	}
	return exhibits;
};
