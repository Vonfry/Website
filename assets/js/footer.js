define(['lib/jquery', 'lib/domReady!'], function($) {
    let height = $('footer').height();
    $('.footer.placeholder').height(height);
    return null;
});
