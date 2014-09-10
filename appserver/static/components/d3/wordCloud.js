// Bubble Chart
// this displays information as different 'bubbles,' their unique values represented with
// the size of the bubble.
// supports drilldown clicks

// available settings:
// - nameField: the field to use as the label on each bubble
// - valueField: the field to use as the value of each bubble (also dictates size)
// - categoryField: the field to use for grouping similar data (usually the same field as nameField)

// ---expected data format---
// a splunk search like this: source=foo | stats count by artist_name, track_name

define(function(require, exports, module) {

    var _ = require('underscore');
    var d3 = require('./d3');
    var d3LayoutCloud = require("./d3.layout.cloud");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");

    var WordCloud = SimpleSplunkView.extend({

        className: "splunk-toolkit-bubble-chart",

        options: {
            managerid: null,
            data: "preview",
            nameField: null,
            valueField: 'count',
            categoryField: null
        },

        output_mode: "json",

        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
        },

        createView: function() {
            return true
        },

        // making the data look how we want it to for updateView to do its job
        formatData: function(data) {
            // getting settings
            var nameField = this.settings.get('nameField');
            var valueField = this.settings.get('valueField');

            return data.map(function(one){
                return {
                    text: one[nameField],
                    size: one[valueField]
                }
            })
        },

        updateView: function(viz, data) {
            var me = this;

            var fill = d3.scale.category20();

            d3.layout.cloud().size([450, 450])
              .words(data)
              .padding(5)
              .rotate(function() { return ~~(Math.random() * 2) * 90; })
              .font("Impact")
              .fontSize(function(d) { return d.size * 2; })
              .on("end", draw)
              .start();

            function draw(data, bounds) {
              var w = 450,
                  h = 450;
              var scale = bounds ? Math.min(
                  w / Math.abs(bounds[1].x - w / 2),
                  w / Math.abs(bounds[0].x - w / 2),
                  h / Math.abs(bounds[1].y - h / 2),
                  h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
              words = data;

              var vis = d3.select(me.el).append("svg")
                  .attr("width", 450)
                  .attr("height", 450)
                .append("g")
                  .attr("transform", "translate(225,225)");

              var text = vis.selectAll("text")
                  .data(words, function(d) { return d.text.toLowerCase(); });
              text.transition()
                  .duration(1000)
                  .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                  .style("font-size", function(d) { return d.size + "px"; });
              text.enter().append("text")
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                  .style("font-size", function(d) { return d.size + "px"; })
                  .on("click", function(d) {
                    load(d.text);
                  })
                  .style("opacity", 1e-6)
                .transition()
                  .duration(1000)
                  .style("opacity", 1);
              text.style("font-family", function(d) { return d.font; })
                  .style("fill", function(d) { return fill(d.text.toLowerCase()); })
                  .text(function(d) { return d.text; });
              vis.transition()
                  .delay(1000)
                  .duration(750)
                  .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
            }
        }
    });
    return WordCloud;
});
