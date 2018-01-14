const { MongoClient } = require("mongodb");
const lib = require("lib");

let db = null;
let STEAL_BOOL = false;

/** 
 * Transfers an item from target to user
 * 
 * 
 */

module.exports = async function tagged(userTag, targetTag, context) {
    let uri = process.env["MONGO_URI"];

    if (db == null) {
        const client = await MongoClient.connect(uri);
        db = client.db("tagit");
    }
    // ASSUME: This function is called when the target
    // is an exhibit.

    let exhibitTable = db.collection("exhibit");
    let userTable = db.collection("user");

    let userObj     = userTable.findone({"id":userTag});
    let targetObj   = exhibitTable.findone({"id":targetTag});

    // 
    let userInventory   = userObj.inventory;
    // TODO: Check this
    let targetCollection = targetObj.collection; 
    
    let sizeOfCollection = Object.keys(targetCollection).length;

    let randomNumber = Math.floor((Math.random() * 100)) % sizeOfCollection

    let item = targetCollection[randomNumber];

    userObj.userObj.inventory.push(item)

    userTable.updateOne({"id":userTag}, 
        {$set: {"inventory": userInventory}});
    
    await lib[`${context.service.identifier}.log_transaction`](userTag,
     targetTag, item, context);




    // let newItem         =

/*    if(targetObj.supertag) {
        // TODO: Clone an item from the
    } else {
        // TODO: Select a 'random' item in the pocket
        // NOTE: We 'should' not
        if(STEAL_BOOL) {

        }
    }*/
}