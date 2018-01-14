const { MongoClient } = require("mongodb");

async function setup_db() {
	let uri = require("../env.json").local.MONGO_URI;

	// (async) obtain an instance of the client
	const client = await MongoClient.connect(uri);
	// connect to the database
	db = client.db("tagit");

	await Promise.all([
		db.collection("user").dropAllIndexes(),
		db.collection("exhibit").dropAllIndexes()
	]);
	await Promise.all([
		db.collection("user").createIndex({ tag: 1 }, { unique: true }),
		db.collection("exhibit").createIndex({ key: 1 }, { unique: true }),
		db.collection("exhibit").createIndex({ tag: 1 }, { unique: true })
	]);

	await db.collection("exhibit").deleteMany();
	const exhibits = require("./exhibit.json");
	return await db.collection("exhibit").insertMany(
		exhibits.map(exhibit => {
			let collectibles = {};
			for (const bitString of Object.keys(exhibit.collectibles)) {
				const bit = Number(bitString);
				const collectible = exhibit.collectibles[bitString];
				collectibles[bit] = Object.assign({}, collectible, { bit });
			}

			return Object.assign({}, exhibit, { collectibles });
		})
	);
}

setup_db()
	.then(r => {
		console.log(r);
		process.exit(0);
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
