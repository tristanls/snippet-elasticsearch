/*

new.js - snippet-elasticsearch

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

var TEMP_DIR = shelljs.tempdir();

var test = module.exports = {};

test['SnippetElasticsearch should have default executable path'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    test.ok(snippetElasticsearch.executable);
    test.done();
};

test['SnippetElasticsearch should have default logs path in temp directory'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    test.ok(snippetElasticsearch.path.logs.match(TEMP_DIR));
    test.done();
};

test['SnippetElasticsearch should have default data path in temp directory'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    test.ok(snippetElasticsearch.path.data.match(TEMP_DIR));
    test.done();
};

test['SnippetElasticsearch should have default pidFile path in temp directory'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    test.ok(snippetElasticsearch.pidFile.match(TEMP_DIR));
    test.done();
};

test['SnippetElasticsearch should not have server instance handle'] = function (test) {
    test.expect(1);
    var snippetElasticsearch = new SnippetElasticsearch();
    test.ok(!snippetElasticsearch.server);
    test.done();
};