const { MongoClient } = require("mongodb");
const lib = require("lib");

let db = null;
let STEAL_BOOL = false;

/** 
 * Transfers an item from target (exhibit) to user
 * @param {string} user_tag - user ID that recieves item
 * @param {string} target_tag - target ID to recieve item from
 * @returns {bool} success validation
 */
module.exports = async function tagged(user_tag, target_tag, context) {
    let uri = process.env["MONGO_URI"];

    if (db == null) {
        const client = await MongoClient.connect(uri);
        db = client.db("tagit");
    }
    // ASSUME: This function is called when the
    // target is an exhibit.

    let exhibitTable = db.collection("exhibit");
    let userTable   = db.collection("user");

    let userObj     = userTable.findone({"id":userTag});
    let targetObj   = exhibitTable.findone({"id":targetTag});

    let userInventory   = userObj.inventory;

    // TODO: Check this
    let targetCollection = targetObj.collection; 
    let sizeOfCollection = Object.keys(targetCollection).length;
    let randomNumber = Math.floor((Math.random() * 100)) % sizeOfCollection;
    let item = targetCollection[randomNumber];

    userInventory.push(item);

    userTable.updateOne({"id":userTag}, 
        {$set: {"inventory": userInventory}});
    
    await lib[`${context.service.identifier}.log_transaction`](userTag,
     targetTag, item, context);

    return true;
}