/***** MODEL OBJECT ****/
window.TodoItem = Backbone.Model.extend({
  toggleStatus: function(){
    if(this.get('status') == 'incomplete'){
      this.set({'status': 'complete'});
    }else{
      this.set({'status': 'incomplete'});
    }

    this.save();
  }
});

/***** COLLECTION OBJECT ****/
window.TodoItems = Backbone.Collection.extend({
  model: TodoItem,
  url: '/todos',

  initialize: function(){
    this.on('remove', this.hideModel, this);
  },

  hideModel: function(model){
    model.trigger('hide');
  },

  focusOnTodoItem: function(id) {
    var modelsToRemove = this.filter(function(todoItem){
      return todoItem.id != id;
    });

    this.remove(modelsToRemove);
  }
});

/***** MODEL VIEW ****/
window.TodoView = Backbone.View.extend({
  template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %> <a href="/#todos/<%= id %>">☞</a></h3>'),

  events: {
    'change input': 'toggleStatus'
  },

  initialize: function(){
    this.model.on('change', this.render, this);
    this.model.on('destroy hide', this.remove, this);
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  remove: function(){
    this.$el.remove();
  },

  toggleStatus: function(){
    this.model.toggleStatus()
  }
});

/***** COLLECTION VIEW ****/
window.TodosView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.addOne, this);
    this.collection.on('reset', this.addAll, this);
  },

  render: function(){
    this.addAll()
    return this;
  },

  addAll: function(){
    this.$el.empty();
    this.collection.forEach(this.addOne, this);
  },

  addOne: function(todoItem){
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el); 
  }
});


/******** ROUTER ****/
window.TodoApp = new (Backbone.Router.extend({
  routes: {
    "": "index",
    "todos/:id": "show"
  },

  initialize: function(){
    this.todoItems = new TodoItems();
    this.todosView = new TodosView({collection: this.todoItems});
    this.todosView.render();
  },

  index: function(){
    $('#app').html(this.todosView.el);
    this.todoItems.fetch();
  },

  start: function(){
    Backbone.history.start();
  },

  show: function(id){
    this.todoItems.focusOnTodoItem(id);
  }
}));


/***** APPLICATION ****/
//= require jquery
//= require jquery_ujs
//= require backbone-rails
//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require router

$(function(){ TodoApp.start() });

