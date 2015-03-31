var QIH = QIH || {};

QIH.CFImageMap = (function () {

    var imageMap = function () { return $('ol.cf-image-map') } ();

    imageMap.bind('click', function (e) {
        var index = (e.target.className.replace('no', '') - 1);

        var accordion = CONSCIA.Accordions.accordions[0];

        if (index < accordion.currentIndex) { accordion.show(index, 'left'); }
        else if (index > accordion.currentIndex) { accordion.show(index, 'right'); }

        e.preventDefault();
    });

} ())