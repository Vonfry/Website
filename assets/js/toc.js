define([
    'lib/jquery'
], function($) {
    return {
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
        _TocTree:  {
            hx: 0,
            id: [0],
            title: null,
            next: null,
            child: null
        },
        dom: null, // toc dom.
        hide: function() {
            $(`#${this.tocId}`).addClass('toc-pop');
            $(`#${this.tocId}`).removeClass('toc-push');
        },
        show: function() {
            $(`#${this.tocId}`).addClass('toc-push');
            $(`#${this.tocId}`).removeClass('toc-pop');
        },
        event: function() {
            let self = this;
            if (this.tocNode) {
                $(this.tocNode).mouseenter(function() {
                    self.show.apply(self);
                });
                $(this.tocNode).mouseleave(function() {
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
            this.tocNode = $(`<div class="${this.tocClass}" id="${this.tocId}"></div>`).insertAfter(this.after);
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
                let className = `${tocClass} ${tocIndent} ${tocHx}`;
                let idName = `${this.tocId}-${node.id.join(this.headerIdSeparator)}`;
                let textName = `<a href='#${headerAnchor}'>${node.title}</a>`;
                $(`<p class="${className}" id="idName">${textName}</p>`).appendTo(this.tocNode);
                g([node.child, level + 1]);
                g([node.next, level]);
            })([this.toc, 0]);
            this.event();
            return this.tocNode;
        },
        readHeader: function() {
            this.toc = null;
            let self = this;
            $(this.query).children().each(function(idx, e) {
                let match = e.tagName ? e.tagName.match(/h(\d)/i): false;
                if (!(match && self.header.indexOf(parseInt(match[1])) != -1)) {
                    return;
                }
                let header = $.extend(true, {}, self._TocTree);
                header.hx = parseInt(match[1]);
                header.title = e.innerText;
                let toc = self.toc;
                while (toc || !(self.toc = header)) { // Because of short-circuit evaluation
                    header.id = $.extend(true, [], toc.id);
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
                e.id = self.headerIdPrefix + self.headerIdSeparator + header.id.join(self.headerIdSeparator);
            });
            return this.toc;
        },
        constructor: function(config = null) {
            $.extend(true, this, config);
        }
    };
});
