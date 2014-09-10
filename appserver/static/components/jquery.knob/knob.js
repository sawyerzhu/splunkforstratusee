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

    var Knob = SimpleSplunkView.extend({
        moduleId: module.id,
        className: 'jquery.knob-viz',
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

            $('<div style="margin: 10px, auto;"><input type="text" id="' + id + '" class="dial"></div>').appendTo(el);

            var value = Math.round(data[0].size);
            
            $("#" + id).val(value).knob({
                'min':0,
                'max': (Math.random() * 2 + 1) * value
            });
        }
    });

    return Knob;
});
