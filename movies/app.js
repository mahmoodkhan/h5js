
$(function(){
  //model
  var Todo = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "empty todo...",
        order: Todos.nextOrder(),
        done: false
      };
    }

  });
  // collection
  var TodoList = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Backbone.LocalStorage("todos-backbone"),

    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

  });
  alert("about to create model collection");
  // create instance of collection
  var Todos = new TodoList;

  // create a view for a single instance of model
  var TodoView = Backbone.View.extend({
    tagName:  "li",
    template: _.template($('#item-template').html()),
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },
    initialize: function() {
    	alert("TODOVIEW INIT");
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({title: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  var AppView = Backbone.View.extend({
    el: $("#todoapp"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.input = this.$("#new-todo");
      this.listenTo(Todos, 'add', this.addOne);
      //this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);
      this.main = $('#main');
      Todos.fetch();
    },
        // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      if (Todos.length) {
        this.main.show();
      } else {
        this.main.hide();
      }
    },

    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },
    addAll: function() {
      Todos.each(this.addOne, this);
    },
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;
      alert("creating on enter");
      Todos.create({title: this.input.val()});
      this.input.val('');
    }
  });

  var App = new AppView;

});
