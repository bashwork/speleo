// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var Event = Backbone.Model.extend({
  defaults: {
    date: '12/2/2012',
    time: '12:34:09 PM',
    text: '',
    tags: ['debug', 'production'],
  }

});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var EventCollection = Backbone.Collection.extend({
  model: Event,
  localStorage: new Store('dash-events')
});


// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var DashEventView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#event-template').html()),

  events: {
    'mouseover': 'gainfocus',
    'mouseout':  'losefocus',
    'click .event-close': 'remove'
  },

  initialize: function() {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
   if (this.model.get('to_be_removed')) {
     this.$el.css('opacity', '0.4');
   } else {
     this.$el.html(this.template(this.model.toJSON()))
       .addClass('well focused');
   }
   return this;
  },

  remove: function() {
    $(this.el).remove();
  },

  gainfocus: function() {
    this.$el.addClass('focused');
  },

  losefocus: function() {
    this.$el.removeClass('focused');
  }
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var DashboardAppView = Backbone.View.extend({

  el: '#event-list',

  initialize: function() {
    this.elastic = new ElasticSearch({
      callback: this.displayResults
    });
    DashEvents.bind('add', this.addEvent, this);
    DashEvents.bind('reset', this.addAllEvents, this);
    _.bindAll(this, 'create', 'addEvent');
    DashEvents.fetch();

    _.delay(this.create, 5000);
  },

  create:function() {
    DashEvents.create({ text: 'A new event ' + new Date() });
    _.delay(this.create, 5000);
  },

  addEvent: function(event) {
    this.trimEvents(),

    event.set('to_be_removed', false, { silent: true });
    var view = new DashEventView({ model: event }),
        elem = view.render().$el;

    elem.hide()
      .prependTo(this.el)
      .slideDown(function() {
        $(this).removeClass('focused');
      });
  },

  trimEvents: function() {
    var bheight = $('body').outerHeight(),
        wheight = $(window).height(),
        lheight = $('li', this.$el).height() || 0;

    while ((bheight + lheight) >= wheight) {
      DashEvents.first().destroy();
      DashEvents.first().set({ 'to_be_removed': true });
      bheight = $('body').outerHeight();
    }

  },

  addAllEvents: function() {
    DashEvents.each(this.addEvent);
  },
});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.DashEvents = new EventCollection();
  window.app = new DashboardAppView();
});
