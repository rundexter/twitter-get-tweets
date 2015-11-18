var Twit = require('twit');
var _ = require('lodash');

var mapAuthOptionsEnv = {
    'twitter_consumer_key': 'consumer_key',
    'twitter_consumer_secret': 'consumer_secret',
    'twitter_access_token': 'access_token',
    'twitter_access_token_secret': 'access_token_secret'
};


module.exports = {
    /**
     * Send REST API and get Tweets array.
     *
     * @param authOptions
     * @param params
     * @param callback
     */
    listTweets: function (authOptions, params, callback) {
        var twitter = new Twit(authOptions);
        
        twitter.get('statuses/home_timeline', params, callback);
    },

    /**
     * Get Auth options from Environment.
     *
     * @param dexter
     * @returns {{}}
     */
    authOptions: function (dexter) {
        // twitter auth property
        var authOptions = {};

        _.map(mapAuthOptionsEnv, function (authOpt, twitterOpt) {
            if(dexter.environment(twitterOpt)) {
                // get auth property
                authOptions[authOpt] = dexter.environment(twitterOpt);
            } else {
                // catch no-arguments message
                this.fail('A ' + twitterOpt + ' environment variable is required for this module');
            }
        }, this);

        return authOptions;
    },

    /**
     * Allows the authenticating users to follow the user specified in the ID parameter.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {

        this.listTweets(this.authOptions(dexter), step.inputs(), function (error, listTweets) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return befriendedInfo
            this.complete({tweets: listTweets});
        }.bind(this));
    }
};
