const { MongoClient } = require("mongodb");

let db = null;

const ASC = 1;
const DESC = -1;

/**
 * Get the items in a user's pocket
 * @param {string} tag user's tag to lookup
 * @returns {array}
 */
module.exports = async function pocket(tag, context) {
	let uri = process.env["MONGO_URI"];

	// Load database unless cached
	if (db == null) {
		// (async) obtain an instance of the client
		const client = await MongoClient.connect(uri);
		// connect to the database
		db = client.db("tagit");
	}

	// get a cursor that iterates through every iteraction this user was involved
	// in, sorted from oldest to newest.
	const cursor = db
		.collection("iteraction")
		.find({ $or: [{ target: tag }, { user: tag }] })
		.sort({ date: ASC });

	let pocket = [];
	while (await cursor.hasNext()) {
		// get an interaction document
		const iteraction = await cursor.next();
		// if the item was taken from this user...
		if (iteraction.target === tag) {
			// if the item wasn't duplicated, remove it from user's pocket
			if (!iteraction.isCopy) {
				const index = pocket.indexOf(iteraction.item);
				if (index > -1) pocket.splice(index, 1);
			}
		} else {
			// add item to users pocket since they took it from someone
			pocket.push(iteraction.item);
		}
	}
	return pocket;
};
