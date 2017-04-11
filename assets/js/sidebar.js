define(['lib/jquery'], function($) {
    // set copyright placeholder height
    let footer = $('footer');
    let footerPlaceholder = $('.sidebar .footer.placeholder');
    footerPlaceholder.css('height', footer.height());

    // set magic button event
    let toggleSidebar = function(evt) {
        let hasPush  = $('.sidebar').hasClass('push-magic');
        if (!hasPush) {
            $('main, .sidebar').removeClass('pop-magic');
            $('main, .sidebar').addClass('push-magic');
        } else {
            $('main, .sidebar').removeClass('push-magic');
            $('main, .sidebar').addClass('pop-magic');
        }
    };
    $('.sidebar').mouseenter(toggleSidebar);
    $('.sidebar').mouseleave(toggleSidebar);
    return null;
});
