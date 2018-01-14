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

	let userTable = db.collection("user");
	let userObj = await userTable.findOne({ tag: user_id });
	let inventory = userObj.inventory;

	let array = userObj.inventory.map(item => item.name);
};
