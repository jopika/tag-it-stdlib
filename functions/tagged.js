const { MongoClient } = require("mongodb");
const lib = require("lib");

let db = null;

/**
 * Transfers an item from target (exhibit) to user
 * @param {string} userTag - user ID that recieves item
 * @param {string} targetTag - target ID to recieve item from
 * @returns {boolean} success validation
 */
module.exports = async function tagged(userTag, targetTag, context) {
	let uri = process.env["MONGO_URI"];

	if (db == null) {
		const client = await MongoClient.connect(uri);
		db = client.db("tagit");
	}
	// ASSUME: This function is called when the
	// target is an exhibit.

	let exhibitTable = db.collection("exhibit");
	let userTable = db.collection("user");

	const [userObj, targetObj] = await Promise.all([
		userTable.findOne({ tag: userTag }),
		exhibitTable.findOne({ tag: targetTag })
	]);

	if (userObj == null) {
		console.log("userObj is null");
		return false;
	}
	if (targetObj == null) {
		console.log("targetObj is null");
		return false;
	}
	let userInventory = userObj.inventory;

	// TODO: Check this
	const collection = Object.keys(targetObj.collectibles).map(
		k => targetObj.collectibles[k]
	);
	let sizeOfCollection = collection.length;
	let randomNumber = Math.floor(Math.random() * 100) % collection.length;
	let item = collection[randomNumber];

	userInventory.push(item);

	userTable.updateOne({ id: userTag }, { $set: { inventory: userInventory } });

	await lib[`${context.service.identifier}.log_transaction`](
		userTag,
		targetTag,
		targetObj,
		item.bit,
		context
	);

	return true;
};
