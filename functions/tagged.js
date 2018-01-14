const { MongoClient } = require("mongodb");
const lib = require("lib");

let db = null;

/**
 * Transfers an item from target (exhibit) to user
 * @param {string} userTag - user ID that recieves item
 * @param {string} targetTag - target ID to recieve item from
 * @returns {object} tapped item
 */
module.exports = async function tagged(userTag, targetTag, context) {
	let uri = process.env["MONGO_URI"];

	if (db == null) {
		const client = await MongoClient.connect(uri);
		db = client.db("tagit");
	}
	// ASSUME: This function is called when the target is an exhibit.

	const pastTapped = await db
		.collection("transaction")
		.findOne({ target: targetTag, receiver: userTag });

	if (pastTapped) {
		throw { ok: false, message: "You already tapped this tag" };
	}

	const userTable = db.collection("user");
	const [userObj, targetObj] = await Promise.all([
		userTable.findOne({ tag: userTag }),
		db.collection("exhibit").findOne({ tag: targetTag })
	]);

	if (userObj == null) {
		throw { ok: false, message: "user does not exist" };
	}
	if (targetObj == null) {
		throw { ok: false, message: "target does not exist" };
	}

	// TODO: Check this
	const collection = Object.keys(targetObj.collectibles).map(
		k => targetObj.collectibles[k]
	);
	let sizeOfCollection = collection.length;
	let randomNumber = Math.floor(Math.random() * 100) % collection.length;
	let item = collection[randomNumber];

	await lib[`${context.service.identifier}.log_transaction`](
		targetTag,
		userTag,
		targetObj,
		item.bit
	);

	return {
		photoUrl: targetObj.photoUrl,
		name: targetObj.name,
		collectibleName: item.name,
		description: item.description
	};
};
