// ------------------------------------------------------------
// model
// ------------------------------------------------------------
var Account = Backbone.Model.extend({
  defaults: {
    valid : false,
    username: '',
    password: ''
  },

  sync: function(x, m, o) {}
});

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var LoginBarView = Backbone.View.extend({
  el: $('#nav-login'),
  template: _.template($('#nav-login-template').html()),
  events: {
    'click a': 'validate'
  },

  initialize: function() {
    _.bindAll(this);
    this.model.bind('change',  this.render);
    this.model.bind('destroy', this.render);
  },

  validate: function(e) {
    var action = $(e.target).data('action');
    if (action === 'logout') {
      this.model.set('valid', false);
      this.model.save();
    }
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()))
    return this;
  }
  
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var LoginAppView = Backbone.View.extend({
  el: $('#login-form'),
  usernameEl: $('#login-username'),
  passwordEl: $('#login-password'),
  events: {
    'click .btn': 'validate',
    'keypress .error input': 'toggleError'
  },

  initialize: function() {
    _.bindAll(this);
    this.animation = _.shuffle(['spin-out', 'stretch-out', 'flip-out'])[0];
    this.render();
  },

  render: function() {
    this.blinds();
  },

  blinds: function() {
    var h = $(window).height(),
        w = $(window).width();
        c = {
        background: "url('/static/img/page-cover.png')",
        height: h, width: w,
        'z-index': 1050,
        position:'fixed',
        top: 0, left: 0

    };
    this.blind = $('<div/>').css(c).appendTo('html');
    this.$el.removeClass(this.animation).fadeIn(1000);
  },

  toggleError: function(e) {
    $(e.target).parents('.error').removeClass('error');
  },

  validate: function(e) {
    e.preventDefault();
    var user = this.usernameEl.val(),
        pass = this.passwordEl.val();

    if (!user) {
      this.usernameEl.parents('.control-group').addClass('error');
      this.$el.effect('shake', { times: 3}, 100);
    } else if (!pass) {
      this.passwordEl.parents('.control-group').addClass('error');
      this.$el.effect('shake', { times: 3}, 100);
    } else {
      var self = this;
      this.$el.addClass(this.animation);
      _.delay(function() { self.$el.submit(); }, 1000);
    }
  }
});

// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.app = new LoginAppView();
});
