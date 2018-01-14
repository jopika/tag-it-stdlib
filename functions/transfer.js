const { MongoClient } = require("mongodb");

let db = null;

/**
 * Transfers an item from target to user
 * @param {string} userTag
 * @param {string} targetTag
 * @returns {any}
 */
module.exports = async function transfer(userTag, targetTag, context) {
	let uri = process.env["MONGO_URI"];

	if (db == null) {
		const client = await MongoClient.connect(uri);
		db = client.db("tagit");
	}

	let userTable = db.collection("user");

	let userObj = userTable.findone({ userTag });
	let targetObj = userTable.findone({ targetTag });

	if (targetObj.supertag) {
		// TODO: Clone an item
	} else {
		// TODO: Select a 'random' item in the pocket
		// NOTE: We 'should' not
	}
};
