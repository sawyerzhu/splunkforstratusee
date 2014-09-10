/*
 * Simple TagCloud visualization
 * This view is an example for a simple visualization based on search results
 */
define(function(require, module) {
    var _ = require('underscore'), $ = require('jquery');
    var utils = require('splunkjs/mvc/utils');
    var SimpleSplunkView = require('splunkjs/mvc/simplesplunkview');
    var Drilldown = require('splunkjs/mvc/drilldown');
    var SearchManager = require('splunkjs/mvc/searchmanager');
    require('css!./tagcloud.css');

    var TagCloud = SimpleSplunkView.extend({
        moduleId: module.id,
        className: 'tagcloud-viz',
        options: {
            labelField: 'label',
            valueField: 'count',
            minFontSize: 8,
            maxFontSize: 36,
            data: 'preview'
        },
        output_mode: 'json',
        events: {
            'click a': function(e) {
                e.preventDefault();
                // Perform automatic drilldown on click on a tag
                Drilldown.handleDrilldown({
                    name: this.settings.get('labelField'),
                    value: $.trim($(e.target).text())
                }, 'row', new SearchManager({
                    "id": 'customsearch1',
                    "search": 'sourcetype=ss_log type=aie appname=Box',
                    "earliest_time": "-360d",
                    "latest_time": "now",
                    "app": utils.getCurrentApp(),
                    "auto_cancel": 90,
                    "status_buckets": 0,
                    "preview": true,
                    "timeFormat": "%s.%Q",
                    "wait": 0,
                    "runOnSubmit": true
                }));
            }
        },
        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
        },
        createView: function() {
            return true;
        },
        updateView: function(viz, data) {
            var labelField = this.settings.get('labelField');
            var valueField = this.settings.get('valueField');
            var minFontSize = parseFloat(this.settings.get('minFontSize'));
            var maxFontSize = parseFloat(this.settings.get('maxFontSize'));

            // Clear the current view
            var el = this.$el.empty().css('line-height', Math.ceil(maxFontSize * 0.55) + 'px');
            var minMagnitude = Infinity, maxMagnitude = -Infinity;

            _(data).chain().map(function(result) {
                // Extract and convert the magnitude field value
                var magnitude = parseFloat(result[valueField]);
                // Find the maximum and minimum of the magnitude field values
                minMagnitude = magnitude < minMagnitude ? magnitude : minMagnitude;
                maxMagnitude = magnitude > maxMagnitude ? magnitude : maxMagnitude;
                return {
                    label: result[labelField],
                    magnitude: magnitude
                };
            }).each(function(result) {
                        // Calculate relative size of each tag
                        var size = minFontSize + ((result.magnitude - minMagnitude) / maxMagnitude * (maxFontSize - minFontSize));
                        // Render the tag
                        $('<a class="link" href="#" /> ').text(result.label + ' ').css({
                            'font-size': size
                        }).appendTo(el);
                    });
        }
    });

    return TagCloud;
});
