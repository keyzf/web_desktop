import Ember from 'ember';
import WindowMixin from '../../mixins/window-view';

export default Ember.View.extend(WindowMixin, {

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
      Ember.run.later(function () {
        this.set('index', index + 1);
        this.$('img.spinner').hide();
      }.bind(this), 600);
    }

  }.observes('index')

});
