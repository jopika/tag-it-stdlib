const { MongoClient } = require("mongodb");

let db = null;

/**
 * Add exhibits
 * @param {string} a
 * @param {object} list
 * @returns {object} insertedIds
 */
module.exports = async function add_exhibits(a = "", list, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// set tag and name for user, upsert/create if does not exist
	const r = await db.collection("exhibit").insertMany(
		Object.keys(list).map(key => {
			let collectibles = {};
			for (const bit of Object.keys(list[key].collectibles)) {
				const num = Number(bit);
				collectibles[num] = list[key].collectibles[bit];
			}

			return {
				key,
				tag: list[tag].name,
				name: list[key].name,
				photoUrl: list[key].photoUrl,
				collectibles
			};
		})
	);
	return r.insertedIds;
};
