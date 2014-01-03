$(function() {
    var Shape = Backbone.Model.extend({
        defaults: { x:50, y:50, width: 150, height:150, color:'black' },
        setTopLeft: function(x, y) {
            this.set({ x:x, y:y });
        },
        setDim: function(w,h){
            this.set({ width:w, height:h });
        },
    });


    var shape = new Shape();
    
    /*
    shape.bind('change', function() { alert('changed'); });
    shape.bind('change:width', function() { alert('width changed' + shape.get('width')); });

    shape.set({ width: 170 });
    shape.setTopLeft(100, 100);
    */

    /* Binding page elements to model changes */
    shape.bind('change', function() {
        $('.shape').css({   left:       shape.get('x'),
                            top:        shape.get('y'),
                            width:      shape.get('width'),
                            height:     shape.get('height'),
                            background: shape.get('color') });
    });

    shape.setTopLeft(100, 300);
    //shape.setDim(100, 300);

    /* Basic user input handling */
    /*
     * As a side note, notice that we are listening to mousemove and mouseup events on the parent page element and not on the shape’s div since we want the div to follow (resp. stop following) the mouse position even when it gets off (resp. is up outside of) the shape’s div borders.
     *
     * What is worth considering here is the simplicity of the jQuery callbacks handling the user input. We are not modifying or even querying the DOM in this code. We are just listening to the user input — mouse events here– and translating it to model changes. The page magically updates itself through the model change listeners.
     *
     * To sum up, we have separated the code handling user input and mutating the model, and the code updating the view in reaction to model change events. Looks like we implemented a model-view-controller here
     *
     */
    var dragging = false;

    $('.shape').mousedown(function(e) {
        dragging = true;
        shape.set({ color: 'gray' });
    });

    $('#page').mouseup(function(e) {
        dragging = false;
        shape.set({ color: 'black' });
    });

    $('#page').mousemove(function(e) {
        if (dragging) {
            shape.setTopLeft(e.pageX, e.pageY);
        }
    });

    /*
     * Model Collections
     * Before going further, we have to introduce a special kind of model used in backbone: collections. Collections are simply a container that helps maintain an ordered list of model objects. In addition it comes with built in events for common collection operations like add and remove.
     * We will use a model collection in order to organize our previously defined Shape objects into a Document:
     */
    var Document = Backbone.Collection.extend({ model: Shape });
    // That’s it! We can now instantiate the Document class and listen to add and remove events as follows:

    var document = new Document();

    document.bind('add', function(model) { alert('added'); });
    document.bind('remove', function(model) { alert('removed'); });

    document.add(shape); // fires add event
    //document.remove(shape); // fires remove event

    /*
     * A Backbone.js view is usually associated with a model (or a model collection). The view is responsible for two things:
     *
     * Rendering the model into a DOM element. It listens to model changes and updates the page accordingly.
     * Handling the events of this DOM element and updating the model.
     * In theory, Backbone’s view is actually playing both MVC’s view and MVC’s controller roles as it is handling the user input (DOM events) and updating the model, and also listening to model events and updating the visual part. This doesn’t have a big impact in practice as you would have different methods for each operation kind.
     */
    var ShapeView = Backbone.View.extend({
        initialize: function() {
            this.model.bind('change', this.updateView
    
});
