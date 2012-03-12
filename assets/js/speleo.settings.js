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

});


// ------------------------------------------------------------
// main
// ------------------------------------------------------------
var SettingsAppView = Backbone.View.extend({

  el: $('#settings-app'),
  indexEl: $('#setting-name'),
  settingsEl: $('#setting-index'),

  events: {
    'change #setting-name': 'changeSettings',
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
        $('<option></option>').attr("value", key).text(key)
          .appendTo(self.indexEl);
      });
    });
  },

  render: function(setting) {
    if (this.view) this.view.remove();
    this.view = new SettingsView({ model: setting });
    this.settingsEl.append(this.view.render().el);
  },

  changeSettings: function(e) {
    e.preventDefault();
    var name = $(e.target).val();
    if (!name || name === "null") return;

    Settings.each(function(setting) {
      setting.set('_active', false, { silent: true });
    });
    var setting = Settings.find(function(setting) {
      return setting.get('name') === name;
    });
    if (setting) { setting.set('_active', true); }
  }

});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.Settings = new SettingsCollection();
  window.app = new SettingsAppView();
});
