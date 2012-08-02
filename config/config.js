var _             = require( 'underscore' ),
    deployContext = process.env.PORT? 'heroku' : 'localhost'
  , deployURL     = deployContext === 'heroku'? 'http://betaquarium.herokuapp.com' : 'http://localhost'
  , economy       = process.env.NODE_ECONOMY || 'sandbox'
  , config        = {}

if (deployContext === 'heroku' && economy === 'sandbox')
  config = require('./configs/heroku-sandbox');
else
if (deployContext === 'heroku' && economy === 'real')
  config = require('./configs/heroku-real')
else
if (deployContext === 'localhost')
  config = require('./configs/localhost')

config.economy  = economy;
config.callback = deployContext === 'heroku'? deployURL + '/callback' : deployURL + ':' + config.port + '/callback'
config.port     = process.env.PORT || config.port;

console.log("Starting server on " + deployContext);
console.log("Callback " + config.callback);
console.log("Using a " + economy + " economy");

module.exports = config
