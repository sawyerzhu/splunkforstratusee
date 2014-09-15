/*
 * Simple TagCloud visualization
 * This view is an example for a simple visualization based on search results
 */
define(function(require, module) {
    var _ = require('underscore');
    var $ = require('jquery');
    var jquery_knob = require('./jquery.knob');
    var SimpleSplunkView = require('splunkjs/mvc/simplesplunkview');
    var Drilldown = require('splunkjs/mvc/drilldown');
    var Morris = require('../morris/morris');

    require('css!./knob.css');

    var Knob = SimpleSplunkView.extend({
        moduleId: module.id,
        className: 'knob-viz',
        options: {
            valueField: 'count',
            data: 'preview'
        },
        output_mode: 'json',
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
        },
        createView: function() {
            return true;
        },
        updateView: function(viz, data) {
            var me = this;

            var id = this.id + "-knob";
            var id2 = this.id + '-file_types'
            var valueField = this.settings.get('valueField');

            // Clear the current view
            var el = this.$el.empty();
            var minMagnitude = Infinity, maxMagnitude = -Infinity;

            $('<div  id="' + id +'"></div>').appendTo(el);

            var value = 0;
            var file_types = [];

            if (data && data.length == 2) {
                value = Math.round(data[0][valueField]);
                file_types = data[1].file_types;
            }

            Morris.Donut({
              element: id,
              data: [
                {label: "Download Sales", value: 12},
                {label: "In-Store Sales", value: 30},
                {label: "Mail-Order Sales", value: 20}
              ]
            });
        }
    });

    return Knob;
});
