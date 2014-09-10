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

            me.$el.html('');

            var nameField = this.settings.get('nameField');
            var valueField = this.settings.get('valueField');

            data = data.map(function(one){
                return {
                    text: one[nameField],
                    size: one[valueField]
                }
            })

            var fill = d3.scale.category20();

            d3.layout.cloud().size([300, 300])
                .words(data)
                .padding(5)
                //.rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();

            function draw(words) {
              d3.select(me.el).append("svg")
                  .attr("width", 300)
                  .attr("height", 300)
                .append("g")
                  .attr("transform", "translate(150,150)")
                .selectAll("text")
                  .data(words)
                .enter().append("text")
                  .style("font-size", function(d) { return d.size * 2 + "px"; })
                  .style("font-family", "Impact")
                  .style("fill", function(d, i) { return fill(i); })
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .text(function(d) { return d.text; });
            }
        }
    });
    return WordCloud;
});
