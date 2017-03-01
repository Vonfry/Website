require([
    'vonfry/toc',
    'vonfry/lib/mathjax',
    'dojo/domReady!'
], function(Toc) {
    if (toc) {
        let toc = new Toc();
        toc.create();
    }
});
