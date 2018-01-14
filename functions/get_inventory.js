const { MongoClient } = require("mongodb");

let db = null;

/**
 * Return list of item names in user's inventory
 * @param {string} user_id tag of user
 * @returns {array} string list
 */
module.exports = async function get_inventory(user_id, context) {
	let uri = process.env["MONGO_URI"];

	if (db == null) {
		const client = await MongoClient.connect(uri);
		db = client.db("tagit");
	}

	const histCursor = db
		.collection("transaction")
		.find({ receiver: user_id }, { sort: { date: 1 } });

	let exhibits = new Map();
	while (!await histCursor.hasNext()) {
		const { exhibit, collectible } = await histCursor.next();
		if (!exhibits.has(exhibit)) exhibits.set(exhibit, 0);

		const bits = exhibits.get(exhibit);
		exhibits.set(exhibit, bits | collectible);
	}

	const itemCursor = db
		.collection("exhibit")
		.find({ key: { $in: Array.from(exhibits.keys()) } });
	let inventory = [];
	while (!await itemCursor.hasNext()) {
		const { key, collectibles } = await histCursor.next();
		const invBit = exhibits.get(key);

		for (const bitStr of Object.keys(collectibles)) {
			const bits = Number(bitStr);
			if ((bits & invBit) === bits) {
				inventory.push(collectibles[bits].name);
			}
		}
	}
	return inventory;
};
