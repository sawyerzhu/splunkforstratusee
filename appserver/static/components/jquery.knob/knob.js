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
    var Highcharts = require('highcharts');
    var Morris = require('../morris/morris');
    require('css!../morris/morris.css');
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

            var total = 0;
            var file_types = [];

            if (data && data.length > 2) {
                total = Math.round(data[0]['total']);

                for(var i = 1; i < data.length; i++) {
                    file_types.push([data[i].type, parseFloat(data[i].type_size)]);
                }
            }

            $('#susan_eu').html('Data volume Susan moved out of EU - total ' + Math.round(total) + " GB")

            $('#' + id).highcharts({
                 chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Volume percentage',
                data: file_types
            }]

            });
        }
    });

    return Knob;
});
