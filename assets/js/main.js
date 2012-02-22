// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var Event = Backbone.Model.extend({
  defaults: {
    date: '12/2/2012',
    time: '12:34:09 PM',
    text: '',
    tags: ['debug', 'production']
  }

});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var EventCollection = Backbone.Collection.extend({
  model: Event,
  localStorage: new Store('events')

});

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var EventView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#event-template').html()),

  events: {
    'mouseover .event': 'gainfocus',
    'mouseout  .event': 'losefocus'
  },

  initailize: function(args) {
    this.model.bind('change', this.render, this);
    this.model.bind('remove', this.remove, this);
  },

  render: function() {
   $(this.el).html(this.template(this.model.toJSON()));
   $(this.el).addClass('well');
   return this;
  },

  remove: function() {
    $(this.el).remove();
  },

  gainfocus: function() {
    $(this.el).addClass('focused');
  },

  losefocus: function() {
    $(this.el).removeClass('focused');
  }
});

var ChartView = Backbone.View.extend({
  defaults: {
    data: window.graphMockData
  },

  render: function() {
    this.chart = new Highcharts.StockChart({
      chart: {
        renderTo: 'event-graph',
        alignTicks: false,
        borderWidth: 1,
        borderColor: '#eee',
      },
      credits: {
        enabled: false,
      },
      rangeSelector: {
        selected: 1
      },
      series: [{
        type: 'column',
        name: 'recent events',
        data: window.graphMockData,
      }]
    });
  }
});

// ------------------------------------------------------------
// router
// ------------------------------------------------------------
var Router = Backbone.Router.extend({
  routes : {
    '': 'index',
  },
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var AppView = Backbone.View.extend({
  el: $('#event-app'),
  events: {
    'keypress #new-event': 'searchEvents',
    'click #new-event-submit': 'searchEventsButton'
  },

  initialize: function() {
    this.input  = this.$('#new-event');
    this.button = this.$('#new-event-submit');
    Events.bind('add', this.addEvent, this);
    //Events.bind('reset', this.addEvents, this);
    Events.fetch();
    this.chart = new ChartView();
    this.chart.render();
  },

  searchEventsButton: function(e) {
    e.preventDefault();
    var text = this.input.val();
    if (!text) return;
    Events.create({text: text});
    this.input.val('');
  },

  searchEvents: function(e) {
    var text = this.input.val();
    if (!text || e.keyCode != 13) return;
    Events.create({text: text});
    this.input.val('');
  },

  addEvent: function(event) {
    var view = new EventView({model: event});
    $('#event-list').append(view.render().el);
  },

  addEvents: function() {
    Events.each(this.addEvent);
  },
});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.Events = new EventCollection();
  window.app = new AppView();
  app.router = new Router();
  Backbone.history.start({ pushState : true });
});
