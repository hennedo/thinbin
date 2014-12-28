'use strict';

// imports

var Hapi = require('hapi'),
    ConfigFactory = require(__dirname + '/app/services/configFactory.js');

// Application Start

var server = new Hapi.Server();

ConfigFactory
    .create()
    .then(startApplication, showError);

function startApplication(config) {

    var hostname = config.get('hostname'),
        port     = config.get('port');

    console.log('hostname: \t', hostname);
    console.log('port: \t\t', port);


    server.connection({
        host: hostname,
        port: port
    });

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });

// register api routes
    console.log('Registering routes');

    server.register({
        register: require('hapi-router').register,
        options: {
            routesDir: (__dirname + '/app/routes/')
        }
    }, function (err) {
        if (err) throw err;
    });

// serve static contents
    console.log('Registering public folder');

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: (__dirname + '/public'),
                listing: true
            }
        }
    });
}

function showError(err) {
    console.log('Service could not start because of the following error', err);
}