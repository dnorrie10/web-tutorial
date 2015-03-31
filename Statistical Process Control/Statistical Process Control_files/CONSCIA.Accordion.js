var CONSCIA = CONSCIA || {};

CONSCIA.Accordion = function (el) {

    var accordion = {}, // Return object 
	shell = this; // Reference back to the base object

    accordion.currentIndex = 0;

    var items = function () {
        return el.find('li.ces-accordion-item');
    } (); // Get all items for this instance

    var width = items.innerWidth();

    items.filter("li:gt(0)").css('left', width);

    // Bind actions
    el.find('.ces-prev')
	.bind('click', function (e) { accordion.showPrev(); e.preventDefault(); })
	.end()
	.find('.ces-next')
	.bind('click', function (e) { accordion.showNext(); e.preventDefault(); })

    // Private method to show a particular index
    var show = accordion.show = function (i, dir) {

        items.filter('li:not(' + accordion.currentIndex + ')').removeAttr('style').css(dir, width);

        var options = { right: '0' };

        if (dir === 'left') { options = { left: '0'} };

        if (i < items.length && i >= 0) {
            items.eq(i).removeAttr('style').css(dir,width).animate(options, 500);
            accordion.currentIndex = i;
        }
        else if (i < 0) {
            var index = items.length - 1
            items.eq(index).removeAttr('style').css(dir, width).animate(options, 500);
            accordion.currentIndex = index;
        }
        else {
            items.eq(0).removeAttr('style').css(dir, width).animate(options, 500);
            accordion.currentIndex = 0;
        }

    };

    // Public method to show next item
    accordion.showNext = function () {
        var index = accordion.currentIndex + 1;
        show(index, 'right');
    };

    // Public method to show previous item
    accordion.showPrev = function () {
        var index = accordion.currentIndex - 1;
        show(index, 'left');
    };

    return accordion;

};

CONSCIA.Accordions = (function () {

    var rtnAccordions = {};

    // Get all accordions on the page	
    var accordions = function () {
        return $('ul.ces-accordion').addClass('js-on');
    } ();

    rtnAccordions.accordions = [];

    // Create new instances for each accordion
    for (var i = 0, j = accordions.length; i < j; i++) {
        rtnAccordions.accordions.push(new CONSCIA.Accordion($(accordions[i])));
    }

    return rtnAccordions;

})();
