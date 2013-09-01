var HomeView = Jr.View.extend({
  templateUrl: 'src/template/home.html',
  // Simply render our HomeTemplate in the View's HTML
  render: function(){
    var template = TemplateCache.get(this.templateUrl);
    
    this.$el.html(template());
    this.afterRender();

    // Always return 'this' so Jr.Router can append your view to the body
    return this;
  },

  afterRender: function() {
    this.setUpCarousel();
  },

  setUpCarousel: function() {
    var after = function() {
      // Use the flickable plugin to setup our carousel with 3 segments
      this.$('.carousel-list').flickable({segments:3});
    };
    // We have to put this in a setTimeout so that it sets it up after the view is added to the DOM
    setTimeout(after,1);
  },

  events: {
    'click .show-more-button': 'onClickShowMoreButton',
    'onScroll .carousel-list': 'onScrollCarousel',
    'click .carousel-navigation li': 'onClickCarouselNavigationItem'
  },

  onClickShowMoreButton: function() {
    // Jr.Navigator works like Backbone.history.navigate, but it allows you to add an animation in the mix.
    Jr.Navigator.navigate('ratchet', {
      trigger: true
      // I have removed the animation as a POC
    });
    return false;
  },

  onScrollCarousel: function() {
    // Set the active dot when the user scrolls the carousel
    var index = this.$('.carousel-list').flickable('segment');
    this.$('.carousel-navigation li').removeClass('active');
    this.$('.carousel-navigation li[data-index="'+index+'"]').addClass('active');
  },

  onClickCarouselNavigationItem: function(e) {
    // Scroll the carousel when the user clicks on a dot.
    var index = $(e.currentTarget).attr('data-index');
    this.$('.carousel-list').flickable('segment',index);
  }

});

// ### RatchetView

var RatchetView = Jr.View.extend({
  templateUrl: 'src/template/ratchet.html',

  render: function(){
    var template = TemplateCache.get(this.templateUrl);
    this.$el.html(template());

    return this;
  },

  events: {
    'click .button-prev': 'onClickButtonPrev',
    'click .button-next': 'onClickButtonNext',
    'click .example-toggle': 'onClickExampleToggle'
  },

  onClickButtonPrev: function() {
    // Trigger the animation for the back button on the toolbar

    Jr.Navigator.navigate('home',{
      trigger: true,
      animation: {
        // This time slide to the right because we are going back
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.RIGHT
      }
    });
  },

  onClickButtonNext: function() {
    Jr.Navigator.navigate('pushstate',{
      trigger: true,
      animation: {
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.LEFT
      }
    });
  },

  onClickExampleToggle: function() {
    // Simple example of how the on/off toggle switch works.
    this.$('.example-toggle').toggleClass('active');
  }
});

// ## PushStateView

var PushStateView = Jr.View.extend({
  templateUrl: 'src/template/push-state.html',

  render: function() {
    var template = TemplateCache.get(this.templateUrl);
    this.$el.html(template());

    return this;
  },

  events: {
    'click .button-prev': 'onClickButtonPrev'
  },

  onClickButtonPrev: function() {
    Jr.Navigator.navigate('ratchet', {
      trigger: true,
      animation: {
        type: Jr.Navigator.animations.SLIDE_STACK,
        direction: Jr.Navigator.directions.RIGHT
      }
    });
  }

});

//## Routing to your Views
// Jr.Router is just like a Backbone.Router except we provide a renderView
// that will automatically add the view to the dom and do the animation if
// one is specified.  It will also automatically handle doing an opposite animation
// if the back button is pressed.
var AppRouter = Jr.Router.extend({
  routes: {
    'home': 'home',
    'ratchet': 'ratchet',
    'pushstate': 'pushstate'
  },

  home: function(){
    var homeView = new HomeView();
    this.renderView(homeView);
  },

  ratchet: function() {
    var ratchetView = new RatchetView();
    this.renderView(ratchetView);
  },

  pushstate: function() {
    var pushStateView = new PushStateView();
    this.renderView(pushStateView);
  }

});