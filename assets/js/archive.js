require([
    'lib/jquery',
    'lib/lunrjs',
    'lib/domReady!'
], function($, lunrjs) {
    var archive = {
        parent: 'main.archive',
        changeType: function() {
            let type = $(this.parent).query('select.type').val();
            if (type != 'nil') {
                window.location.hash = '#!/'+type;
            }
        },
        changeArchive: function() {
            let type = $('select.type', this.parent).val();
            let selType = $(`select.archive.${type}`, this.parent).val();
            window.location.hash = '#!/' + type + '/' + selType;
        },
        readAnchor: function() {
            let urlHash = window.location.hash;
            if (!urlHash.match(/^#!\//)) {
                console.error('hash error.');
                return;
            }
            let anchors = urlHash.slice(3).split('/');
            let type = anchors.length > 0 ? anchors[0] : null;
            let selType = anchors.length > 1 ? anchors[1] : 'nil';
            if (type && !selType) {
                $('.list a.item', this.parent).remove();
            }
            let selTypeDom = $(`select.archive.${type}`, this.parent);
            if (selTypeDom.length == 0) {
                return;
            }
            let typeDom = $('select.type', this.parent);
            typeDom.val(type);
            selTypeDom.css('display', 'inline-block');
            selTypeDom.val(selType);
            let unselTypeDom = $(`select.archive:not(.${type})`, this.parent);
            unselTypeDom.css('display', 'none');
            unselTypeDom.val('nil');
            this.search(type, selType);
        },
        hashChange: function() {
            let self = this;
            $(window).bind("hashchange", function() {
                self.readAnchor();
            });
        },
        searchJSONURL: `${siteURL}/assets/js/search.json`,
        getJSON: function(callback) {
            let self = this;
            $.ajax({
                url: this.searchJSONURL,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    self.searchJSON = data;
                    let tags = lunrjs(function() {
                        this.field("tags");
                        this.ref('id');
                        for (let idx in data) {
                            data[idx]['id'] = idx;
                            this.add(data[idx]);
                        }
                    });
                    let cats = lunrjs(function() {
                        this.field("categories");
                        this.field('search_omit');
                        this.ref('id');
                        for (let idx in data) {
                            data[idx]['id'] = idx;
                            this.add(data[idx]);
                        }
                    });
                    self.lunrIdx.cats = cats;
                    self.lunrIdx.tags = tags;
                    callback.apply(self);
                }});
        },
        lunrIdx: {
            tags: null,
            cats: null
        },
        searchJSON: null,
        search: function(type, query) {
            if (!this.lunrIdx[type]) {
                this.getJSON(function() { this.search(type, query); });
                return;
            }
            this.searchCallback(this.lunrIdx[type].search(query));
        },
        searchCallback: function(data) {
            if (data.length > 0) {
                $('.list a.item', this.parent).remove();
            } else {
                return;
            }
            for (let idx of data) {
                let row = this.searchJSON[idx.ref];
                let tpl = $('a.tpl', this.parent);
                tpl = $.extend(true, {}, tpl);
                tpl.removeClass('tpl');
                tpl.addClass('item');
                tpl.find('code.date').text(row.date);
                tpl.find('code.title').text(row.title);
                tpl.attr('title', row.excerpt);
                tpl.attr('href', siteURL + row.link);
                tpl.appendTo(this.parent + ' .list');
            }
        },
        bindEvt: function() {
            let self = this;
            $(this.parent).find('select.type')   .on('change', function() { self.changeType.apply(self); });
            $(this.parent).find('select.archive').on('change', function() { self.changeArchive.apply(self); });
            this.hashChange();
        },
        constructor: function() {
            this.bindEvt();
            this.readAnchor();
        }
    };
    archive.constructor();
});
