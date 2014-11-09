var todo = {};
todo.database = {};
todo.database.onupgradeneeded = function (e) {
  var db = e.target.result;

  // A versionchange transaction is started automatically.
  e.target.transaction.onerror = todo.database.onerror;
  
  if (db.objectStoreNames.contains('todo')) {
    db.deleteObjectStore('todo');
  }
  
  var store = db.createObjectStore('todo', {
    keyPath: 'timestamp'
  });
};
todo.database.onsuccess       = function (e) {
  todo.db = e.target.result;
  while (todo.database.callbacks.length) {
    todo.database.callbacks.shift()();
  }
};
todo.database.onerror         = function (e) {
  console.error(e);
};

todo.db = null;
todo.database.callbacks = [];
todo.database.open = function (callback) {
  var version = 1;
  var request = indexedDB.open('todos', version);
  request.onupgradeneeded = todo.database.onupgradeneeded;
  request.onsuccess       = todo.database.onsuccess;
  request.onerror         = todo.database.onerror;

  todo.database.callbacks.push(callback);
};

todo.getTasks = function (callback) {
  var db = todo.db;
  var transaction = db.transaction(['todo'], 'readwrite');
  var store = transaction.objectStore('todo');

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function (e) {
    var result = e.target.result;
    if (result) {
      callback(result.value);
      result.continue();
    }
  };
};

todo.addTask = function (text, timestamp) {
  var db = todo.db;
  var transaction = db.transaction(['todo'], 'readwrite');
  var store = transaction.objectStore('todo');

  var request = store.put({
    text: text,
    timestamp: timestamp
  });
  transaction.oncomplete = function (e) {
    // render
  };
  request.onerror = todo.database.onerror;
};

todo.deleteTask = function (id) {
  var db = todo.db;
  var transaction = db.transaction(['todo'], 'readwrite');
  var store = transaction.objectStore('todo');

  var request = store.delete(id);
  transaction.oncomplete = function (e) {
    // render
  };
  request.onerror = todo.database.onerror;
};

var TaskList = flight.component(function () {
  this.after('initialize', function () {

    console.log('open database');
    todo.database.open(function () {

      console.log('get items from database');
      todo.getTasks(function (value) {
        console.log(value);
      });
    });

    console.log('attach event');
    this.on('input[type=checkbox]', 'change', function () {
      console.log('changed');
    });
  });
});

var TaskItem = flight.component(function () {
  this.attributes({
    taskItem: '.task-item'
  });
});

$(function () {
  TaskList.attachTo('#todos');
});