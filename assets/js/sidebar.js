define(['dojo/query', 'dojo/dom-class', 'dojo/mouse', 'dojo/domReady!'], function(query, domClass, mouse) {
    // set copyright placeholder height
    let footer = query('footer');
    let footerPlaceholder = query('.sidebar .footer.placeholder');
    footerPlaceholder.style('height', footer.style('height')[0]+'px');

    // set magic button event
    let toggleSidebar = function(evt) {
        let hasPush  = domClass.contains(query('.sidebar')[0], 'push-magic');
        if (!hasPush) {
            query('main, .sidebar').removeClass('pop-magic');
            query('main, .sidebar').addClass('push-magic');
        } else {
            query('main, .sidebar').removeClass('push-magic');
            query('main, .sidebar').addClass('pop-magic');
        }
    };
    query('.sidebar').on(mouse.enter, toggleSidebar);
    query('.sidebar').on(mouse.leave, toggleSidebar);
    return null;
});
