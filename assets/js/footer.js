define(['dojo/query', 'dojo/domReady!'], function(query) {
    let height = query('footer').style('height')[0];
    query('.footer.placeholder').style('height', height + 'px');
    return null;
});
