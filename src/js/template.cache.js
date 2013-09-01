// Template Cache
// --------------

// Manage templates stored in `<script>` blocks,
// caching them for faster access.
TemplateCache = function(templateSrc){
  this.templateSrc = templateSrc;
};

// TemplateCache object-level methods. Manage the template
// caches from these method calls instead of creating 
// your own TemplateCache instances
_.extend(TemplateCache, {
  templateCaches: {},

  warmUpCache: function (templateSrcs) {
    for (var i = 0; i < templateSrcs.length; i++) {
      this.get(templateSrcs[i]);  
    }
  },
  // Get the specified template by id. Either
  // retrieves the cached version, or loads it
  // from the DOM.
  get: function(templateSrc){
    var that = this;
    var cachedTemplate = this.templateCaches[templateSrc];

    if (!cachedTemplate){
      cachedTemplate = new TemplateCache(templateSrc);
      this.templateCaches[templateSrc] = cachedTemplate;
    }

    return cachedTemplate.load();
  },

  // Clear templates from the cache. If no arguments
  // are specified, clears all templates:
  // `clear()`
  //
  // If arguments are specified, clears each of the 
  // specified templates from the cache:
  // `clear("#t1", "#t2", "...")`
  clear: function(){
    var i;
    var length = arguments.length;

    if (length > 0){
      for(i=0; i<length; i++){
        delete this.templateCaches[arguments[i]];
      }
    } else {
      this.templateCaches = {};
    }
  }
});

// TemplateCache instance methods, allowing each
// template cache object to manage it's own state
// and know whether or not it has been loaded
_.extend(TemplateCache.prototype, {

  // Internal method to load the template asynchronously.
  load: function(){
    var that = this;

    // Guard clause to prevent loading this template more than once
    if (this.compiledTemplate){
      return this.compiledTemplate;
    }

    // Load the template and compile it
    var template = this.loadTemplate(this.templateSrc);
    this.compiledTemplate = this.compileTemplate(template);

    return this.compiledTemplate;
  },

  // Load a template from the AJAX, by default. Override
  // this method to provide your own template retrieval,
  // such as DOM loading.
  loadTemplate: function(templateSrc){
    $.ajax({
      url: templateSrc,
      method: 'GET',
      async: false,
      success: function (data) {
        template = data;
      }
    });

    if (!template || template.length === 0){
      var msg = "Could not find template: '" + templateSrc + "'";
      var err = new Error(msg);
      err.name = "NoTemplateError";
      throw err;
    }

    return template;
  },

  // Pre-compile the template before caching it. Override
  // this method if you do not need to pre-compile a template
  // (JST / RequireJS for example) or if you want to change
  // the template engine used (Handebars, etc).
  compileTemplate: function(rawTemplate){
    return _.template(rawTemplate);
  }
});