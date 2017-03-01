define([
    'dojo/_base/declare',
    'dojo/query',
    'dojo/NodeList-manipulate',
    'dojo/domReady!',
    'dojo/request',
    'dojo/on',
    'dojo/_base/lang',
    'vonfry/lib/lunrjs',
    'dojo/keys'
], function(declare, query) {
    return  declare(null, {
        searchClass: 'search',
        showResult: function () {
            query(this.resultQuery).style('display', 'block');
            query(this.resultQuery).attr('data-show', '1');
        },
        hideResult: function () {
            query(this.resultQuery).style('display', 'none');
            query(this.resultQuery).attr('data-show', '0');
        },
        inputQuery: 'input[name="search"]',
        resultQuery: null,
        resultDOM: null,
        searchInput: null,
        searchJsonUrl: `${siteURL}/assets/js/search.json`,
        getSearchJSON: function(callback) {
            let self = this;
            let request = require('dojo/request');
            // Using ajax to get a json file and return a javascript object.
            request.get(this.searchJsonUrl, {
                handleAs: "json"
            }).then(function(data) {
                self.searchJSON = data;
                let lunrjs = require('vonfry/lib/lunrjs');
                let index = lunrjs(function() {
                    this.field('title');
                    this.field('content');
                    this.field('link');
                    this.field('date');
                    this.field('excerpt');
                    this.field('categories');
                    this.field('tags');
                    this.field('search_omit');
                    this.ref('id');
                });
                for (let idx in data) {
                    data[idx]['id'] = idx;
                    index.add(data[idx]);
                }
                self.lunrIdx = index;
                callback.apply(self);
            });
        },
        lunrIdx: null,
        searchJSON: null,
        searchText: function(text) {
            // search text with seanch.json by lunr
            // read data from window.searchJSON, and run getSearchJSON if the var is undefined.
            if (!this.searchJSON) {
                this.getSearchJSON(function() { this.searchText(text); });
                return;
            }// else {
            this.searchCallback(this.lunrIdx.search(text));
            // }
        },
        searchCallback: function(data) {
            // search callback, to show result.
            query(`.${this.searchClass} a.item`).remove('.item');
            query(`.${this.searchClass} .result`).attr('data-show', '1');
            this.showResult();
            let lang = require('dojo/_base/lang');
            for (let idx of data) {
                let row = this.searchJSON[idx.ref];
                let tpl = query(`.${this.searchClass} a.tpl`);
                tpl = lang.clone(tpl);
                tpl.removeClass('tpl');
                tpl.addClass('item');
                tpl.query('code.date')[0].innerText = row.date;
                tpl.query('code.title')[0].innerText = row.title;
                tpl.attr('title', row.excerpt);
                tpl.attr('href', siteURL + row.link);
                tpl.appendTo(`.${this.searchClass} .result`);
            }
        },
        searchfunc: function(evt) {
            let text = this.searchInput.value;
            this.searchText(text);
        },
        constructor: function(config = null) {
            declare.safeMixin(this, config);
            this.searchInput = query(`.${this.searchClass}`).query(this.inputQuery)[0];
            this.resultDOM = query(`.${this.searchClass}`).query('.result')[0];
            this.resultQuery = `.${this.searchClass} .result`;
            query(this.resultQuery).style('bottom', query('footer')[0].clientHeight + 'px');
            this.bindEvt();
        },
        bindEvt: function () {
            let on = require('dojo/on');
            let key = require('dojo/keys');
            // bind keyboard event for '/' to make input[name="search"] focus.
            let self = this;
            let hideResult = function() {
                self.hideResult.apply(self);
            };
            on(document, 'keydown', function(evt) {
                if (evt.keyCode == 191) { // '/'
                    self.searchInput.focus();
                    event.preventDefault();
                } else if (evt.keyCode == key.ESCAPE) {
                    hideResult();
                }
            });
            let searchfunc = function() {
                self.searchfunc.apply(self);
            };
            // do search with lunr
            on(this.searchInput, 'keydown', function(evt) {
                if (evt.keyCode == key.ENTER) {
                    searchfunc();
                }
            });
            on(query(this.resultQuery).query('.esc')[0], 'click', hideResult);
        }
    });
});
