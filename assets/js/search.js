define([
    'require',
    'lib/jquery',
    'lib/lunrjs',
], function(require, $) {
    return {
        searchClass: 'search',
        showResult: function () {
            $(this.resultQuery).css('display', 'block');
            $(this.resultQuery).attr('data-show', '1');
        },
        hideResult: function () {
            $(this.resultQuery).css('display', 'none');
            $(this.resultQuery).attr('data-show', '0');
        },
        inputQuery: 'input[name="search"]',
        resultQuery: null,
        resultDOM: null,
        searchInput: null,
        searchJsonUrl: `${siteURL}/assets/js/search.json`,
        getSearchJSON: function(callback) {
            let self = this;
            // Using ajax to get a json file and return a javascript object.
            $.get(this.searchJsonUrl, null, function(data) {
                self.searchJSON = data;
                let lunrjs = require('lib/lunrjs');
                let index = lunrjs(function() {
                    this.ref('id');
                    this.field('title');
                    this.field('content');
                    this.field('link');
                    this.field('date');
                    this.field('excerpt');
                    this.field('categories');
                    this.field('tags');
                    this.field('search_omit');
                    for (let idx in data) {
                        let addation = data[idx];
                        addation['id'] = idx.toString();
                        this.add(addation);
                    }
                });
                self.lunrIdx = index;
                callback.apply(self);
            }, 'json');
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
            $(`.${this.searchClass} a.item`).remove('.item');
            $(`.${this.searchClass} .result`).attr('data-show', '1');
            this.showResult();
            for (let idx of data) {
                let row = this.searchJSON[idx.ref];
                let tpl = $(`.${this.searchClass} a.tpl`);
                tpl = tpl.clone();
                tpl.removeClass('tpl');
                tpl.addClass('item');
                tpl.find('code.date').text(row.date);
                tpl.find('code.title').text(row.title);
                tpl.attr('title', row.excerpt);
                tpl.attr('href', siteURL + row.link);
                tpl.appendTo(`.${this.searchClass} .result`);
            }
        },
        searchfunc: function(evt) {
            let text = this.searchInput.val();
            this.searchText(text);
        },
        constructor: function(config = null) {
            $.extend(true, this, config);
            this.searchInput = $(this.inputQuery, `.${this.searchClass}`);
            this.resultDOM = $('.result', `.${this.searchClass}`);
            this.resultQuery = `.${this.searchClass} .result`;
            $(this.resultQuery).css('bottom', $('footer').height());
            this.bindEvt();
        },
        bindEvt: function () {
            // bind keyboard event for '/' to make input[name="search"] focus.
            let self = this;
            let hideResult = function() {
                self.hideResult.apply(self);
            };
            $(document).on('keydown', function(evt) {
                if (evt.which == 191) { // '/'
                    self.searchInput.focus();
                    event.preventDefault();
                } else if (evt.which == 27 /* esc */) {
                    hideResult();
                }
            });
            let searchfunc = function() {
                self.searchfunc.apply(self);
            };
            // do search with lunr
            $(this.searchInput).on('keydown', function(evt) {
                if (evt.which == 13 /* entry */) {
                    searchfunc();
                }
            });
            $('.esc', this.resultQuery).on('click', hideResult);
        }
    };
});
