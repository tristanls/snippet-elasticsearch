/*

listen.js - snippet-elasticsearch

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

var shelljs = require('shelljs');
var SnippetElasticsearch = require('../index.js');

var test = module.exports = {};

test['should populate server instance handle'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    snippetElasticsearch.on('close', function () {
        test.done();
    });
    snippetElasticsearch.listen(function () {
        test.ok(snippetElasticsearch.server);
        snippetElasticsearch.server.kill('SIGINT');
    });
};

test['should create server instance with PID in pidFile'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    snippetElasticsearch.on('close', function () {
        test.done();
    });
    snippetElasticsearch.listen(function () {
        test.ok(shelljs.test('-e', snippetElasticsearch.pidFile));
        snippetElasticsearch.server.kill('SIGINT');
    });
};

test['should emit listening when server instance starts'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    snippetElasticsearch.on('close', function () {
        test.done();
    });
    snippetElasticsearch.on('listening', function () {
        test.ok(true);
        snippetElasticsearch.server.kill('SIGINT');
    });
    snippetElasticsearch.listen();
};

test['should emit close with code when server instance terminates'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    snippetElasticsearch.on('close', function (code) {
        test.equal(typeof code, "number");
        test.done();
    });
    snippetElasticsearch.on('listening', function () {
        snippetElasticsearch.server.kill('SIGINT');
    });
    snippetElasticsearch.listen();
};