var _           = require( 'underscore' ),
    configs     = {
        base    : require( './configs/base' )
      , sandbox : require( './configs/sandbox' )
      , real    : require( './configs/real' )
    }
  , deployContext = process.env.NODE_PORT? 'heroku' : 'localhost'
  , deployURL     = deployContext === 'heroku'? 'http://betaquarium.herokuapp.com' : 'http://localhost'
  , economy       = process.env.NODE_ECONOMY || 'sandbox'
  , config        = {}

config = _.extend( configs.base, configs[economy] )

config.economy  = economy;
config.port = process.env.NODE_PORT || config.port;
config.callback = deployURL + ':' + config.port + '/callback';

console.log( "Starting server on port " + config.port + " using a " + economy + " economy" )

module.exports = config
