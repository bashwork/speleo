// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var Event = Backbone.Model.extend({
  defaults: {
    date:  '12/2/2012',
    time:  '12:34:09 PM',
    text:  '',
    title:  '',
    tags:  ['debug', 'production']
  },

  sync: function(m, m, o) {}

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
  },

  make: function(hit) {
    var source = hit['_source'];
    delete hit['_source'];
    source.tags = [hit['_index'], hit['_type']];
    return Events.create(_.extend(source, hit));
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
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
   this.$el.html(this.template(this.model.toJSON()))
     .addClass('well');
   return this;
  },

  remove: function() {
    this.$el.remove();
  },

  gainfocus: function() {
    this.$el.addClass('focused');
  },

  losefocus: function() {
    this.$el.removeClass('focused');
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
    this.update();
    this.chart.showLoading();
  },

  handleSelect: function(e) {
    console.log(e.point);
  },

  update: function() {
    if (this.chart) this.chart.showLoading();
    var groups = Events.groupBy(function(event) {
      return event.get('date') + event.get('time');
    });
    this.data = _.map(_.keys(groups), function(key) {
      return [key, _.size(groups[key])];
    });
    this.render();
    if (this.chart) this.chart.hideLoading();
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

var StatusView = Backbone.View.extend({

  el: '#event-status',
  template: _.template($('#status-template').html()),
  events: {
    'click #event-pager li': 'changePage'
  },

  initialize:function() {
    this.status = {}
  },

  changePage: function(e) {
    var page = e.target.innerHTML;
    $(e.target)
      .parent().addClass('active')
      .siblings().removeClass('active');
    Notifier.trigger('changeEventPage', parseInt(page));
  },

  update: function(data) {
    var cevent = window.config.eventsPerPage,
        cpages = window.config.eventPages;

    this.status.count = data.hits.total || 0;
    this.status.score = data.hits.max_score || 0.0;
    this.status.error = data.timed_out || false;
    this.status.time  = data.took || 0;
    this.status.pages = _.range(_.min([(this.status.count / cevent), cpages]));
    this.render();
    Notifier.trigger('changeEventPage', 0);
  },

  render: function() {
    this.$el.slideUp();
    this.$el.html(this.template(this.status))
        .slideDown();
    return this.$el;
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
  listEl: $('#event-list'),
  inputEl: $('#new-event'),
  events: {
    'keypress #new-event': 'searchEvents',
    'click #new-event-submit': 'searchEventsButton'
  },

  initialize: function() {
    Notifier.bind('changeEventPage', this.changeEvents, this);
    _.bindAll(this, 'parseResults', 'addEvent');

    this.elastic = new ElasticSearch({
      callback: this.parseResults
    });
    this.chart  = new ChartView();
    this.status = new StatusView();
  },

  parseResults: function(data, xhr) {
    Events.reset();
    this.status.update(data);
    _.each(data.hits.hits, Events.make);
    this.chart.update();
  },

  executeSearch: function() {
    var text = this.inputEl.val();
    this.elastic.search({
      queryDSL: {
        query: { 
          'query_string': { query: text }
        }
      }
    });
    this.inputEl.val('');
  },

  searchEventsButton: function(e) {
    e.preventDefault();
    var text = this.inputEl.val();
    if (!text) return;
    this.executeSearch();
  },

  searchEvents: function(e) {
    var text = this.inputEl.val();
    if (!text || e.keyCode != 13) return;
    this.executeSearch();
  },

  addEvent: function(event) {
    var view = new EventView({ model: event }),
        elem = view.render().$el;
    elem.appendTo(this.listEl);
  },

  changeEvents: function(page) {
    var count = window.config.eventsPerPage,
        self  = this;

    this.listEl.fadeOut('fast', function() {
      $(this).html('');
      Events.chain()
        .rest(page * count).first(count)
        .each(self.addEvent)
        .value();
      self.listEl.slideDown();
    });
  }
});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.config = {
    eventsPerPage: 3,
    eventPages: 16,
  };
  window.Notifier = _.extend({}, Backbone.Events);
  window.Events = new EventCollection();
  window.app = new AppView();
  app.router = new Router();
  Backbone.history.start({ pushState : true });
});
