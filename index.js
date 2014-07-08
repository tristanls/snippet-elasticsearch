/*

index.js: snippet-elasticsearch

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var events = require('events');
var fs = require('fs');
var path = require('path');
var shelljs = require('shelljs');
var spawn = require('child_process').spawn;
var util = require('util');

var TEMP_DIR = shelljs.tempdir();

var ELASTICSEARCH_HOME = path.normalize(path.join(__dirname, 'elasticsearch-1.2.1'));
var DEFAULT_LOGS_DIR = path.normalize(path.join(TEMP_DIR, 'snippet', 'elasticsearch', 'logs'));
var DEFAULT_DATA_DIR = path.normalize(path.join(TEMP_DIR, 'snippet', 'elasticsearch', 'data'));

/*
  * `options`:
    * `executable`: _String_ _(Default: ELASTICSEARCH_HOME/bin/elasticsearch)_
        The path to Elasticsearch executable.
    * `path`: _Object_ _(Default: {
          logs: 'TEMP_DIR/snippet/elasticsearch/logs',
          data: 'TEMP_DIR/snippet/elasticsearch/data'
        })_ Object specifying the path to logs and data.
    * `pidFile`: _String_ _(Default: TEMP_DIR/snippet/elasticsearch/elasticsearch.pid)_
        Path to the pid file for the Elasticsearch server.
*/
var SnippetElasticsearch = module.exports = function SnippetElasticsearch(options) {
    var self = this;
    events.EventEmitter.call(self);

    options = options || {};

    self.executable = options.executable ||
        ELASTICSEARCH_HOME + '/bin/elasticsearch';
    self.path = options.path || {};
    self.path.logs = self.path.logs || DEFAULT_LOGS_DIR;
    self.path.data = self.path.data || DEFAULT_DATA_DIR;
    self.pidFile = options.pidFile ||
        path.normalize(
            path.join(TEMP_DIR, 'snippet', 'elasticsearch', 'elasticsearch.pid'));

    self.server = null;

    // make sure we kill the child process if we exit
    self.onSIGINT = function () {
        if (self.server) self.server.kill('SIGINT');
    };
    process.on('SIGINT', self.onSIGINT);
};

util.inherits(SnippetElasticsearch, events.EventEmitter);

/*
  * `options`: See `new SnippetEleasticsearch(options)` `options`.
  * `callback`: See `snippetElasticsearch.listen(callback)` `callback`.
  Return: _Object_ An instance of SnippetElasticsearch that is starting an
      Elasticsearch server.
*/
SnippetElasticsearch.listen = function listen(options, callback) {
    var snippetElasticsearch = new SnippetElasticsearch(options);
    snippetElasticsearch.listen(callback);
    return snippetElasticsearch;
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function (code) {}` Optional
      callback to call once the Elasticsearch server is stopped.
*/
SnippetElasticsearch.prototype.close = function close(callback) {
    var self = this;

    // FIXME: add taking into accout self.pidFile in case server is running
    //        but we don't have it in self.server for some reason :/

    self.server.on('close', function (code) {
        callback ? callback(code) : undefined;
    });
    self.server ? self.server.kill('SIGINT') : undefined;
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional
      callback to call once the Elasticsearch server is started.
*/
SnippetElasticsearch.prototype.listen = function listen(callback) {
    var self = this;

    // FIXME: add taking into accout self.server already listening, or
    //        a detached server already running with PID of self.pidFile

    self.server = spawn(self.executable,
        ['-Des.path.logs=' + self.path.logs,
         '-Des.path.data=' + self.path.data,
         '-p ' + self.pidFile]);

    self.server.stdout.on('data', function (data) {
        self.emit('stdout', data);
        // check for the signal that the server is up and notify
        if (data.toString().match(/started/)) {
            self.emit('listening');
            callback ? callback() : undefined;
        }
    });
    self.server.stderr.on('data', function (data) {
        self.emit('stderr', data);
    });
    self.server.on('close', function (code) {
        self.server = null;
        self.emit('close', code);
    });
};