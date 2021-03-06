Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  if (this.cleanup()) { this.cleanup(); }
};

// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var Event = Backbone.Model.extend({
  defaults: {
    date: '12/2/2012',
    time: '12:34:09 PM',
    text: '',
    tags: ['debug', 'production']
  },

  sync: function(x, m, o) {}
});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var EventCollection = Backbone.Collection.extend({
  model: Event
});


// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var DashEventView = Backbone.View.extend({
  tagName: 'li',
  template: speleo.template['dashboard.event'],

  events: {
    'mouseover': 'gainfocus',
    'mouseout':  'losefocus',
    'click .event-close': 'remove'
  },

  initialize: function() {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.close, this);
  },

  render: function() {
   if (this.model.get('to_be_removed')) {
     this.$el.css('opacity', '0.5');
   } else {
     this.$el.html(this.template(this.model.toJSON()))
       .addClass('well')
       .css({ 'backgroundColor':'#FCF8E3' });
   }
   return this;
  },

  cleanup: function() {
    this.model.unbind('change',  this.render);
    this.model.unbind('destroy', this.close);
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

  el: '#speleo-app',
  listEl: $('#event-list'),
  queryEl: $('#dash-query'),
  inputEl: $('#dash-query input'),
  headerEl: $('#dash-query h1'),
  events: {
    'dblclick #dash-query': 'editQuery',
    'keypress #dash-query input': 'updateOnEnter',
    'blur #dash-query input': 'updateQuery'
  },

  initialize: function() {
    this.elastic = new ElasticSearch({
      callback: this.displayResults
    });
    DashEvents.bind('add', this.addEvent, this);
    DashEvents.bind('reset', this.addAllEvents, this);

    _.bindAll(this);
    _.delay(this.create, 5000);
  },

  editQuery: function(e) {
    var text = this.headerEl.text();
    this.queryEl.addClass('editing');
    this.inputEl.val(text).focus();
  },

  updateOnEnter: function(e) {
    if (e.keyCode == 13) {
      this.updateQuery(e);
    }
  },

  updateQuery: function(e) {
    var text = this.inputEl.val();
    this.headerEl.text(text);
    this.queryEl.removeClass('editing');
    DashEvents.each(function(e) { e.destroy() });
    // update the query udpate
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
      .prependTo(this.listEl)
      .slideDown(400, function() {
        elem.animate({ 'backgroundColor': '#F5F5F5' }, 1000);
      });
  },

  trimEvents: function() {
    var bheight = $('body').outerHeight(),
        wheight = $(window).height(),
        lheight = $('li', this.listEl).height() * 2 || 0;

    while ((bheight + lheight) >= wheight) {
      DashEvents.first().destroy();
      DashEvents.first().set({ 'to_be_removed': true });
      bheight = $('body').outerHeight();
    }
  },

  addAllEvents: function() {
    DashEvents.each(this.addEvent);
  }
});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.DashEvents = new EventCollection();
  window.app = new DashboardAppView();
});
