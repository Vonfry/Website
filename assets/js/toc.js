define([
    'dojo/_base/declare',
    'dojo/query',
    'dojo/domReady!',
    'dojo/dom-construct',
    'dojo/mouse',
    'dojo/on',
    'dojo/dom-class'
], function(declare, query) {
    return declare(null, {
        query: 'article', // tag for query and iter
        after: 'main', // A parent query where to append the toc. By default, it is body and styled with fixed.
        header: [1, 2, 3, 4, 5, 6],
        level: 2, // create deepth of toc
        headerIdPrefix: 'toc',
        headerIdSeparator: '-',
        tocClass: 'toc',
        tocId: 'toc',
        toc: null, // save toc tree
        tocNode: null,
        _TocTree: declare(null, {
            hx: 0,
            id: [0],
            title: null,
            next: null,
            child: null
        }),
        dom: null, // toc dom.
        hide: function() {
            query(`#${this.tocId}`).addClass('toc-pop');
            query(`#${this.tocId}`).removeClass('toc-push');
        },
        show: function() {
            query(`#${this.tocId}`).addClass('toc-push');
            query(`#${this.tocId}`).removeClass('toc-pop');
        },
        event: function() {
            let mouse = require('dojo/mouse');
            let self = this;
            let on = require('dojo/on');
            if (this.tocNode) {
                on(this.tocNode, mouse.enter, function() {
                    self.show.apply(self);
                });
                on(this.tocNode, mouse.leave, function() {
                    self.hide.apply(self);
                });
            }
        },
        destory: function() {
            this.dom.remove();
            this.dom = null;
        },
        create: function() {
            this.readHeader();
            let constructor = require('dojo/dom-construct');
            this.tocNode = constructor.create('div', {
                className: this.tocClass,
                id: this.tocId
            }, query(this.after)[0], 'after');
            // Fixed-point combinator / Y combinator;
            (f => (g => g(g))(g => f(x => g(g)(x))))(g => (args) => {
                let node = args[0];
                let level = args[1];
                if (!(node && level < this.level)) {
                    return;
                }
                let tocClass = this.tocClass + this.headerIdSeparator + 'node';
                let tocIndent = `${this.tocClass}${this.headerIdSeparator}indent${this.headerIdSeparator}${level + 1}`;
                let tocHx = `${this.tocClass}${this.headerIdSeparator}hx${this.headerIdSeparator}${node.hx}`;
                let headerAnchor = this.headerIdPrefix + this.headerIdSeparator + node.id.join(this.headerIdSeparator);
                constructor.create('p', {
                    className: `${tocClass} ${tocIndent} ${tocHx}`,
                    id: `${this.tocId}-${node.id.join(this.headerIdSeparator)}`,
                    innerHTML: `<a href='#${headerAnchor}'>${node.title}</a>`
                }, this.tocNode, 'last');
                g([node.child, level + 1]);
                g([node.next, level]);
            })([this.toc, 0]);
            this.event();
            return this.tocNode;
        },
        readHeader: function() {
            this.toc = null;
            let self = this;
            query(this.query)[0].childNodes.forEach(function(tag) {
                let match = tag.tagName ? tag.tagName.match(/h(\d)/i): false;
                if (!(match && self.header.indexOf(parseInt(match[1])) != -1)) {
                    return;
                }
                let header = new self._TocTree();
                header.hx = parseInt(match[1]);
                header.title = tag.innerText;
                let toc = self.toc;
                while (toc || !(self.toc = header)) { // Because of short-circuit evaluation
                    header.id = toc.id;
                    if (toc.hx < header.hx) {
                        if (toc.child) {
                            toc = toc.child;
                        } else {
                            toc.child = header;
                            break;
                        }
                            toc = toc.child;
                    } else /* if (toc.hx >= header.hx) */ {
                        if (toc.next) {
                            toc = toc.next;
                        } else {
                            toc.next = header;
                            break;
                        }
                    }
                }
                ++header.id[header.id.length - 1];
                tag.id = this.headerIdPrefix + this.headerIdPrefix + header.id.join(this.headerIdPrefix);
            });
            return this.toc;
        },
        constructor: function(config = null) {
            declare.safeMixin(this, config);
        }
    });
});
