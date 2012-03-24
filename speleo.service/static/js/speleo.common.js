// ------------------------------------------------------------
// global
// ------------------------------------------------------------
speleo          = window.speleo   || {};
speleo.model    = speleo.model    || {};
speleo.group    = speleo.group    || {};
speleo.view     = speleo.view     || {};
speleo.option   = speleo.option   || {};
speleo.template = speleo.template || window.JST;
speleo.event    = speleo.event    || _.extend({}, Backbone.Events);

// ------------------------------------------------------------
// models
// ------------------------------------------------------------
speleo.model.Query = Backbone.Model.extend({
  defaults: {
    'title': 'New Query',
    'query': '',
    'type':  'block',
    'created': new Date()
  },

  sync: function(x, m, o) {}
});

speleo.model.Setting = Backbone.Model.extend({
  defaults: {
  },

  sync: function(x, m, o) {}
});

speleo.model.Meta = Backbone.Model.extend({
  defaults: {
    time:  0,
    total: 0,
    score: 0,
    valid: false
  },

  update: function(response) {
    this.set({
      time:  response.took,
      total: response.hits.total,
      count: _.size(response.hits.hits),
      score: response.hits.max_score,
      valid: !response.timed_out
    });
  },

  sync: function(x, m, o) {}
});

speleo.model.Facet = Backbone.Model.extend({
  defaults: {
    rank:   0,
    name:  '',
    group: '',
    total:  0
  },

  percent: function() {
    return rank / total;
  },

  sync: function(x, m, o) {}
});

speleo.model.Event = Backbone.Model.extend({
  defaults: {
    date:  '12/2/2012',
    time:  '12:34:09 PM',
    score: 0
  },

  sync: function(x, m, o) {}
});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
speleo.group.Event = Backbone.Collection.extend({
  model: speleo.model.Event,
  url: 'http://localhost:9200/_search/',
  meta: new speleo.model.Meta(),

  comparator: function(event) {
    return event.get('score');
  },

  fetch: function(options) {
    options = _.extend({ type:"POST", dataType: "json" }, options);
    options.data = JSON.stringify(options.data);
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  parse: function(response) {
    return response.hits.hits.map(function(hit) {
      var event = new speleo.model.Event({
        id: hit.id,
        _index: hit._index,
        _type: hit._type,
        _score: hit.score
      });
      return event.set(hit._source);
    });
  }

});

function testing() {
  window.collection = new speleo.group.Event();
  collection.fetch({ data: { query: { match_all: {} } } })
    .success(function(r) {
      collection.meta = new speleo.model.Meta({
        time:  r.took,
        total: r.hits.total,
        count: _.size(r.hits.hits),
        score: r.hits.max_score,
        valid: !r.timed_out
      });
    });
}


// ------------------------------------------------------------
// generic views
// ------------------------------------------------------------
Backbone.View.prototype.close = function() {
    if (this.cleanup) { this.cleanup(); }
    this.remove();
    this.unbind();
};

speleo.view.GenericModel = Backbone.View.extend({

  tagName: 'div',
  initialize: function() {
    _.bindAll(this);
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.close, this);
  },

  render: function() {
   this.$el.empty();
   this.$el.html(this.template(this.model.toJSON()))
   return this;
  },

  cleanup: function() {
    this.model.unbind('change', this.render);
    this.model.unbind('destroy', this.render);
  }
})

speleo.view.GenericGroup = Backbone.View.extend({

  tagName: 'ul',
  initialize: function() {
    _.bindAll(this);

    this._views = [];
    this.collection.each(this.append);
    this.collection.bind('add', this.append);
    this.collection.bind('remove', this.reject);
  },

  append: function(model) {
    var view = new this.childView({ model: model });
    this._views.push(view);
    if (this._rendered) {
      this.$el.append(view.render().el);
    }
  },

  reject: function(model) {
    var view = _.find(this._views, function(v) {
      return v.model === model;
    });
    this._views = _.without(this._views, view);
    view.close();
  },

  render: function() {
    var self  = this,
        elems = this.preRender ? this.preRender(this._views) : this._views;

    this.$el.empty();
    if (this.template) {
      this.$el.html(this.template());
    }
    _.each(elems, function(view) {
      self.$el.append(view.render().el);
    });
    this._rendered = true;
    return this;
  },

  cleanup: function() {
    this.collection.unbind('add', this.append);
    this.collection.unbind('remove', this.reject);
    _.each(this._views, function(view) { view.close(); });
  }

});


// ------------------------------------------------------------
// specific views
// ------------------------------------------------------------
speleo.view.BlockResult = speleo.view.GenericModel.extend({
  template: speleo.template['block/block'],
  events: {
    'click .block-close': 'close'
  }
});

speleo.view.StatisticResult = speleo.view.GenericModel.extend({
  template: speleo.template['block/statistic'],
  events: {
    'click .block-close': 'close'
  }
});

speleo.view.SimpleResult = speleo.view.GenericModel.extend({
  tagName: 'li',
  template: speleo.template['block/result/simple'],
  events: {
    'click .block-close': 'close'
  }
});

speleo.view.TopListResult = speleo.view.GenericGroup.extend({
  childView:speleo.view.SimpleResult,
  preRender: function(views) {
    return _.chain(views).sortBy(function(v) {
      return v.model.score;
    }).first(5).value();
  }
});

speleo.view.PagedListResult = speleo.view.GenericGroup.extend({
  childView:speleo.view.SimpleResult
});

function test_top_result() {
  var collection = new speleo.group.Event();
  collection.fetch({ data: { query: { match_all: {} } } })
    .success(function(response) {
      collection.meta.update(response);
      var view = new speleo.view.PagedListResult({ collection: collection });
      $('body').append(view.render().el);

      var meta = new speleo.view.BlockResult({ model: collection.meta });
      $('body').append(meta.render().el);
    });
}
