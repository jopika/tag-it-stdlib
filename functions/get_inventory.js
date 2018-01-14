const { MongoClient } = require("mongodb");

let db = null;

/**
 * Log a transaction
 * @param {string} user_id
 * @returns {array} ok
 */

 module.exports = async function get_inventory(
    user_id,
    context) {
    let uri = process.env["MONGO_URI"];

    if (db == null) {
        const client = await MongoClient.connect(uri);
        db = client.db("tagit");
    }

    let userTable = db.collection("user");
    let userObj = userTable.findOne({"tag":user_id});
    let inventory = userObj.inventory;

    let array = new Array(inventory.length);

    for (var i = inventory.length - 1; i >= 0; i--) {
        array.push(inventory.get(i));
    }

    return array;
 }