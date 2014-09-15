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

        options: {
            data: "preview"
        },

        output_mode: "json",

        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);
        },

        createView: function() {
            return true
        },

        updateView: function(viz, data) {
            var me = this;

            var w = me.$el.width();

            me.$el.html('').height(this.settings.get('height') || 450);
            var h = me.$el.height();

            var nameField = this.settings.get('nameField');
            var valueField = this.settings.get('valueField');

            data = data.map(function(one){
                return {
                    text: one[nameField],
                    size: one[valueField]
                }
            })

            var fill = d3.scale.category20();

            var fontSize = d3.scale['log']().range([10, 50]);

            d3.layout.cloud().size([w, h])
                .words(data)
                .timeInterval(10)
                .font("Impact")
                .fontSize(function(d) { return fontSize(+d.size); })
                .on("end", draw)
                .start();

            function draw(words, bounds) {
                var scale = bounds ? Math.min(
                        w / Math.abs(bounds[1].x - w / 2),
                        w / Math.abs(bounds[0].x - w / 2),
                        h / Math.abs(bounds[1].y - h / 2),
                        h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

                    var svg = d3.select(me.el).append("svg")
                        .attr("width", w)
                        .attr("height", h);

                    var background = svg.append("g");
                    var vis = svg.append("g")
                        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

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
