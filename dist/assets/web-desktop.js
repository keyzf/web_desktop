define('web-desktop/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'web-desktop/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('web-desktop/components/star-rating', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: 'span',
    classNames: ['star-rating'],
    stars: function () {
      var rating = this.get('content') || 0;
      var array = new Array(rating);
      return array;
    }.property('content')

  });

});
define('web-desktop/components/trash-can', ['exports', 'ember', 'web-desktop/mixins/drag-n-drop-view'], function (exports, Ember, DragDrop) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(DragDrop['default'].Droppable,{

    drop: function () {
      console.log('drop');
    },
    mouseEnter: function () {
      console.log('mouseEnter');
    }

  });

});
define('web-desktop/controllers/application', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({

	});

});
define('web-desktop/controllers/applist-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    
  });

});
define('web-desktop/controllers/applist', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;
  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Controller.extend({
    // itemController: 'applist-item',
    screenNum: 3,
    screens: [{ id: 0, hasApp: false},
    { id: 1, hasApp: false},
    { id: 2, hasApp: false}],

    appTouch: false,

    openApps: [],

    init: function () {
      this._super.apply(this, arguments);
      // this.setupOperator();
    },

    // setupOperator: function () {
    //   var i = 0;
    //   for (i = 0; i <= this.get('screenNum'); i++) {
    //     var name = 'screen_' + i;
    //     Ember.defineProperty(this, name, Ember.computed.filterBy('@this', 'screen', i));
    //   }
    // },

    appScreenChange: function () {
      var apps = this.get('content');
      var screens = this.get('screens');
      screens.forEach(function (scr) {
        var index = get(scr, 'id');
        var hasApp = apps.any(function (app) {

          return get(app, 'screen') === index;
        });
        set(scr, 'hasApp', hasApp);
      });
    }.observes('content.@each.screen'),

    actions: {
      showTrash: function (show) {
        this.set('appTouch', show);
      },
      openApp: function (item) { console.log(item);
        var name = get(item, 'name');

        var find = this.get('openApps').any(function (it) {
          return get(it, 'name') === name;
        });

        if (!find) {
          var viewType = 'app.' + get(item, 'viewName');
          var klass = this.container.lookupFactory('view:' + viewType);
          var length = this.get('openApps').length;
          var top = 150 + 20 * length;
          var left = 350 + 20 * length;
          if (klass) {
            var instant = klass.create({
              top: top,
              left: left,
              content:    item,
              parentView: this,
              container:  this.container
            }).appendTo('body');
            this.get('openApps').pushObject({name: name, instant: instant});
          }
        }
      },

      closeApp: function (item) {
        var name = get(item, 'name');
        var obj = this.get('openApps').filter(function (it) {
          return get(it, 'name') === name;
        });
        //
        var instant = get(obj[0], 'instant');
        if (instant) {
          this.get('openApps').removeObject(obj[0]);
          instant.destroy();
        }

        var mostTopApp = null;
        var mostTopZindex = -1;
        this.get('openApps').forEach(function (app) {
          var instant = app.instant;
          var zindex = parseInt(Ember['default'].$(instant.get('element')).css("z-index"));
          if (zindex > mostTopZindex) {
            mostTopZindex = zindex;
            mostTopApp = instant;
          }
        });
        if (mostTopApp) {
          mostTopApp.changeZindex();
        }
      },

      addApp: function (content) {
        var screen = 0;
        var col = 0;
        var row = 0;

        var tmp = [];
        var tmp1 = [];

        var apps  = this.get('model');
        var screenFilter = function (app) {
          return get(app, 'screen') === screen;
        };
        var colFilter = function (app) {
          return get(app, 'col') === col;
        };
        var rowFilter = function (app) {
          return get(app, 'row') === row;
        };

        for (screen = 0; screen < 3; screen ++) {
          tmp = apps.filter(screenFilter);
          if (tmp.length < 20) {
            break;
          }
        }
        for (col = 0; col < 4; col ++) {
          tmp1 = tmp.filter(colFilter);
          if (tmp1.length < 5) {
            break;
          }
        }
        for (row = 0; row < 5; row ++) {
          var find = tmp1.any(rowFilter);
          if (!find) {
            break;
          }
        }

        apps.pushObject(
          Ember['default'].$.extend({
            screen: screen,
            col: col,
            row: row
          }, content));
      },

      deleteApp: function (/*item*/) { // TBD
        console.log('deleteApp');
      },

      moveImage: function (key) {

        console.log('moveImage' + key);
      },

      activateWindow: function (/*content*/) {
        console.log('activateWindow');
      }

    }
  });

});
define('web-desktop/controllers/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    dock: []
  });

});
define('web-desktop/controllers/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    resultDivHeight: 0
  });

});
define('web-desktop/initializers/export-application-global', ['exports', 'ember', 'web-desktop/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('web-desktop/mixins/drag-n-drop-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Drag = Ember['default'].Namespace.create({});

  Drag.cancel = function (event) {
    event.preventDefault();
    return false;
  };

  Drag.Draggable = Ember['default'].Mixin.create({
    attributeBindings: 'draggable',
    draggable: 'true',
    dragStart: function (evt) {
      /* firefox will only allow dragStart if it has data */
      evt.originalEvent.dataTransfer.setData('text/plain', 'DRAGGABLE');
    }
  });

  Drag.Droppable = Ember['default'].Mixin.create({
    placeholder: null,
    dragEnter: Drag.cancel,
  //  dragOver: Drag.cancel,
    drop: function (event) {
      event.preventDefault();
      return false;
    }
  });

  exports['default'] = Drag;

});
define('web-desktop/mixins/window-view', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    classNames: ['window', 'windows-vis', 'fadeIn', 'fadeIn-20ms'],
    classNameBindings: ['active'],
    active: true,
    width: 950,
    height: 600,
    left: 0,
    top: 0,
    layoutName: 'window',
    isFullSize: false,

    changeZindex: function () {
      var zindex = -1;
      Ember['default'].$('.window').each(function () {
        var z = parseInt(Ember['default'].$(this).css('z-index'));
        if (z > zindex) {
          zindex = z;
        }
        Ember['default'].$(this).removeClass('active');
      });

      this.$().css('z-index', zindex + 1);
      this.$().addClass('active');
    },

    mouseDown: function () {
      this.changeZindex();
    },

    // click: function () {
    //   this.get('parentView').send('activateWindow', this.get('content'));
    // },

    didInsertElement: function () {
      this.changeZindex();
      this.$().css({
        width: this.get('width'),
        height: this.get('height'),
        left: this.get('left'),
        top: this.get('top')
      });
      this.$().resizable();
      this.$('.header').on('mousedown', function (event) {
        if (event.which !== 1) { return ;}
        var originEvt = event.originalEvent;
        var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
        var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

        this.$(document).on('mousemove', function (event) {
          var originEvt = event.originalEvent;
          var x = originEvt.clientX - offsetX;
          var y = originEvt.clientY - offsetY;
          this.$().css({ // image follow
            'top': y,
            'left': x
          });
          this.setProperties({
            top: y,
            left: x
          });
        }.bind(this));

      }.bind(this)).on('dblclick', function () {
        this._actions['maximizeApp'].apply(this);
      }.bind(this));

      this.$('.header').on('mouseup', function () {console.log('mixin -  mouseup');
        this.$(document).off('mousemove');
      }.bind(this));

    },

    willDestroyElement: function () {
      this.$('.header').off('mousedown').off('dblclick');
      this.$('.header').off('mouseup');
    },

    actions: {
      maximizeApp: function () {
        if (this.get('isFullSize')) {
          this.$().animate({ // image follow
            'top': this.get('top'),
            'left': this.get('left'),
            'width': this.get('width'),
            'height': this.get('height')
          });
        } else {
          this.$().animate({ // image follow
            'top': 45,
            'left': 0,
            'width': '100%',
            'height': '100%'
          });
        }
        this.toggleProperty('isFullSize');
      },

      minimizeApp: function () {
        //TBD
      }
    }

  });

});
define('web-desktop/router', ['exports', 'ember', 'web-desktop/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function() {
    this.route('application', { path: '/' });
  });

  Router.reopen({
    rootURL: '/'
  });

  exports['default'] = Router;

});
define('web-desktop/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;
  exports['default'] = Ember['default'].Route.extend({

    model: function () {
      return {
        applist:[
  // {
  //   name: "Deliver Bid",
  //   icon: "img/DeliverBid_logo.png",
  //   viewName: 'deliverBid',
  //   screen: 0,
  //   col: 0,
  //   row: 0
  // }, {
  //   name: "E-Inventory",
  //   icon: "img/Einventory_logo.png",
  //   viewName: 'Einventory',
  //   screen: 0,
  //   col: 0,
  //   row: 2
  // }, {
  //   name: "Vender Match",
  //   icon: "img/VenderMatch_logo.png",
  //   viewName: 'vendorMatch',
  //   screen: 0,
  //   col: 0,
  //   row: 1
  // },
  {
    name: "Gausian Store",
    icon: "img/icon_17.png",
    viewName: 'gausianStore',
    screen: 0,
    col: 0,
    row: 0
  },
  //
  //       {name: "icon_11", icon: "img/icon_11", screen: 0, col: 1, row: 2},
  //       {name: "icon_12", icon: "img/icon_12", screen: 0, col: 2, row: 2},
  //       {name: "icon_13", icon: "img/icon_13", screen: 0, col: 3, row: 2},
  //       {name: "icon_14", icon: "img/icon_14", screen: 0, col: 1, row: 3},
  //       {name: "icon_15", icon: "img/icon_15", screen: 0, col: 2, row: 3},
  //       {name: "icon_16", icon: "img/icon_16", screen: 0, col: 3, row: 3},
  //       {name: "icon_13", icon: "img/icon_13", screen: 0, col: 3, row: 4},
  //       {name: "icon_14", icon: "img/icon_14", screen: 0, col: 2, row: 4},
  //       {name: "icon_15", icon: "img/icon_15", screen: 0, col: 1, row: 4},
  //       {name: "icon_16", icon: "img/icon_16", screen: 0, col: 0, row: 4},
        // {name: "icon_21", icon: "img/icon_1", screen: 1, col: 11, row: 0},
        // {name: "icon_22", icon: "img/icon_2", screen: 1, col: 12, row: 0},
        // {name: "icon_23", icon: "img/icon_3", screen: 1, col: 13, row: 0},
        // {name: "icon_24", icon: "img/icon_4", screen: 1, col: 14, row: 0},
        // {name: "icon_25", icon: "img/icon_5", screen: 1, col: 15, row: 1},
        // {name: "icon_27", icon: "img/icon_7", screen: 1, col: 16, row: 1},
        // {name: "icon_28", icon: "img/icon_8", screen: 1, col: 11, row: 1},
        // {name: "icon_29", icon: "img/icon_9", screen: 1, col: 12, row: 2},
        // {name: "icon_211", icon: "img/icon_11", screen: 1, col: 13, row: 2},
        // {name: "icon_212", icon: "img/icon_12", screen: 1, col: 14, row: 2},
        // {name: "icon_213", icon: "img/icon_13", screen: 1, col: 15, row: 2},
        // {name: "icon_214", icon: "img/icon_14", screen: 1, col: 16, row: 2},
        // {name: "icon_215", icon: "img/icon_15", screen: 1, col: 1, row: 3},
        // {name: "icon_216", icon: "img/icon_16.png", screen: 1, col: 3, row: 3},
        // {name: "icon_31", icon: "img/icon_1", screen: 2, col: 0, row: 1},
        // {name: "icon_32", icon: "img/icon_2", screen: 2, col: 1, row: 1},
        // {name: "icon_33", icon: "img/icon_3", screen: 2, col: 2, row: 1},
        // {name: "icon_34", icon: "img/icon_4", screen: 2, col: 3, row: 1},
        // {name: "icon_35", icon: "img/icon_5", screen: 2, col: 0, row: 0},
        // {name: "icon_36", icon: "img/icon_6", screen: 2, col: 1, row: 0},
        // {name: "icon_38", icon: "img/icon_8", screen: 2, col: 3, row: 0},
        // {name: "icon_39", icon: "img/icon_9", screen: 2, col: 0, row: 2},
        // {name: "icon_311", icon: "img/icon_11", screen: 2, col: 1, row: 2},
        // {name: "icon_312", icon: "img/icon_12", screen: 2, col: 2, row: 2},
        // {name: "icon_313", icon: "img/icon_13", screen: 2, col: 3, row: 2},
        // {name: "icon_317", icon: "img/icon_17.png", screen: 2, col: 0, row: 3},
        ]
      };
    },

    setupController: function (controller, model) {
      this.controllerFor('applist').set('model', get(model, 'applist'));
    },

    renderTemplate: function() {
      this.render();
      this.render('applist', {
        outlet: 'applist',
        into: 'application'
      });
    },

    actions: {
      appMoving: function () {
        this.set('controller.appMoving', true);
      },
      appStop: function () {
        this.set('controller.appMoving', false);
      },
      installApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['addApp'].apply(ctrl, arguments);
      },
      openApp: function (content) {
        var ctrl = this.controllerFor('applist');
        ctrl._actions['openApp'].apply(ctrl, arguments);
      }
    }
  });

});
define('web-desktop/templates/app/customer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<iframe ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.content.url")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\"></iframe>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/app/deliver-bid', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.logoUrl")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\">\n<img src=\"img/spinnerSmall.gif\" class='spinner' style=\"top:270px; left:37px\">\n");
    return buffer;
    
  });

});
define('web-desktop/templates/app/einventory', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.logoUrl")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\">\n<img src=\"img/spinnerSmall.gif\" class='spinner' style=\"top:270px; left:37px\">\n");
    return buffer;
    
  });

});
define('web-desktop/templates/app/vendor-match', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.logoUrl")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" width=\"100%\" height=\"100%\">\n<img src=\"img/spinnerSmall.gif\" class='spinner' style=\"top:270px; left:37px\">\n");
    return buffer;
    
  });

});
define('web-desktop/templates/appicon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"effect fadeIn fadeIn-50ms fadeIn-Delay-100ms\"></div>\n<div class=\"app-edge fadeIn fadeIn-50ms fadeIn-Delay-100ms\"></div>\n<div class=\"app-img fadeIn fadeIn-50ms fadeIn-Delay-100ms\"></div>\n<div class=\"app-text fadeIn fadeIn-50ms fadeIn-Delay-100ms\">");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("</div>");
    return buffer;
    
  });

});
define('web-desktop/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n");
    data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "header", options) : helperMissing.call(depth0, "render", "header", options))));
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "searchBar", options) : helperMissing.call(depth0, "render", "searchBar", options))));
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "trash-can", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    data.buffer.push("<!-- DESKTOP -->\n\n");
    stack1 = helpers.unless.call(depth0, "controller.appMoving", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "applist", options) : helperMissing.call(depth0, "outlet", "applist", options))));
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "controller.appMoving", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<div class=\"top-corner-logo\">\n  <img src=\"assets/img/GAUSIAN_logo.png\" >\n</div>\n\n<svg version=\"1.1\" xmlns='http://www.w3.org/2000/svg'>\n  <filter id='blur'>\n    <feGaussianBlur stdDeviation='6' />\n  </filter>\n</svg>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/applist', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "appscreen", {hash:{
      'index': ("id"),
      'hasApp': ("hasApp")
    },hashTypes:{'index': "ID",'hasApp': "ID"},hashContexts:{'index': depth0,'hasApp': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n  ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "appicon", {hash:{
      'content': ("app")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n    ");
    return buffer;
    }

    data.buffer.push("\n\n\n  ");
    stack1 = helpers.each.call(depth0, "view.controller.screens", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  <ul>\n    ");
    stack1 = helpers.each.call(depth0, "app", "in", "view.controller.model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/appscreen', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("\n");
    
  });

});
define('web-desktop/templates/components/star-rating', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n  <i class=\"fa fa-star\"></i>\n");
    }

    stack1 = helpers.each.call(depth0, "stars", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('web-desktop/templates/components/trash-can', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("\n<div class=\"trash fadeIn fadeIn-50ms fadeIn-Delay-150ms\">Delete this APP</div>\n");
    
  });

});
define('web-desktop/templates/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<ul class=\"nav fadeIn fadeIn-50ms fadeOut fadeOut-50ms\">\n  <li class=\"logo fadeIn fadeIn-50ms\">\n    <span>Your Enterprise Name Here</span>\n  </li>\n  <li class=\"dock fadeIn fadeIn-50ms\">\n\n  </li>\n  <li class=\"login fadeIn fadeIn-50ms\">\n    <span>\n      <a>Sign up</a> / <a>Log in</a>\n    </span>\n  </li>\n</ul>\n");
    
  });

});
define('web-desktop/templates/scroll-bar-handler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"jspDrag\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.style")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  <div class=\"jspDragTop\"></div>\n  <div class=\"jspDragBottom\"></div>\n</div>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/scroll-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"jspCap jspCapTop\"></div>\n<div class=\"jspTrack\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("view.trackStyle")
    },hashTypes:{'style': "STRING"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-bar-handler", {hash:{
      'len': ("view.handlerLen"),
      'top': ("view.handlerTop")
    },hashTypes:{'len': "ID",'top': "ID"},hashContexts:{'len': depth0,'top': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n</div>\n<div class=\"jspCap jspCapBottom\"></div>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"search fadeIn fadeIn-50ms fadeIn-Delay-50ms\">\n  <div class=\"search-icon\"></div>\n  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'placeholder': ("Search APP or Content"),
      'disabled': (true)
    },hashTypes:{'type': "STRING",'placeholder': "STRING",'disabled': "BOOLEAN"},hashContexts:{'type': depth0,'placeholder': depth0,'disabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n</div>\n\n<div class=\"overlay\">\n  <div class=\"modal fadeIn fadeIn-50ms\">\n    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("view.query")
    },hashTypes:{'type': "STRING",'value': "ID"},hashContexts:{'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n    <a class=\"cancel_search\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">Cancel</a>\n    <div class=\"container\">\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "search-results", {hash:{
      'content': ("view.searchContent")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-bar", {hash:{
      'trackLen': ("view.trackLen"),
      'handlerLen': ("view.handlerLen"),
      'handlerTop': ("view.handlerTop")
    },hashTypes:{'trackLen': "ID",'handlerLen': "ID",'handlerTop': "ID"},hashContexts:{'trackLen': depth0,'handlerLen': depth0,'handlerTop': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('web-desktop/templates/search-results-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n<a class=\"action open\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "openApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</a>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n<a class=\"action get\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "installApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</a>\n");
    return buffer;
    }

    data.buffer.push("<div class=\"icon\">\n  <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("view.content.icon")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" />\n</div>\n<div class=\"detail\">\n  <a class=\"name\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n  <a class=\"star-rating\"> ");
    data.buffer.push(escapeExpression((helper = helpers['star-rating'] || (depth0 && depth0['star-rating']),options={hash:{
      'content': ("view.content.rating")
    },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "star-rating", options))));
    data.buffer.push(" </a>\n  <a class=\"category\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.category", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n  <a class=\"price\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.freeDay", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" days free trail, $");
    stack1 = helpers._triageMustache.call(depth0, "view.content.price", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" /month</a>\n</div>\n");
    stack1 = helpers['if'].call(depth0, "view.content.installed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('web-desktop/templates/window', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"header\">\n  <span class=\"titleInside\">");
    stack1 = helpers._triageMustache.call(depth0, "view.content.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n</div>\n<nav class=\"control-window\">\n  <a href=\"#\" class=\"minimize\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "minimizeApp", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">&nbsp;</a>\n  <a href=\"#\" class=\"maximize\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "maximizeApp", {hash:{
      'target': ("view")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">maximize</a>\n  <a href=\"#\" class=\"close\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "closeApp", "view.content", {hash:{
      'target': ("view.parentView")
    },hashTypes:{'target': "ID"},hashContexts:{'target': depth0},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">close</a>\n</nav>\n<div class=\"container\">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('web-desktop/tests/helpers/resolver', ['exports', 'ember/resolver', 'web-desktop/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('web-desktop/tests/helpers/start-app', ['exports', 'ember', 'web-desktop/app', 'web-desktop/router', 'web-desktop/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';

  function startApp(attrs) {
    var App;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Router['default'].reopen({
      location: 'none'
    });

    Ember['default'].run(function() {
      App = Application['default'].create(attributes);
      App.setupForTesting();
      App.injectTestHelpers();
    });

    App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

    return App;
  }
  exports['default'] = startApp;

});
define('web-desktop/tests/test-helper', ['web-desktop/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

  'use strict';

  ember_qunit.setResolver(resolver['default']);

  document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

  QUnit.config.urlConfig.push({ id: 'nocontainer', label: 'Hide container'});
  var containerVisibility = QUnit.urlParams.nocontainer ? 'hidden' : 'visible';
  document.getElementById('ember-testing-container').style.visibility = containerVisibility;

});
define('web-desktop/utils/keys', ['exports'], function (exports) {

  'use strict';

  /**
  * Created by Jordan Hawker (hawkerj)
  * Date: 9/9/2014
  */

  var keyUtils = {
    KEYS: {
      BACKSPACE: 8,
      TAB: 9,
      ENTER: 13,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAUSE: 19,
      CAPS_LOCK: 20,
      ESCAPE: 27,
      UNIT_SEPARATOR: 31, // non-printable character
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      INSERT: 45,
      DELETE: 46,
      KEY_0: 48,
      KEY_1: 49,
      KEY_2: 50,
      KEY_3: 51,
      KEY_4: 52,
      KEY_5: 53,
      KEY_6: 54,
      KEY_7: 55,
      KEY_8: 56,
      KEY_9: 57,
      KEY_A: 65,
      KEY_B: 66,
      KEY_C: 67,
      KEY_D: 68,
      KEY_E: 69,
      KEY_F: 70,
      KEY_G: 71,
      KEY_H: 72,
      KEY_I: 73,
      KEY_J: 74,
      KEY_K: 75,
      KEY_L: 76,
      KEY_M: 77,
      KEY_N: 78,
      KEY_O: 79,
      KEY_P: 80,
      KEY_Q: 81,
      KEY_R: 82,
      KEY_S: 83,
      KEY_T: 84,
      KEY_U: 85,
      KEY_V: 86,
      KEY_W: 87,
      KEY_X: 88,
      KEY_Y: 89,
      KEY_Z: 90,
      LEFT_META: 91,
      RIGHT_META: 92,
      SELECT: 93,
      NUMPAD_0: 96,
      NUMPAD_1: 97,
      NUMPAD_2: 98,
      NUMPAD_3: 99,
      NUMPAD_4: 100,
      NUMPAD_5: 101,
      NUMPAD_6: 102,
      NUMPAD_7: 103,
      NUMPAD_8: 104,
      NUMPAD_9: 105,
      MULTIPLY: 106,
      ADD: 107,
      SUBTRACT: 109,
      DECIMAL: 110,
      DIVIDE: 111,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      NUM_LOCK: 144,
      SCROLL_LOCK: 145,
      SEMICOLON: 186,
      EQUALS: 187,
      COMMA: 188,
      DASH: 189,
      PERIOD: 190,
      FORWARD_SLASH: 191,
      GRAVE_ACCENT: 192,
      OPEN_BRACKET: 219,
      BACK_SLASH: 220,
      CLOSE_BRACKET: 221,
      SINGLE_QUOTE: 222
    },

    isNumberKey: function (keyCode) {
      return (keyCode > 47 && keyCode < 58); // Number keys
    }
  };

  if (Object.freeze) {
    Object.freeze(keyUtils.KEYS);
  }

  exports['default'] = keyUtils;

});
define('web-desktop/views/app/customer', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {
    templateName: 'app/customer'
  });

});
define('web-desktop/views/app/deliver-bid', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/deliver-bid',
    finalIndex: 5,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {
      console.log('onImageChange');

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/DeliverBid_%@.jpg'.fmt(index));
      if (index === 1 || index === 4) {
        this.$('img.spinner').show();
        Ember['default'].run.later(function () {
          this.set('index', index + 1);
          this.$('img.spinner').hide();
        }.bind(this), 600);
      }

    }.observes('index')

  });

});
define('web-desktop/views/app/einventory', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/einventory',
    finalIndex: 3,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {
      console.log('onImageChange');

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/VenderMatch_%@.jpg'.fmt(index));
      // if (index < this.get('finalIndex')) {
      //   this.$('img.spinner').show();
      //   Ember.run.later(function () {
      //     this.set('index', index + 1);
      //     this.$('img.spinner').hide();
      //   }.bind(this), 600);
      // }



    }.observes('index')

  });

});
define('web-desktop/views/app/gausian-store', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/deliver-bid',
    finalIndex: 4,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/Gausian_Store_%@.jpg'.fmt(index));
      // if (index < this.get('finalIndex')) {
      //   this.$('img.spinner').show();
      //   Ember.run.later(function () {
      //     this.set('index', index + 1);
      //     this.$('img.spinner').hide();
      //   }.bind(this), 600);
      // }



    }.observes('index')

  });

});
define('web-desktop/views/app/vendor-match', ['exports', 'ember', 'web-desktop/mixins/window-view'], function (exports, Ember, WindowMixin) {

  'use strict';

  exports['default'] = Ember['default'].View.extend(WindowMixin['default'], {

    layoutName: 'window',
    templateName: 'app/deliver-bid',
    finalIndex: 3,

    didInsertElement: function () {
      this._super();
      this.set('index', 1);
      this.$('img:first').on('mousedown', function () {
        var index = this.get('index');

        index = index === this.get('finalIndex') ? 1 : index + 1;

        this.set('index', index);
      }.bind(this));
    },

    onImageChange: function () {

      var index = this.get('index');

      this.set('logoUrl', 'img/pictures_for_apps/Einventory_%@.jpg'.fmt(index));
      // if (index < this.get('finalIndex')) {
      //   this.$('img.spinner').show();
      //   Ember.run.later(function () {
      //     this.set('index', index + 1);
      //     this.$('img.spinner').hide();
      //   }.bind(this), 600);
      // }



    }.observes('index')

  });

});
define('web-desktop/views/appicon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    tagName: 'li',
    templateName: 'appicon',
    attributeBindings : [ 'draggable' ],
    draggable         : 'true',


    row: function () {
      return this.get('content.row');
    }.property('content.row'),

    col: function () {
      return this.get('content.col');
    }.property('content.col'),

    scr: function () {
      return this.get('content.screen');
    }.property('content.screen'),

    iconWidth: function () {
      return this.get('parentView.iconWidth');
    }.property('parentView.iconWidth'),


    parentWidth: function () {
      return this.get('parentView.screenWidth');
    }.property('parentView.screenWidth'),

    parentHeight: function () {
      return this.get('parentView.screenHeight');
    }.property('parentView.screenHeight'),

    onIconSizeChange: function () {
      this.handleSize();
      this.position();
    }.observes('iconWidth', 'parentWidth','parentHeight'),

    didInsertElement: function () {
      this.$().draggable();
      this.handleSize();
      this.position();
    },

    handleSize: function () {
      var iconWidth = this.get('iconWidth');

      this.$('span').css({
        'top': iconWidth + 5 * iconWidth / 60,
        'font-size': 12 + Math.round(iconWidth / 60)
      });

      this.$().css({
        'height': iconWidth,
        'width':  iconWidth,
        'display': 'inline-block',
        'float': 'left'
      });
      this.$('.app-img').css({
        'background': 'url(' + this.get('content.icon') + ') no-repeat',
        "background-size": "100%"
      });
    },


    position: function (row, col, scr, duration) {
      row = !Ember['default'].isEmpty(row) ? row : this.get('row');
      col = !Ember['default'].isEmpty(col) ? col : this.get('col');
      scr = !Ember['default'].isEmpty(scr) ? scr : this.get('scr');
      var iconWidth = this.get('iconWidth');
      var iconHeight = this.get('parentView.iconHeight');
      var offsetHeight = this.get('parentView.offsetHeight');
      var offsetWidth  = this.get('parentView.offsetWidth');

      var screnWidth = this.get('parentView.screenWidth');
      var widthOffset = this.get('parentView.widthOffset');
      var screenLeft = scr * (screnWidth + widthOffset) + widthOffset;

      var top  = (iconHeight + offsetHeight) * row + offsetHeight;
      var left = (iconWidth + offsetWidth) * col + offsetWidth + screenLeft;

      if (duration) {
        this.$().animate({
          'top': top,
          'left': left
        }, duration);
      } else {
        this.$().css({
          'top': top,
          'left': left
        });
      }
      this.setProperties({
        'content.row': row,
        'content.col': col,
        'content.screen': scr
      });
    },

    mouseDown: function (event) {
      var originEvt = event.originalEvent;
      var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
      var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

      this.$().addClass('dragging');
      this.get('parentView').onMouseDown(this, offsetX, offsetY);
    },

    mouseUp: function (evt) {
      this.$().removeClass('dragging');
      return true;
    }

  });

});
define('web-desktop/views/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['application']
  });

});
define('web-desktop/views/applist', ['exports', 'ember', 'web-desktop/utils/keys'], function (exports, Ember, keyUtils) {

  'use strict';

  var KEYS = keyUtils['default'].KEYS;
  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    templateName: 'applist',
    classNames: ['applist'],

    height: 600,
    width: 400,

    left: 89,
    top: 103,

    init: function () {
      this._super();
      this.handleSize();
      Ember['default'].$(window).resize(function() {
        this.handleSize();
      }.bind(this));
    },

    didInsertElement: function () {
      this.handleSize();
    },

    handleSize: function () {

      var minWidthIcon = 48;
      var minHeightWin = 600;
      var minWidthWin = 800;
      var winWidth  = Math.max(Ember['default'].$(window).width(), minWidthWin);
      var winHeight = Math.max(Ember['default'].$(window).height()*0.85, minHeightWin);

      var height = (winHeight) * 0.9;
      var width = winWidth / 3 * 0.86 ;
      var widthOffset = (winWidth - 3 * (width)) / 4;

      var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
      var iconHeight = iconWidth * 4 / 3;

      var offsetWidth  = (width - iconWidth * 4) / 5;
      var offsetHeight = (height - iconHeight * 5) / 6;

      this.setProperties({
        screenWidth:  width,
        screenHeight: height,
        screenTop:    0,
        widthOffset:  widthOffset,
        iconWidth:    iconWidth,
        iconHeight:   iconHeight,
        offsetHeight: offsetHeight,
        offsetWidth:  offsetWidth
      });
    },

    getScreenRowCol: function (left, top) {
      var offsetWidth = this.get('offsetWidth');
      var offsetHeight = this.get('offsetHeight');
      var screenWidth = this.get('screenWidth');
      var widthOffset = this.get('widthOffset');
      var screenLeft = screenWidth + widthOffset + 10;

      var newScr = 0;
      for (var i = 0 ; i < 3; i++) {
        if (left >= screenLeft * i + widthOffset && left < screenLeft * (i + 1) + widthOffset) {
          newScr = i;
        }
      }

      var newCol = Math.round((left - offsetWidth/2 - newScr * screenLeft - widthOffset) * 4 / screenWidth);
      var newRow = Math.round((top - offsetHeight/2) * 5 / this.get('screenHeight'));

      newCol = newCol < 0 ? 0: newCol;
      newCol = newCol > 3 ? 3: newCol;
      return {row: newRow, col: newCol, scr: newScr};
    },

    onMouseDown: function (app, offsetX, offsetY) { // this will be called by item
      this.setProperties({
        'activeApp': app,
        'offsetX': offsetX,
        'offsetY': offsetY
      });

      this.$(document).on('mousemove', this.onMouseMove.bind(this));
      this.on('mouseUp', this.onMouseRelease);
      //this.on('mouseLeave', this.onMouseRelease);
    },

    onMouseMove: function (event) {
      this.get('controller').send('appMoving');
      this.set('appTouch', true);
      var node = this.get('activeApp');
      var originEvt = event.originalEvent;
      var offset = node.$().parent().offset(); // TBD
      var x = originEvt.clientX - this.get('offsetX') - offset.left;
      var y = originEvt.clientY - this.get('offsetY') - offset.top;
      node.$().css({ // image follow
        'top': y,
        'left': x,
        'z-index': '100'
      });
      var rowCol = this.getScreenRowCol(x, y);
      if (node.get('row') !== rowCol.row ||
          node.get('col') !== rowCol.col ||
          node.get('scr') !== rowCol.scr) {
        this.shuffle({
          row: node.get('row'),
          col: node.get('col'),
          scr: node.get('scr')
        }, rowCol);
      }
    },

    onMouseRelease: function () {
      var node = this.get('activeApp');
      node.$().removeClass('dragging');
      this.$(document).off('mousemove');
      this.off('mouseUp', this.onMouseRelease);
      // this.off('mouseLeave', this.onMouseRelease);
      node.position(node.get('row'), node.get('col'), node.get('scr'), 300);

      node.$().css({
        'z-index': 1
      });
      if (!this.get('appTouch')) {
        this.get('controller').send('openApp', node.get('content'));
      }
      this.set('appTouch', false);
      this.get('controller').send('appStop');
    },

    shuffle: function (from, to) {  // TBD add screen constrain
      console.log(JSON.stringify(from) + ' -> ' + JSON.stringify(to));
      var isSamePosition = function (pos1, pos2) {
        return get(pos1, 'col') === get(pos2, 'col') &&
        get(pos1, 'row') === get(pos2, 'row') &&
        get(pos1, 'scr') === get(pos2, 'scr');
      }
      this.get('childViews').forEach(function (itemView) {
        if (isSamePosition(itemView, to)) { // swap
          console.log(from);
          itemView.position(get(from, 'row'), get(from, 'col'), get(from, 'scr'), 200);
        } else if (isSamePosition(itemView, from)) { // target
          itemView.setProperties({
            col: get(to, 'col'),
            row: get(to, 'row'),
            scr: get(to, 'scr')
          });
        }
      });
    },



  });

});
define('web-desktop/views/appscreen', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    // templateName: 'appscreen',
    classNames: ['appscreen', 'appscreen-set', 'dropzone', 'fadeIn', 'fadeIn-50ms','fadeIn-Delay-50ms'],
    classNameBindings: ['appTouch:background', 'hasApp'],
    appTouch: false,
    hasApp: false,

    init: function () {
      this._super();
      Ember['default'].$(window).resize(function() {
        this.handleSize();
      }.bind(this));
    },

    handleSize: function () {
      var index = this.get('index') || 0;
      var width = this.get('parentView.screenWidth');
      var widthOffset = this.get('parentView.widthOffset');
      var left = index * (width + widthOffset) + widthOffset;
      this.$().css({
        top: this.get('parentView.screenTop'),
        left: left,
        width: width,
        height: this.get('parentView.screenHeight')
      });
    }.on('didInsertElement')


  });

});
define('web-desktop/views/backup', ['exports', 'ember', 'web-desktop/utils/keys'], function (exports, Ember, keyUtils) {

  'use strict';

  var KEYS = keyUtils['default'].KEYS;
  var get = Ember['default'].get;

  exports['default'] = Ember['default'].CollectionView.extend({
    // templateName: 'appscreen',
    classNames: ['appscreen', 'appscreen-set', 'dropzone'],
    classNameBindings: ['appTouch:background'],
    appTouch: false,
    contentBinding: 'controller',
    tagName: 'ul',
    height: 600,
    width: 400,

    left: 89,
    top: 103,

    itemViewClass: 'appicon',

    activeApp: null,

    init: function () {
      this._super();
      Ember['default'].$(window).resize(function() {

        this.handleSize();
      }.bind(this));
    },

    didInsertElement: function () {
      this.handleSize();
      Ember['default'].$(document).on('keyup.applist', this.onKeyUp.bind(this));
    },

    onKeyUp: function (evt) {
      // key event 27 is the escape key
      if (evt.which === KEYS.LEFT_ARROW || evt.which === KEYS.RIGHT_ARROW) {
        Ember['default'].run(this, function () {
          this.controller.send('moveImage', evt.which);
        });
      }
    },

    handleSize: function () {

      var minHeightIcon = 64;
      var minWidthIcon = 48;
      var minHeightScreen = minHeightIcon * 6;
      var minWidthScreen = minWidthIcon * 4;
      var minHeightWin = minHeightScreen + 60;
      var minWidthWin = minWidthScreen * 4;
      var winWidth  = Math.max(Ember['default'].$(window).width(), minWidthWin);
      var winHeight = Math.max(Ember['default'].$(window).height(), minHeightWin);

      var height = (winHeight - 60) * 0.9;
      var width = winWidth / 3 * 0.9 ;

      var top = (winHeight - 60 - height) / 2 + 45;
      var left = (winWidth - width * 3) / 4;

      var iconWidth = Math.max(width/4 * 0.6, minWidthIcon);
      // var node = this.$();
      // node.css({
      //   width: width,
      //   height: height,
      //   left: left,
      //   top: top
      // });
      // node.css({
      //   width: '100%',
      //   height: '100%'
      // });
      this.setProperties({
        screenWidth: width,
        screenHeight: height,
        top: top,
        left: left,
        iconWidth: iconWidth
      });
    },


    getScreenRowCol: function (left, top) { // TBD: refine accuracy
      var newCol = Math.round(left * 4 / this.get('screenWidth'));
      var newRow = Math.round(top * 5 / this.get('screenHeight'));
      return {row: newRow, col: newCol};
    },

    onMouseMove: function (event) {
      // this.set('parentView.appTouch', true);
      this.set('controller.appTouch', true);

      var node = this.get('activeApp');
      var originEvt = event.originalEvent;
      var offset = node.$().parent().offset(); // TBD
      var x = originEvt.clientX - this.get('offsetX') - offset.left;
      var y = originEvt.clientY - this.get('offsetY') - offset.top;
      node.$().css({ // image follow
        'top': y,
        'left': x,
        'z-index': '100'
      });
      var rowCol = this.getScreenRowCol(x, y);
      if (node.get('row') !== rowCol.row || node.get('col') !== rowCol.col) {
        this.shuffle(
        {row: node.get('row'), col: node.get('col')},
        rowCol);
      }
    },

    onMouseRelease: function () {
      var node = this.get('activeApp');
      node.$().removeClass('dragging');
      this.$(document).off('mousemove');
      this.off('mouseUp', this.onMouseRelease);
      // this.off('mouseLeave', this.onMouseRelease);
      node.position(node.get('row'), node.get('col'), 300);

      node.$().css({
        'z-index': 1
      });
      if (!this.get('controller.appTouch')) {
        this.get('controller').send('openApp', node.get('content'));
      }
      this.set('controller.appTouch', false);
    },

    onMouseDown: function (app, offsetX, offsetY) { // this will be called by item
      this.setProperties({
        'activeApp': app,
        'offsetX': offsetX,
        'offsetY': offsetY
      });

      this.$(document).on('mousemove', this.onMouseMove.bind(this));
      this.on('mouseUp', this.onMouseRelease);
      //this.on('mouseLeave', this.onMouseRelease);
    },

    shuffle: function (from, to) {  // TBD add screen constrain
      console.log(JSON.stringify(from) + ' -> ' + JSON.stringify(to));
      this.get('childViews').forEach(function (itemView) {
        var col = get(itemView, 'col');
        var row = get(itemView, 'row');
        if (col === get(to, 'col') && row === get(to, 'row') ) {
          itemView.position(get(from, 'row'), get(from, 'col'), 200);
        } else if (col === get(from, 'col') && row === get(from, 'row') ) {
          itemView.setProperties({
            col: get(to, 'col'),
            row: get(to, 'row')
          });
        }
      });
    }


  });

});
define('web-desktop/views/header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['head'],
    templateName: 'header',
    width_dock_icon: 52,
    width_dock_corner: 25,
    width_sync: 66,

    adjustSize: function () {
      var total_dock = this.get('content.dock.length');
      var offset = total_dock ? total_dock * this.get('width_dock_icon') + 2 * this.get('width_dock_corner') : 0;
      var width = (Ember['default'].$( window ).width() - offset - this.get('width_sync')) /2 ;
      if (this.get('_state') === "inDOM") {
        this.$('.left').width(width);
        this.$('.right').width(width);
      }
    }.observes('content.dock.length'),

    init: function() {
      this._super();
      Ember['default'].$(window).bind('resize', function () {
        this.adjustSize();
      }.bind(this));
    },
    didInsertElement: function () {
      this.adjustSize();
    },


  });

});
define('web-desktop/views/scroll-bar-handler', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['jspDrag'],

    onLenChange: function () {

      var len = this.get('len')||0;
      var top = this.get('top')||0;

      this.$().css({
        height: len + 'px',
        top: top +'px'
      });
    }.observes('len', 'top'),

    mouseEnter: function () {
      this.$().addClass('jspHover');
    },

    mouseLeave: function () {
      this.$().removeClass('jspHover');
    },

    mouseDown: function (evt) {
      this.$().addClass('jspActive');
      this.get('parentView').jspActive(evt);
    },

    mouseUp: function () {
      this.$().removeClass('jspActive');
      this.get('parentView').jspDeactive();
    },



  });

});
define('web-desktop/views/scroll-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['jspVerticalBar'],
    templateName: 'scroll-bar',

    trackStyle: function () {
      console.log('trackStyle');
      return 'height: %@px'.fmt(this.get('trackLen')||0);
    }.property('trackLen'),

    jspActive: function (evt) {
      var offsetY =  evt.originalEvent.offsetY
      Ember['default'].$('.overlay').on('mousemove', function (evt) { //TBD : better event handle
        Ember['default'].run.debounce(function () {
          var offset = evt.originalEvent.clientY - offsetY - this.$().offset().top;
          var slideLen = this.get('trackLen') - this.get('handlerLen');
          if (offset > 0 && offset < slideLen) {
            console.log(evt.clientY + ' - ' + evt.offsetY + ' - ' + offsetY + ' = ' + offset);

            this.set('handlerTop', offset);
            var percent = offset / slideLen;
            this.get('parentView').scrollList(percent);
          }
        }.bind(this), 50);

      }.bind(this));

      Ember['default'].$('.overlay').on('mouseup', function () {
        this.jspDeactive();

      }.bind(this));

    },

    jspDeactive: function () {
      Ember['default'].$('.overlay').off('mousemove');
    },

    // mouseMove: function (evt) {
    //     if (this.get('active')) {
    //
    //       var offset = evt.originalEvent.clientY - this.get('offsetY') - 142;
    //       if (offset > 0 && offset < this.get('trackLen') - this.get('handlerLen')) {
    //         console.log(evt.clientY + ' - ' + evt.offsetY + ' - ' + this.get('offsetY') + ' = ' + offset);
    //
    //         this.set('handlerTop', offset);
    //       }
    //
    //       // console.log(offset);
    //     }
    // }

  });

});
define('web-desktop/views/search-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var get = Ember['default'].get;

  exports['default'] = Ember['default'].View.extend({
    templateName: 'search-bar',
    classNames: ['search-bar'],
    query: '',

    didInsertElement: function () {
      this.$('.search').on('click', function () {
        this.$('.overlay').show();
        this.$('.search').hide();
        this.$('.overlay input').focus();
      }.bind(this));

      // this.$('.overlay').on('click', function () {
      //   this.$('.search').show();
      //   this.$('.overlay').hide();
      //   this.$('.overlay').off('mousemove');
      // }.bind(this));
      // this.$('.modal').on('click', function (evt) {
      //   evt.stopPropagation();
      // });


      this.$('.modal').on('mousewheel', function(event) {
        var viewLen = this.$('.container').height() - 20; // 20 is padding
        var contentLen = this.get('controller.resultDivHeight');
        var top = parseInt(this.$('.container ul').css('top'), 10);
        var range = contentLen - viewLen;
        if (range > 0) {
          top = top + event.deltaY;
          top = Math.min(top, 0);
          top = Math.max(top, -range);
          this.$('.container ul').css({top: top + 'px'});
          var handlerTop = -top/range * this.get('handlerLen');
          this.set('handlerTop', handlerTop);
        }
      }.bind(this));
    },

    all: [
      {
        name: 'Customer',
        rating: 5,
        category: 'Base',
        price: 4,
        freeDays: 30,
        icon: 'img/icon_15.png',
        viewName: 'customer',
        installed: false,
        url: 'http://gausian-developers.github.io/user-app-template5/app/'
      },
      {
        name: 'Pixlr',
        rating: 5,
        category: 'Creative',
        price: 4,
        freeDays: 15,
        icon: 'img/pixlr.png',
        viewName: 'customer',
        installed: false,
        url: 'http://pixlr.com/editor/?loc=zh-cn'
      }
      // {
      //   name: 'Check',
      //   rating: 5,
      //   category: 'Inventory Management',
      //   price: 4,
      //   freeDays: 30,
      //   icon: 'img/icon_1.png',
      //   installed: false
      // }, {
      //   name: 'Aplus',
      //   rating: 5,
      //   category: 'Inventory Management',
      //   price: 8,
      //   freeDays: 30,
      //   icon: 'img/icon_1.png',
      //   installed: false
      // }, {
      //   name: 'Docs',
      //   rating: 4,
      //   category: 'Inventory Management',
      //   price: 6,
      //   freeDays: 30,
      //   icon: 'img/icon_3.png',
      //   installed: false
      // }, {
      //   name: 'Report',
      //   rating: 4,
      //   category: 'Inventory Management',
      //   price: 2,
      //   freeDays: 30,
      //   icon: 'img/icon_8.png',
      //   installed: false
      // }, {
      //   name: 'Match',
      //   rating: 3,
      //   category: 'Inventory Management',
      //   price: 8,
      //   freeDays: 30,
      //   icon: 'img/icon_4.png',
      //   installed: false
      // }, {
      //   name: 'Scan',
      //   rating: 5,
      //   category: 'Inventory Management',
      //   price: 4,
      //   freeDays: 30,
      //   icon: 'img/icon_5.png',
      //   installed: false
      // }
    ],

    searchContent: function () {
      var array = [];
      var query = this.get('query');
      if (query) {
        query = query.toLowerCase();
        array = this.get('all').filter(function (item) {
          return get(item, 'name').toLowerCase().indexOf(query) !== -1 || get(item, 'category').toLowerCase() === query;
        });
      }
      return array;
    }.property('query'),

    keyUp: function (evt) {
      if (evt.keyCode === 27) {
        this.set('query', '');
        this.$('.search').show();
        this.$('.overlay').hide();
      }
    },

    updateHeight: function () {
      if (this.get('_state') === 'inDOM') {
        var viewLen = this.$('.container').height() - 20; // 20 is padding
        var contentLen = this.get('controller.resultDivHeight');
        var trackLen = viewLen;
        var handlerLen = trackLen * viewLen / contentLen;

        if (trackLen <= handlerLen) {
          this.setProperties({
            trackLen: 0,
            handlerLen: 0
          });
        } else {
          this.setProperties({
            trackLen: trackLen,
            handlerLen: handlerLen
          });
        }
      }
    }.observes('controller.resultDivHeight'),

    scrollList: function (percent) {
      var viewLen = this.$('.container').height() - 20; // 20 is padding
      var contentLen = this.get('controller.resultDivHeight');
      var top = (viewLen - contentLen) * percent;
      this.$('.container ul').css({top: top + 'px'});
    },

    actions: {
      cancel: function () {
          this.set('query', '');
          this.$('.search').show();
          this.$('.overlay').hide();
      }
    }

  });

});
define('web-desktop/views/search-results-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'search-results-item',
    classNames: ['search-results-item'],
    label: function () {
      if (this.get('content.installed')) {
        return 'Open';
      } else {
        return 'Get';
      }
    }.property('content.installed'),

    actions: {
      installApp: function () {
        this.set('content.installed', true);
        this.get('controller').send('installApp', this.get('content'));
      },

      openApp: function () {
        this.get('controller').send('openApp', this.get('content'));
      }
    }
  });

});
define('web-desktop/views/search-results', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].CollectionView.extend({
    itemViewClass: 'search-results-item',
    tagName: 'ul',
    classNames: ['search-results'],
    onChildViewsChanged : function( obj, key ){
      var length = this.get( 'childViews.length' );
      if( length > 0 ){
        Ember['default'].run.scheduleOnce( 'afterRender', this, 'childViewsDidRender' );
      }
    }.observes('childViews'),

    childViewsDidRender : function(){
      this.get('controller').set('resultDivHeight', this.$().height());
    }
  });

});
define('web-desktop/views/window', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    templateName: 'window',
    classNames: ['window', 'share',  'windows-vis'],

    width: 800,
    height: 600,

    didInsertElement: function () {

      this.$().css({
        width: this.get('width'),
        height: this.get('height')
      });

      this.$('.header').on('mousedown', function (event) {
        var originEvt = event.originalEvent;
        var offsetX = originEvt.offsetX ? originEvt.offsetX : originEvt.layerX;
        var offsetY = originEvt.offsetY ? originEvt.offsetY : originEvt.layerY;

      //   this.$('.header').on('mousemove', function (event) {
      //     var originEvt = event.originalEvent;
      //     var x = originEvt.clientX - offsetX;
      //     var y = originEvt.clientY - offsetY;
      //     this.$().css({ // image follow
      //       'top': y,
      //       'left': x,
      //       'z-index': '1000'
      //     });
      //   }.bind(this));
      //
      }.bind(this));

      this.$('.header').on('mouseup', function () {console.log('mouseup');
        Ember['default'].$(this).off('mousemove');
      });

    },

    willDestroyElement: function () {
      this.$('.header').on('mousedown');
      this.$('.header').on('mouseup');
    }

  });

});
/* jshint ignore:start */

define('web-desktop/config/environment', ['ember'], function(Ember) {
  var prefix = 'web-desktop';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("web-desktop/tests/test-helper");
} else {
  require("web-desktop/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
//# sourceMappingURL=web-desktop.map