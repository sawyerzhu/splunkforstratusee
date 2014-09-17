require.config({
    paths: {
        "app": "../app"
    }
});

require([
    'underscore',
    'jquery',
    'models/SplunkDBase',
    'splunkjs/mvc/sharedmodels',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, SplunkDModel, sharedModels, mvc) {
    ////////////////////////////
    // set init config parameter
    ////////////////////////////

    var CustomConfModel = SplunkDModel.extend({
        urlRoot: 'configs/conf-myconf'
    });

    // New instance of our model class
    var settings = new CustomConfModel();
    // Set the entity id (ie. the stanza name)
    settings.id = 'settings';

    // Use the shared app model for loading the entity using the current namespace
    var app = sharedModels.get('app');

    // Load the model content from splunkd
    settings.fetch({
        data: {
            app: app.get('app'),
            owner: app.get('owner')
        }
    }).done(function(){
        // When the model has been successfully loaded
        var value = settings.entry.content.get('offical_email_suffix');

        // Set the token in both the default and submitted namespace
        mvc.Components.get('default').set('offical_email_suffix', value);
        mvc.Components.get('submitted').set('offical_email_suffix', value);

        /////////////////////////////
        // init dashboard html
        /////////////////////////////
        require(['splunkjs/ready!'], function(){
            // The splunkjs/ready loader script will automatically instantiate all elements
            // declared in the dashboard's HTML.
        });
    });


});
