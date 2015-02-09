import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default Ember.Controller.extend({
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
        var zindex = parseInt(Ember.$(instant.get('element')).css("z-index"));
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
        Ember.$.extend({
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
