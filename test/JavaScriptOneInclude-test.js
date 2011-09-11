var vows = require('vows'),
    assert = require('assert'),
    _ = require('underscore'),
    urlTools = require('../lib/util/urlTools'),
    AssetGraph = require('../lib/AssetGraph'),
    transforms = AssetGraph.transforms;

vows.describe('one.include test').addBatch({
    'After loading test case': {
        topic: function () {
            new AssetGraph({root: __dirname + '/JavaScriptOneInclude/topLevelStatements/'}).queue(
                transforms.loadAssets('index.js'),
                transforms.populate()
            ).run(this.callback);
        },
        'the graph should contain 3 JavaScript assets': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'JavaScript'}).length, 3);
        },
        'the graph should contain 2 JavaScriptOneInclude relations': function (assetGraph) {
            assert.equal(assetGraph.findRelations({type: 'JavaScriptOneInclude'}).length, 2);
        },
        'then detach the first JavaScriptOneInclude relation': {
            topic: function (assetGraph) {
                assetGraph.detachAndRemoveRelation(assetGraph.findRelations({type: 'JavaScriptOneInclude'})[0]);
                return assetGraph;
            },
            'the one.include(\'foo.js\') statement should be removed from the text of index.js': function (assetGraph) {
                assert.isFalse(/one\.include\([\'\"]one\.js\1\)/.test(assetGraph.findAssets({url: /\/index\.js$/})[0].text));
            }
        },
        'then attach a new JavaScriptOneInclude relation before the other ones': {
            topic: function (assetGraph) {
                var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                    url: urlTools.resolveUrl(assetGraph.root, 'quux.js'),
                    text: "alert('quux.js');"
                });
                assetGraph.addAsset(newJavaScriptAsset);
                assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                    from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                    to: newJavaScriptAsset
                }), 'first');
                return assetGraph;
            },
            'the one.include statements should be in the correct order': function (assetGraph) {
                assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                 ['quux.js', 'bar.js']);
            },
            'then attach a new JavaScriptOneInclude relation after the quux.js one': {
                topic: function (assetGraph) {
                    var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                        url: urlTools.resolveUrl(assetGraph.root, 'baz.js'),
                        text: "alert('baz.js');"
                    });
                    assetGraph.addAsset(newJavaScriptAsset);
                    assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                        from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                        to: newJavaScriptAsset
                    }), 'after', assetGraph.findRelations({to: {url: /\/quux\.js$/}})[0]);
                    return assetGraph;
                },
                'the one.include statements should be in the correct order': function (assetGraph) {
                    assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                     ['quux.js', 'baz.js', 'bar.js']);
                },
                'then attach a new JavaScriptOneInclude relation before the bar.js one': {
                    topic: function (assetGraph) {
                        var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                            url: urlTools.resolveUrl(assetGraph.root, 'bazze.js'),
                            text: "alert('bazze.js');"
                        });
                        assetGraph.addAsset(newJavaScriptAsset);
                        assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                            from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                            to: newJavaScriptAsset
                        }), 'before', assetGraph.findRelations({to: {url: /\/bar\.js$/}})[0]);
                        return assetGraph;
                    },
                    'the one.include statements should be in the correct order': function (assetGraph) {
                        assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                         ['quux.js', 'baz.js', 'bazze.js', 'bar.js']);
                    },
                    'then attach a new JavaScriptOneInclude relation in the last position': {
                        topic: function (assetGraph) {
                            var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                                url: urlTools.resolveUrl(assetGraph.root, 'prinzenrolle.js'),
                                text: "alert('prinzenrolle.js');"
                            });
                            assetGraph.addAsset(newJavaScriptAsset);
                            assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                                from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                                to: newJavaScriptAsset
                            }), 'last');
                            return assetGraph;
                        },
                        'the one.include statements should be in the correct order': function (assetGraph) {
                            assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                             ['quux.js', 'baz.js', 'bazze.js', 'bar.js', 'prinzenrolle.js']);
                        }
                    }
                }
            }
        }
    },
    'After loading a the same test case with original one.include statements in one sequenced statement': {
        topic: function () {
            new AssetGraph({root: __dirname + '/JavaScriptOneInclude/sequencedStatements/'}).queue(
                transforms.loadAssets('index.js'),
                transforms.populate()
            ).run(this.callback);
        },
        'the graph should contain 3 JavaScript assets': function (assetGraph) {
            assert.equal(assetGraph.findAssets({type: 'JavaScript'}).length, 3);
        },
        'the graph should contain 2 JavaScriptOneInclude relations': function (assetGraph) {
            assert.equal(assetGraph.findRelations({type: 'JavaScriptOneInclude'}).length, 2);
        },
        'then detach the first JavaScriptOneInclude relation': {
            topic: function (assetGraph) {
                assetGraph.detachAndRemoveRelation(assetGraph.findRelations({type: 'JavaScriptOneInclude'})[0]);
                return assetGraph;
            },
            'the one.include(\'foo.js\') statement should be removed from the text of index.js': function (assetGraph) {
                assert.isFalse(/one\.include\([\'\"]one\.js\1\)/.test(assetGraph.findAssets({url: /\/index\.js$/})[0].text));
            }
        },
        'then attach a new JavaScriptOneInclude relation before the other ones': {
            topic: function (assetGraph) {
                var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                    url: urlTools.resolveUrl(assetGraph.root, 'quux.js'),
                    text: "alert('quux.js');"
                });
                assetGraph.addAsset(newJavaScriptAsset);
                assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                    from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                    to: newJavaScriptAsset
                }), 'first');
                return assetGraph;
            },
            'the one.include statements should be in the correct order': function (assetGraph) {
                assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                 ['quux.js', 'bar.js']);
            },
            'then attach a new JavaScriptOneInclude relation after the quux.js one': {
                topic: function (assetGraph) {
                    var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                        url: urlTools.resolveUrl(assetGraph.root, 'baz.js'),
                        text: "alert('baz.js');"
                    });
                    assetGraph.addAsset(newJavaScriptAsset);
                    assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                        from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                        to: newJavaScriptAsset
                    }), 'after', assetGraph.findRelations({to: {url: /\/quux\.js$/}})[0]);
                    return assetGraph;
                },
                'the one.include statements should be in the correct order': function (assetGraph) {
                    assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                     ['quux.js', 'baz.js', 'bar.js']);
                },
                'then attach a new JavaScriptOneInclude relation before the bar.js one': {
                    topic: function (assetGraph) {
                        var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                            url: urlTools.resolveUrl(assetGraph.root, 'bazze.js'),
                            text: "alert('bazze.js');"
                        });
                        assetGraph.addAsset(newJavaScriptAsset);
                        assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                            from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                            to: newJavaScriptAsset
                        }), 'before', assetGraph.findRelations({to: {url: /\/bar\.js$/}})[0]);
                        return assetGraph;
                    },
                    'the one.include statements should be in the correct order': function (assetGraph) {
                        assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                         ['quux.js', 'baz.js', 'bazze.js', 'bar.js']);
                    },
                    'then attach a new JavaScriptOneInclude relation in the last position': {
                        topic: function (assetGraph) {
                            var newJavaScriptAsset = new AssetGraph.assets.JavaScript({
                                url: urlTools.resolveUrl(assetGraph.root, 'prinzenrolle.js'),
                                text: "alert('prinzenrolle.js');"
                            });
                            assetGraph.addAsset(newJavaScriptAsset);
                            assetGraph.attachAndAddRelation(new AssetGraph.relations.JavaScriptOneInclude({
                                from: assetGraph.findAssets({url: /\/index\.js$/})[0],
                                to: newJavaScriptAsset
                            }), 'last');
                            return assetGraph;
                        },
                        'the one.include statements should be in the correct order': function (assetGraph) {
                            assert.deepEqual(_.pluck(assetGraph.findRelations({from: {url: /\/index\.js$/}}), 'href'),
                                             ['quux.js', 'baz.js', 'bazze.js', 'bar.js', 'prinzenrolle.js']);
                        }
                    }
                }
            }
        }
    }
})['export'](module);