// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var Block = Backbone.Model.extend({
  defaults: {
    date:  '12/2/2012',
    time:  '12:34:09 PM',
    text:  '',
    type:  'box',
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
  model: Block,

  make: function(data) {
    var block = {
      'title': 'example',
      'count': data.hits.total,
      'score': data.hits.max_score,
      'speed': data.took,
      'error': data.timed_out
    };
    return new Block(block);
  }

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

  el: $('#block-app'),
  blockTitleEl: $('#block-title'),
  blockQueryEl: $('#block-query'),
  blockStatusEl: $('#block-status'),

  events: {
    'click #block-submit': 'createBlock',
  },

  initialize:function() {
    this.elastic = new ElasticSearch();
    Blocks.bind('add', this.addBlock, this);
    _.bindAll(this);
    _.delay(this.updateBlocks, 1000);
  },

  createBlock: function(e) {
    e.preventDefault();
    var title = this.blockTitleEl.val(),
        query = this.blockQueryEl.val();
    if (!title || !query) return;

    Blocks.add(new Block({
      title: title,
      query: query
    }));

    this.blockTitleEl.val('');
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
    _.delay(this.updateBlocks, 1000);
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
