const mongodb = require('mongodb');
const util = require('util')
const MongoClient = mongodb.MongoClient;

let cache = null;

/**
* @returns {array}
*/
module.exports = (context, callback) => {
  let uri = process.env['MONGO_URI'];

  try {
    if (cache === null) {
      MongoClient.connect(uri, (error, db) => {
        if (error) {
          console.log(error['errors']);
          return callback(error);
        }
        cache = db;
        readTodos(db, callback);
        db.collection('user').lookup()
      });
    } else {
      readTodos(cache, callback);
    }
  } catch (error) {
    console.log(error);
    return callback(error);
  }
};

async function isSupertag(db, tag) {
  let cursor = db.collection('users').find({ _id: tag });

}

const readTodos = (db, callback) => {
  let cursor = db.collection('todo').find();
  let todos = [];
  cursor.each((error, item) => {
    if (error) {
      console.log(error);
    }
    if (item == null) {
      return callback(null, todos);
    }
    todos.push({
      id: item._id,
      text: item.text,
      completed: item.completed
    });
  });
};
