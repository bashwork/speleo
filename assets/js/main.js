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

  /**
   * handle merging all the tags somehow
   * - deal with the date and time
   */

});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var EventCollection = Backbone.Collection.extend({
  model: Event,
  localStorage: new Store('events'),

  comparator: function(event) {
    return event.get('date');
  },

  /**
   * Should I do these filters here or just let
   * elastic search do this?
   */
  withTag:function(tag) {
    return this.filter(function(event) {
      return _.include(event.tags, tag);
    });
  }

});

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var EventView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#event-template').html()),

  events: {
    'mouseover .event': 'gainfocus',
    'mouseout  .event': 'losefocus',
    'click .event-close': 'remove'
  },

  initailize: function(args) {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
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

  /**
   * handle re-rendering
   * - convert new data to correct format
   * - handle click callbacks filters
   * - handle window filters
   */

  initialize:function() {
    this.update(window.graphMockData);
  },

  handleSelect: function(e) {
    console.log(e.point);
  },

  update: function(data) {
    this.data = data;
    this.render();
  },

  render: function() {
    this.chart = new Highcharts.StockChart({
      chart: {
        renderTo: 'event-graph',
        alignTicks: false,
        borderWidth: 1,
        borderColor: '#eee'
      },
      plotOptions: {
        column: {
          events: {
            click: this.handleSelect
          }
        }
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
        data: this.data
      }]
    });
  }
});

// ------------------------------------------------------------
// router
// ------------------------------------------------------------
var Router = Backbone.Router.extend({
  /**
   * - handle dashboard
   * - handle about
   * - handle contact (send email to support)
   * - handle statistics (a whole new iteration)
   */
  routes : {
    '': 'index',
  },
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var AppView = Backbone.View.extend({
  /**
   * - client to elastic (search to here and post results)
   * - bind search results to graph (come from service stats)
   * - client to backend
   *   * statistics model (for long term history)
   *   * node modules (for health checking)
   */

  el: $('#event-app'),
  events: {
    'keypress #new-event': 'searchEvents',
    'click #new-event-submit': 'searchEventsButton'
  },

  initialize: function() {
    this.input  = this.$('#new-event');
    this.button = this.$('#new-event-submit');
    //this.events = new EventCollection();
    Events.bind('add', this.addEvent, this);
    Events.bind('reset', this.addEvents, this);
    Events.fetch();

    this.chart = new ChartView();
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
