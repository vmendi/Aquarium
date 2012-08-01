var express   = require( 'express' )
  , _         = require( 'underscore' )
  , config    = {
      api_key: 'AZx9cKaeu2V45L3Uk84YIpZSspDDTyLM'
    , api_secret: '1cabiDfVFVXAt26mMBVjx6Xqd9YvtS7F'
    , game_id: '8jGBUcpKwZu9DP4gTwaT3A'
    , economy: 'sandbox'
    , port: 8000
  }
  , server    = require( './configure' )( express.createServer() )
  , Betable   = require('betable-oauth-node-sdk')({
        apiKey      : config.api_key
      , apiSecret   : config.api_secret
      , redirectUri : 'http://localhost:8000/callback'
    })

server.get( '/', function( req, res, next ) {
	if( !req.session.access_token ) {
		req.session.state = Math.floor( Math.random() * 1100000000000 ).toString()
		return Betable.authorize( res, req.session.state )
	}
	Betable.get( ['account', 'wallet'], req.session.access_token, function( error, data ) {
	   return res.render( 'index.html', { 
            first_name    : data.account.first_name
          , balance       : data.wallet[config.economy].balance
          , access_token  : req.session.access_token
          , game_id       : config.game_id
          , config        : JSON.stringify({
                configuration : config.configuration
              , economy       : config.economy
              , game_id       : config.game_id
            })
        })
    })	
})

server.get( '/callback', function( req, res, next ) {
	var code  = req.query.code
	  , state = req.query.state
	  
    if( !state || state != req.session.state ) {
        delete req.session.state
        return res.send( 400 )
    }
    delete req.session.state
    if( req.query.error ) return res.send( 'we got an error', req.query.error )
    
    Betable.token( code, function( error, access_token ) {
        if( error ) return res.send( { error: error }, 400 )

        req.session.access_token = access_token
        return res.redirect('/')
    })
})

port = process.env.PORT || config.port

server.listen( port )
console.log('Server started in port ' + port)