// ------------------------------------------------------------
// model
// ------------------------------------------------------------
var Account = Backbone.Model.extend({
  defaults: {
    valid : false,
    username: '',
    password: ''
  },
  localStorage : new Store('account')
  
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
    this.model = new Account({ id: 'speleo' });
    this.model.bind('change',  this.render);
    this.model.bind('destroy', this.render);
    this.navbar = new LoginBarView({ model: this.model });
    this.model.fetch();
  },

  render: function() {
    console.log(this.model);
    if (!this.model.get('valid')) {
      this.blinds();
    }
  },

  blinds: function() {
    var h = $(window).height(),
        w = $(window).width();
        c = {
        background: '#222',
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
    } else if (!pass) {
      this.passwordEl.parents('.control-group').addClass('error');
    } else {
      this.usernameEl.val(''),
      this.passwordEl.val('');
      this.login(user, pass);
    }
  },

  login: function(user, pass) {
    var self = this;
    this.$el.addClass(this.animation);
    this.blind.fadeOut(function() { self.$el.hide(); });
    this.model.set({ username: user, password: pass, valid: true, id: 'speleo' });
    this.model.save();
  }
});

// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.app = new LoginAppView();
});
