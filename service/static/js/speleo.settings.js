/**
 * index settings
 *
 * index.number_of_replicas                        The number of replicas each shard has.
 * index.auto_expand_replicas                      Set to an actual value (like 0-all) or false to disable it.
 * index.blocks.read_only                          Set to true to have the index read only. false to allow writes.
 * index.refresh_interval                          The async refresh interval of a shard.
 * index.term_index_interval                       The Lucene index term interval. Only applies to newly created docs.
 * index.term_index_divisor                        The Lucene reader term index divisor.
 * index.translog.flush_threshold_ops              When to flush based on operations.
 * index.translog.flush_threshold_size             When to flush based on translog (bytes) size.
 * index.translog.flush_threshold_period           When to flush based on a period of not flushing.
 * index.translog.disable_flush                    Disables flushing. Note, should be set for a short interval and then enabled.
 * index.cache.filter.max_size                     The maximum size of filter cache (per segment in shard). Set to -1 to disable.
 * index.cache.filter.expire                       The expire after access time for filter cache. Set to -1 to disable.
 * index.gateway.snapshot_interval                 The gateway snapshot interval (only applies to shared gateways).
 * merge policy                                    All the settings for the merge policy currently configured. A different merge policy can’t be set.
 * index.routing.allocation.include.*              Controls which nodes the index will be allowed to be allocated on.
 * index.routing.allocation.exclude.*              Controls which nodes the index will not be allowed ot be allocated on.
 * index.routing.allocation.total_shards_per_node  Controls the total number of shards allowed to be allocated on a single node. Defaults to unbounded.
 * index.recovery.initial_shards                   When using local gateway a particular shard is recovered only if there can be allocated quorum
 *                                                 shards in the cluster. It can be set to quorum (default), quorum-1 (or half), full and full-1.
 *                                                 Number values are also supported, e.g. 1.
 * index.gc_deletes    
 */

/**
 * cluster settings
 *
 * cluster.blocks.read_only:                       Have the whole cluster read only (indices do not accept write operations), metadata
 *                                                 is not allowed to be modified (create or delete indices).
 * discovery.zen.minimum_master_nodes
 * indices.recovery.concurrent_streams
 * cluster.routing.allocation.node_initial_primaries_recoveries
 * cluster.routing.allocation.node_concurrent_recoveries
 * cluster.routing.allocation.cluster_concurrent_rebalance
 * cluster.routing.allocation.awareness.attributes
 * cluster.routing.allocation.awareness.force.*
 * cluster.routing.allocation.disable_allocation
 * cluster.routing.allocation.disable_replica_allocation
 * cluster.routing.allocation.include.*
 * cluster.routing.allocation.exclude.*
 * indices.cache.filter.size
 * indices.ttl.interval
 * indices.recovery.file_chunk_size,
 * indices.recovery.translog_ops,
 * indices.recovery.translog_size,
 * indices.recovery.compress,
 * indices.recovery.concurrent_streams,
 * indices.recovery.max_size_per_sec.
 * logger
 */

// ------------------------------------------------------------
// model
// ------------------------------------------------------------
var Setting = Backbone.Model.extend({
  defaults: {
    'name': '',
    '_active': false,
  },

  sync: function(m, m, o) {}
});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var SettingsCollection = Backbone.Collection.extend({
  model: Setting
});


// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var SettingsView = Backbone.View.extend({
  tagName: 'div',
  template: _.template($('#settings-template').html()),
  events: {
    'dblclick td span': 'editSetting',
    'keypress td.editing input': 'updateOnEnter',
    'blur td.editing input': 'updateSetting'
  },

  initailize: function(args) {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    var data = this.model.toJSON();
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  remove: function() {
    this.$el.remove();
  },

  editSetting: function(e) {
    var elem = $(e.target).parent(),
        text = elem.text();
    elem.addClass('editing');
    $('input', elem).val(text).focus();
  },

  updateOnEnter: function(e) {
    if (e.keyCode == 13) {
      this.updateSetting(e);
    }
  },

  updateSetting: function(e) {
    var elem = $(e.target).parent(),
        text = $('input', elem).val(),
        name = elem.siblings().text(),
        sett = Settings.find(function(s) {
               return s.get('name') === name;
        });
    elem.removeClass('editing');
    $('span', elem).text(text);
    if (sett) { sett.set(name, text); }
  },

});


// ------------------------------------------------------------
// main
// ------------------------------------------------------------
var SettingsAppView = Backbone.View.extend({

  el: $('#settings-app'),
  settingsEl: $('#setting-index'),
  clusterEl: $('#setting-cluster'),
  settingIdxEl: $('#setting-name'),
  clusterIdxEl: $('#cluster-name'),
  operationIdxEl: $('#operation-name'),

  events: {
    'change #setting-name': 'changeSettings',
    'change #operation-name': 'changeOperation',
    'change #cluster-name': 'changeOperation',
    'click  #operation-index a': 'indexOperation',
    'click  #operation-cluster a': 'clusterOperation',
  },

  initialize:function() {
    _.bindAll(this);
    Settings.bind('change', this.render);
    this.elastic = new ElasticSearch();
    this.initSettings();
  },

  initSettings:function() {
    var self = this;
    this.elastic.request("GET", "_settings", "", function(d,x) {
      _.each(_.keys(d), function(key) {
        Settings.create(_.extend({ name : key }, d[key]), { silent: true });
        $('<option/>').attr("value", key).text(key).appendTo(self.settingIdxEl);
        $('<option/>').attr("value", key).text(key).appendTo(self.operationIdxEl);
      });
    });

    this.elastic.request("GET", "_cluster/settings", "", function(d,x) {
      var setting = new Setting({ name: 'cluster', settings: d.transient });
      var view = new SettingsView({ model: setting });
      self.clusterEl.append(view.render().el);
    });

    this.elastic.request("GET", "_cluster/nodes", "", function(d,x) {
      _.each(_.keys(d.nodes), function(node) {
        $('<option/>').attr("value", node).text(d.nodes[node].name).appendTo(self.clusterIdxEl);
      });
    })
  },

  render: function(setting) {
    this.view = new SettingsView({ model: setting });
    var elem = this.view.render().$el.hide();
    this.settingsEl.append(elem);
    elem.slideDown();
  },

  changeOperation: function(e) {
    var elem = $(e.target),
        text = elem.val();
    if (text === "null") {
      elem.next().slideUp()
    } else {
      elem.next().slideDown()
    }
  },

  clusterOperation: function(e) {
    var elem = $(e.target),
        indx = '_cluster/nodes/' + this.clusterIdxEl.val(),
        meth = elem.data('method') || 'POST',
        quer = indx + '/' + elem.data('action') || '';

    this.elastic.request(meth, quer, '', function(d,x) {
      console.log(d);
    });
  },

  indexOperation: function(e) {
    var elem = $(e.target),
        indx = this.operationIdxEl.val(),
        meth = elem.data('method') || 'GET',
        quer = indx + '/' + elem.data('action') || '';

    this.elastic.request(meth, quer, '', function(d,x) {
      console.log(d);
    });
  },

  removeSetting: function() {
    var self  = this;
        defer = $.Deferred();

    if (this.view) {
     this.view.$el.slideUp(function(){
        self.view.remove();
        defer.resolve();
      });
    } else { defer.resolve(); }
    return defer;
  },

  changeSettings: function(e) {
    var name  = $(e.target).val(),
        defer = this.removeSetting();
    if (!name || name === "null") return;

    Settings.each(function(setting) {
      setting.set('_active', false, { silent: true });
    });
    var setting = Settings.find(function(setting) {
      return setting.get('name') === name;
    });

    if (setting) {
       defer.always(function() { setting.set('_active', true); });
    }
  }

});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.Settings = new SettingsCollection();
  window.app = new SettingsAppView();
});
