var express = require('express')
  , _       = require('underscore')

module.exports = function( server ) {
    server.use( express.bodyParser() )
    server.use( express.cookieParser() )
    server.use( '/javascripts',  express.static( __dirname + '/javascripts' ))
    server.use( '/stylesheets',  express.static( __dirname + '/stylesheets' ))
    server.use( '/images',       express.static( __dirname + '/images' ))
    server.set( 'view options', { layout: false } )
    server.set( 'views', __dirname + '/' )
    server.register( '.html', {
        compile: function (str, options) {
            _.templateSettings = {
                interpolate : /\{\{-([\s\S]+?)\}\}/g
              , escape      : /\{\{([^-]|[^-][\s\S]+?)\}\}/g
              , evaluate    : /\{\[([\s\S]+?)\]\}/g
            }
            var template = _.template(str)
            return function (locals) {
                return template(locals)
            }
        }
    })

    server.use( function( req, res, next ) {
    	req.session = JSON.parse(req.cookies[ 'sid' ] || '{}' )
    	res.on('header', function() { res.cookie( 'sid', JSON.stringify(req.session) ) })
    	next()
    })

    return server
}