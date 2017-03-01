require([
    'dojo/_base/declare',
    'dojo/query',
    'dojo/request',
    'dojo/dom-construct',
    'vonfry/lib/lunrjs',
    'dojo/_base/lang',
    'dojo/hash',
    'dojo/topic',
    'dojo/domReady!',
    'dojo/NodeList-dom',
    'dojo/NodeList-manipulate'
], function(declare, query, request, constructor, lunrjs, lang, hash, topic) {
    new declare(null, {
        parent: 'main.archive',
        changeType: function() {
            let type = query(this.parent).query('select.type')[0].value;
            if (type != 'nil') {
                hash('!'+type);
            }
        },
        changeArchive: function() {
            let type = query(this.parent).query('select.type')[0].value;
            let selType = query(this.parent).query(`select.archive.${type}`)[0].value;
            hash('!' + type + '/' + selType);
        },
        readAnchor: function() {
            let anchors = hash().slice(1).split('/');
            let type = anchors.length > 0 ? anchors[0] : null;
            let selType = anchors.length > 1 ? anchors[1] : 'nil';
            if (type && !selType) {
                query(this.parent).query('.list a.item').remove();
            }
            let selTypeDom = query(this.parent).query(`select.archive.${type}`);
            if (selTypeDom.length == 0) {
                return;
            }
            let typeDom = query(this.parent).query('select.type');
            typeDom[0].value = type;
            selTypeDom.style('display', 'inline-block');
            selTypeDom[0].value = selType;
            let unselTypeDom = query(this.parent).query(`select.archive:not(.${type})`);
            unselTypeDom.style('display', 'none');
            unselTypeDom[0].value = 'nil';
            this.search(type, selType);
        },
        hashChange: function() {
            let self = this;
            topic.subscribe("/dojo/hashchange", function() {
                self.readAnchor();
            });
        },
        searchJSONURL: `${siteURL}/assets/js/search.json`,
        getJSON: function(callback) {
            let self = this;
            request(this.searchJSONURL, {
                handleAs: 'json'
            }).then(function(data) {
                self.searchJSON = data;
                let tags = lunrjs(function() {
                    this.field("tags");
                    this.ref('id');
                });
                let cats = lunrjs(function() {
                    this.field("categories");
                    this.field('search_omit');
                    this.ref('id');
                });
                for (let idx in data) {
                    data[idx]['id'] = idx;
                    tags.add(data[idx]);
                    cats.add(data[idx]);
                }
                self.lunrIdx.cats = cats;
                self.lunrIdx.tags = tags;
                callback.apply(self);
            });
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
                query(this.parent).query('.list a.item').remove();
            } else {
                return;
            }
            for (let idx of data) {
                let row = this.searchJSON[idx.ref];
                let tpl = query(this.parent).query('a.tpl');
                tpl = lang.clone(tpl);
                tpl.removeClass('tpl');
                tpl.addClass('item');
                tpl.query('code.date')[0].innerText = row.date;
                tpl.query('code.title')[0].innerText = row.title;
                tpl.attr('title', row.excerpt);
                tpl.attr('href', siteURL + row.link);
                tpl.appendTo(this.parent + ' .list');
            }
        },
        bindEvt: function() {
            let self = this;
            query(this.parent).query('select.type')   .on('change', function() { self.changeType.apply(self); });
            query(this.parent).query('select.archive').on('change', function() { self.changeArchive.apply(self); });
            this.hashChange();
        },
        constructor: function() {
            this.bindEvt();
            this.readAnchor();
        }
    })();
});
