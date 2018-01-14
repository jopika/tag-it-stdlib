const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let cache = null;

/**
* @returns {array}
*/
module.exports = async (context) => {
	let uri = process.env['MONGO_URI'];

	if (cache === null) {
		const db = await MongoClient.connect(uri);
		cache = db;
		return readTodos(db);
	} else {
		return readTodos(cache, callback);
	}
};

async function readTodos(db) {
	const items = await db.collection('todo').find();

	let todos = [];
	for (const item of (await items.toArray())) {
		todos.push({
			id: item._id,
			text: item.text,
			completed: item.completed
		});
	}
	return todos;
}
