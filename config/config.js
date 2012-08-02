var _           = require( 'underscore' ),
    configs     = {
        base    : require( './configs/base' )
      , sandbox : require( './configs/sandbox' )
      , real    : require( './configs/real' )
    }
  , deployContext = process.env.PORT? 'heroku' : 'localhost'
  , deployURL     = deployContext === 'heroku'? 'http://betaquarium.herokuapp.com' : 'http://localhost'
  , economy       = process.env.NODE_ECONOMY || 'sandbox'
  , config        = {}

config = _.extend( configs.base, configs[economy] )

config.economy  = economy;
config.port = process.env.PORT || config.port;
config.callback = deployURL + ':' + config.port + '/callback';

console.log("Starting server on " + deployContext);
console.log("Callback " + config.callback);
console.log("Using a " + economy + " economy");

module.exports = config
