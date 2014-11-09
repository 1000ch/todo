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

todo.model = {};
todo.collection = {};
todo.view = {};

todo.model.TaskItem = Backbone.Model.extend({
  
});

todo.collection.TaskList = Backbone.Collection.extend({
  model: todo.model.TaskItem,
  initialize: function () {

    var that = this;

    console.log('open database');
    todo.database.open(function () {

      console.log('get items from database');
      todo.getTasks(function (task) {
        that.add({
          text: task.text,
          timestamp: task.timestamp
        });
      });
    });
  }
});

todo.view.TaskListView = Backbone.View.extend({
  el: '#todos',
  template: 
    '<% _.each(models, function (model) { %>' +
      '<li>' + 
        '<input type="checkbox"><%= model.text %>' +
      '</li>' + 
    '<% }); %>',
  collection: new todo.collection.TaskList(),
  events: {
    'change input[type=checkbox]': 'onChecked'
  },
  initialize: function () {
    this.listenTo(this.collection, 'add sync destroy', this.render);
  },
  render: function () {console.log();
    var html = _.template(this.template, {
      models: this.collection.toJSON()
    });
    this.$el.html(html);
  },
  onChecked: function () {

  }
});

$(function () {
  new todo.view.TaskListView();
});