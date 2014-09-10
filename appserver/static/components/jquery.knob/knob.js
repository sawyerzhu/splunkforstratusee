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
            var id = this.id + "-knob";
            var valueField = this.settings.get('valueField');

            // Clear the current view
            var el = this.$el.empty();
            var minMagnitude = Infinity, maxMagnitude = -Infinity;

            $('<input type="text" id="' + id + '" class="dial">').appendTo(el);

            var value = Math.round(data[0].size);

            $("#" + id).val(value).knob({
                'fgColor': "#66CC66",
                'angleOffset': -125,
                'angleArc': 250,
                'readOnly': true,
                'min':0,
                'width': 260,
                'max': (Math.random() + 1) * value
            })

            $("#" + id).css({
                "font-size": '40px',
                "margin-left": (this.$el.width - 200) / 2
            });
        }
    });

    return Knob;
});
