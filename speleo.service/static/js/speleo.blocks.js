// ------------------------------------------------------------
// configuration
// ------------------------------------------------------------
window.config = {
  delay: 1000,
};

// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var Block = Backbone.Model.extend({
  defaults: {
    date:  '12/2/2012',
    time:  '12:34:09 PM',
    text:  '',
    type:  'single',
    count: 0,
    title: '',
    status: 'inverse',
    threshold: 0,
  },

  sync: function(m, m, o) {}
});

// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var BlockCollection = Backbone.Collection.extend({
  model: Block
});

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var BlockView = Backbone.View.extend({

  tagName: 'li',
  template: _.template($('#block-template').html()),
  events: {
    'click .block-close': 'remove'
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
   this.$el.html(this.template(this.model.toJSON()))
     .addClass('span3');
   return this;
  },

  remove: function() {
    this.$el.remove();
  }

});

// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var BlockAppView = Backbone.View.extend({

  el: $('#speleo-app'),
  blockCreateEl: $('#block-create'),
  blockFormEl: $('#block-form'),
  blockTitleEl: $('#block-title'),
  blockTypeEl: $('#block-type'),
  blockQueryEl: $('#block-query'),
  blockStatusEl: $('#block-status'),

  events: {
    'click #block-create': 'toggle',
    'click #block-submit': 'createBlock',
    'click #block-cancel': 'cancelBlock',
    'click #block-form .close': 'toggle',
  },

  initialize:function() {
    this.elastic = new ElasticSearch();
    Blocks.bind('add', this.addBlock, this);

    _.bindAll(this);
    _.delay(this.updateBlocks, window.config.delay);
  },

  toggle: function(e) {
    var self = this;
    if (self.blockCreateEl.css('display') === 'none') {
      this.blockFormEl.slideToggle(function() {
        self.blockCreateEl.fadeToggle();
      });
    } else {
      this.blockCreateEl.fadeToggle(function() {
        self.blockFormEl.slideToggle();
      });
    }
  },

  cancelBlock: function(e) {
    e.preventDefault();
    this.blockTitleEl.val('').focus();
    this.blockQueryEl.val('');
    this.blockTypeEl.val('single');
  },

  createBlock: function(e) {
    e.preventDefault();
    var title = this.blockTitleEl.val(),
        type  = this.blockTypeEl.val(),
        query = this.blockQueryEl.val();
    if (!title || !query) return;

    Blocks.create({
      title: title,
      query: query,
      type:  type
    });

    this.blockTitleEl.val('').focus();
    this.blockTypeEl.val('single');
    this.blockQueryEl.val('');
  },

  updateBlocks: function() {
    var self = this;
    Blocks.each(function(block) {
      self.elastic.search({
        queryDSL: {
          query: { 
            'query_string': { query: block.get('query') }
          }
        },

        callback: function(data, xhr) {
          block.set({
            'count': data.hits.total,
            'score': data.hits.max_score,
            'speed': data.took,
            'error': data.timed_out,
            'status': ['success', 'danger', 'warning'][+(data.hits.total > block.get('threshold'))]
          });
        }
      });
    });
    _.delay(this.updateBlocks, window.config.delay);
  },

  addBlock: function(event) {
    var view = new BlockView({ model: event }),
        elem = view.render().$el;
    elem.appendTo(this.blockStatusEl);
  },

});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.Blocks = new BlockCollection();
  window.app = new BlockAppView();
});
