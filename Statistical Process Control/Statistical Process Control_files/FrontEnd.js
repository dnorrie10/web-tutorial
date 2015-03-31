$(document).ready(function()
{
    var scrollPosition = getCookie('autoScroll_scrollPosition');
    var rememberScroll = getCookie('autoScroll_rememberScroll');

    if (scrollPosition && rememberScroll)
    {
        $(window).scrollTop(scrollPosition);
        deleteCookie('autoScroll_rememberScroll');
    }

    $('.jqAutoScroll').click(function()
    {
        setCookie('autoScroll_rememberScroll', true);

        return true;
    });
});

$(window).scroll(function()
{
    document.cookie = "autoScroll_scrollPosition=" + $(this).scrollTop();
});

function getCookie(name)
{
    name = escape($.trim(name));

    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++)
    {
        var cookieCrumbs = cookies[i].split('=');
        var cookieName = $.trim(cookieCrumbs[0]);
        var cookieValue = cookieCrumbs[1];

        if (cookieName == name && cookieValue != null)
        {
            return unescape(cookieValue);
        }
    }

    return false;
}

function setCookie(name, value)
{
    document.cookie = escape($.trim(name)) + '=' + escape(value) + ';path=/';
}

function deleteCookie(name)
{
    document.cookie = escape($.trim(name)) + '=;expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
}



/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*	interval: 100,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 0,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};
})(jQuery);

jQuery.autocomplete = function(input, options)
{
    // Create a link to self
    var me = this;

    // Create jQuery object for input element
    var $input = $(input).attr("autocomplete", "off");

    // Apply inputClass if necessary
    if (options.inputClass) $input.addClass(options.inputClass);

    // Create results
    var results = document.createElement("div");
    // Create jQuery object for results
    var $results = $(results);
    $results.hide().addClass(options.resultsClass).css("position", "absolute");
    if (options.width > 0) $results.css("width", options.width);

    // Add to body element
    $("body").append(results);

    input.autocompleter = me;

    var timeout = null;
    var prev = "";
    var active = -1;
    var cache = {};
    var keyb = false;
    var hasFocus = false;
    var lastKeyPressCode = null;

    // flush cache
    function flushCache()
    {
        cache = {};
        cache.data = {};
        cache.length = 0;
    };

    // flush cache
    flushCache();

    // if there is a data array supplied
    if (options.data != null)
    {
        var sFirstChar = "", stMatchSets = {}, row = [];

        // no url was specified, we need to adjust the cache length to make sure it fits the local data store
        if (typeof options.url != "string") options.cacheLength = 1;

        // loop through the array and create a lookup structure
        for (var i = 0; i < options.data.length; i++)
        {
            // if row is a string, make an array otherwise just reference the array
            row = ((typeof options.data[i] == "string") ? [options.data[i]] : options.data[i]);

            // if the length is zero, don't add to list
            if (row[0].length > 0)
            {
                // get the first character
                sFirstChar = row[0].substring(0, 1).toLowerCase();
                // if no lookup array for this character exists, look it up now
                if (!stMatchSets[sFirstChar]) stMatchSets[sFirstChar] = [];
                // if the match is a string
                stMatchSets[sFirstChar].push(row);
            }
        }

        // add the data items to the cache
        for (var k in stMatchSets)
        {
            // increase the cache size
            options.cacheLength++;
            // add to the cache
            addToCache(k, stMatchSets[k]);
        }
    }

    $input
	.keydown(function(e)
	{
	    // track last key pressed
	    lastKeyPressCode = e.keyCode;
	    switch (e.keyCode)
	    {
	        case 38: // up
	            e.preventDefault();
	            moveSelect(-1);
	            break;
	        case 40: // down
	            e.preventDefault();
	            moveSelect(1);
	            break;
	        case 9:  // tab
	        case 13: // return
	            if (selectCurrent())
	            {
	                // make sure to blur off the current field
	                $input.get(0).blur();
	                e.preventDefault();
	            }
	            break;
	        default:
	            active = -1;
	            if (timeout) clearTimeout(timeout);
	            timeout = setTimeout(function() { onChange(); }, options.delay);
	            break;
	    }
	})
	.focus(function()
	{
	    // track whether the field has focus, we shouldn't process any results if the field no longer has focus
	    hasFocus = true;
	})
	.blur(function()
	{
	    // track whether the field has focus
	    hasFocus = false;
	    hideResults();
	});

    hideResultsNow();

    function onChange()
    {
        // ignore if the following keys are pressed: [del] [shift] [capslock]
        if (lastKeyPressCode == 32 || lastKeyPressCode == 188 || lastKeyPressCode == 46 || (lastKeyPressCode > 8 && lastKeyPressCode < 32)) return $results.hide();

        //alert(lastKeyPressCode);

        // MODIFICATION to support commas
        var v = $input.val();
        if (v.lastIndexOf(',') > 0)
        {
            v = v.substring(v.lastIndexOf(',') + 1, v.length);
        }

        v = $.trim(v);

        if (v == prev) return;
        prev = v;
        if (v.length >= options.minChars)
        {
            $input.addClass(options.loadingClass);
            requestData(v);
        } else
        {
            $input.removeClass(options.loadingClass);
            $results.hide();
        }
    };

    function moveSelect(step)
    {

        var lis = $("li", results);
        if (!lis) return;

        active += step;

        if (active < 0)
        {
            active = 0;
        } else if (active >= lis.size())
        {
            active = lis.size() - 1;
        }

        lis.removeClass("ac_over");

        $(lis[active]).addClass("ac_over");

        // Weird behaviour in IE
        // if (lis[active] && lis[active].scrollIntoView) {
        // 	lis[active].scrollIntoView(false);
        // }

    };

    function selectCurrent()
    {
        var li = $("li.ac_over", results)[0];
        if (!li)
        {
            var $li = $("li", results);
            if (options.selectOnly)
            {
                if ($li.length == 1) li = $li[0];
            } else if (options.selectFirst)
            {
                li = $li[0];
            }
        }
        if (li)
        {
            selectItem(li);
            return true;
        } else
        {
            return false;
        }
    };

    function selectItem(li)
    {
        if (!li)
        {
            li = document.createElement("li");
            li.extra = [];
            li.selectValue = "";
        }
        var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
        input.lastSelected = v;
        prev = v;
        $results.html("");

        // MODIFICATION to support tagging
        if ($input.val().indexOf(',') > 0)
        {
            $input.val($input.val().substring(0, $input.val().lastIndexOf(',')) + ", " + v);
        }
        else
        {
            $input.val(v);
        }
        hideResultsNow();

        $input.focus();

        if (options.onItemSelect) setTimeout(function() { options.onItemSelect(li) }, 1);
    };

    // selects a portion of the input string
    function createSelection(start, end)
    {
        // get a reference to the input element
        var field = $input.get(0);
        if (field.createTextRange)
        {
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart("character", start);
            selRange.moveEnd("character", end);
            selRange.select();
        } else if (field.setSelectionRange)
        {
            field.setSelectionRange(start, end);
        } else
        {
            if (field.selectionStart)
            {
                field.selectionStart = start;
                field.selectionEnd = end;
            }
        }
        field.focus();
    };

    // fills in the input box w/the first match (assumed to be the best match)
    function autoFill(sValue)
    {
        // if the last user key pressed was backspace, don't autofill
        if (lastKeyPressCode != 8)
        {
            // fill in the value (keep the case the user has typed)
            $input.val($input.val() + sValue.substring(prev.length));
            // select the portion of the value not typed by the user (so the next character will erase)
            createSelection(prev.length, sValue.length);
        }
    };

    function showResults()
    {
        // get the position of the input field right now (in case the DOM is shifted)
        var pos = findPos(input);
        // either use the specified width, or autocalculate based on form element
        var iWidth = (options.width > 0) ? options.width : $input.width();
        // reposition
        $results.css({
            width: parseInt(iWidth) + "px",
            top: (pos.y + input.offsetHeight) + "px",
            left: pos.x + "px"
        }).show();
    };

    function hideResults()
    {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(hideResultsNow, 200);
    };

    function hideResultsNow()
    {
        if (timeout) clearTimeout(timeout);
        $input.removeClass(options.loadingClass);
        if ($results.is(":visible"))
        {
            $results.hide();
        }
        if (options.mustMatch)
        {
            var v = $input.val();
            if (v != input.lastSelected)
            {
                selectItem(null);
            }
        }
    };

    function receiveData(q, data)
    {
        if (data)
        {
            $input.removeClass(options.loadingClass);
            results.innerHTML = "";

            // if the field no longer has focus or if there are no matches, do not display the drop down
            if (!hasFocus || data.length == 0) return hideResultsNow();

            if ($.browser.msie)
            {
                // we put a styled iframe behind the calendar so HTML SELECT elements don't show through
                $results.append(document.createElement('iframe'));
            }
            results.appendChild(dataToDom(data));
            // autofill in the complete box w/the first match as long as the user hasn't entered in more data
            if (options.autoFill && ($input.val().toLowerCase() == q.toLowerCase())) autoFill(data[0][0]);
            showResults();
        } else
        {
            hideResultsNow();
        }
    };

    function parseData(data)
    {
        if (!data) return null;
        var parsed = [];
        var rows = data.split(options.lineSeparator);
        for (var i = 0; i < rows.length; i++)
        {
            var row = $.trim(rows[i]);
            if (row)
            {
                parsed[parsed.length] = row.split(options.cellSeparator);
            }
        }
        return parsed;
    };

    function escapeHTML(str)
    {
        var div = document.createElement('div');
        var text = document.createTextNode(str);
        div.appendChild(text);
        return div.innerHTML;
    }

    function dataToDom(data)
    {
        var ul = document.createElement("ul");
        var num = data.length;

        // limited results to a max number
        if ((options.maxItemsToShow > 0) && (options.maxItemsToShow < num)) num = options.maxItemsToShow;

        for (var i = 0; i < num; i++)
        {
            var row = data[i];
            if (!row) continue;
            var li = document.createElement("li");
            if (options.formatItem)
            {
                li.innerHTML = escapeHTML(options.formatItem(row, i, num));
                li.selectValue = row[0];
            } else
            {
                li.innerHTML = escapeHTML(row[0]);
                li.selectValue = row[0];
            }
            var extra = null;
            if (row.length > 1)
            {
                extra = [];
                for (var j = 1; j < row.length; j++)
                {
                    extra[extra.length] = row[j];
                }
            }
            li.extra = extra;
            ul.appendChild(li);
            $(li).hover(
				function() { $("li", ul).removeClass("ac_over"); $(this).addClass("ac_over"); active = $("li", ul).indexOf($(this).get(0)); },
				function() { $(this).removeClass("ac_over"); }
			).click(function(e) { e.preventDefault(); e.stopPropagation(); selectItem(this) });
        }
        return ul;
    };

    function requestData(q)
    {
        if (!options.matchCase) q = q.toLowerCase();
        var data = options.cacheLength ? loadFromCache(q) : null;
        // recieve the cached data
        if (data)
        {
            receiveData(q, data);
            // if an AJAX url has been supplied, try loading the data now
        } else if ((typeof options.url == "string") && (options.url.length > 0))
        {
            $.get(makeUrl(q), function(data)
            {
                data = parseData(data);
                addToCache(q, data);
                receiveData(q, data);
            });
            // if there's been no data found, remove the loading class
        } else
        {
            $input.removeClass(options.loadingClass);
        }
    };

    function makeUrl(q)
    {
        var url = '';
        if (options.url.indexOf('?') > 0)
        {
            url = options.url + "&q=" + encodeURI(q);
        }
        else
        {
            url = options.url + "?q=" + encodeURI(q);
        }

        for (var i in options.extraParams)
        {
            url += "&" + i + "=" + encodeURI(options.extraParams[i]);
        }
        return url;
    };

    function loadFromCache(q)
    {
        if (!q) return null;
        if (cache.data[q]) return cache.data[q];
        if (options.matchSubset)
        {
            for (var i = q.length - 1; i >= options.minChars; i--)
            {
                var qs = q.substr(0, i);
                var c = cache.data[qs];
                if (c)
                {
                    var csub = [];
                    for (var j = 0; j < c.length; j++)
                    {
                        var x = c[j];
                        var x0 = x[0];
                        if (matchSubset(x0, q))
                        {
                            csub[csub.length] = x;
                        }
                    }
                    return csub;
                }
            }
        }
        return null;
    };

    function matchSubset(s, sub)
    {
        if (!options.matchCase) s = s.toLowerCase();
        var i = s.indexOf(sub);
        if (i == -1) return false;
        return i == 0 || options.matchContains;
    };

    this.flushCache = function()
    {
        flushCache();
    };

    this.setExtraParams = function(p)
    {
        options.extraParams = p;
    };

    this.findValue = function()
    {
        var q = $input.val();

        if (!options.matchCase) q = q.toLowerCase();
        var data = options.cacheLength ? loadFromCache(q) : null;
        if (data)
        {
            findValueCallback(q, data);
        } else if ((typeof options.url == "string") && (options.url.length > 0))
        {
            $.get(makeUrl(q), function(data)
            {
                data = parseData(data)
                addToCache(q, data);
                findValueCallback(q, data);
            });
        } else
        {
            // no matches
            findValueCallback(q, null);
        }
    }

    function findValueCallback(q, data)
    {
        if (data) $input.removeClass(options.loadingClass);

        var num = (data) ? data.length : 0;
        var li = null;

        for (var i = 0; i < num; i++)
        {
            var row = data[i];

            if (row[0].toLowerCase() == q.toLowerCase())
            {
                li = document.createElement("li");
                if (options.formatItem)
                {
                    li.innerHTML = options.formatItem(row, i, num);
                    li.selectValue = row[0];
                } else
                {
                    li.innerHTML = row[0];
                    li.selectValue = row[0];
                }
                var extra = null;
                if (row.length > 1)
                {
                    extra = [];
                    for (var j = 1; j < row.length; j++)
                    {
                        extra[extra.length] = row[j];
                    }
                }
                li.extra = extra;
            }
        }

        if (options.onFindValue) setTimeout(function() { options.onFindValue(li) }, 1);
    }

    function addToCache(q, data)
    {
        if (!data || !q || !options.cacheLength) return;
        if (!cache.length || cache.length > options.cacheLength)
        {
            flushCache();
            cache.length++;
        } else if (!cache[q])
        {
            cache.length++;
        }
        cache.data[q] = data;
    };

    function findPos(obj)
    {
        var curleft = obj.offsetLeft || 0;
        var curtop = obj.offsetTop || 0;
        while (obj = obj.offsetParent)
        {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
        return { x: curleft, y: curtop };
    }
}

jQuery.fn.autocomplete = function(url, options, data)
{
    // Make sure options exists
    options = options || {};
    // Set url as option
    options.url = url;
    // set some bulk local data
    options.data = ((typeof data == "object") && (data.constructor == Array)) ? data : null;

    // Set default values for required options
    options.inputClass = options.inputClass || "ac_input";
    options.resultsClass = options.resultsClass || "ac_results";
    options.lineSeparator = options.lineSeparator || "\n";
    options.cellSeparator = options.cellSeparator || "|";
    options.minChars = options.minChars || 1;
    options.delay = options.delay || 400;
    options.matchCase = options.matchCase || 0;
    options.matchSubset = options.matchSubset || 1;
    options.matchContains = options.matchContains || 0;
    options.cacheLength = options.cacheLength || 1;
    options.mustMatch = options.mustMatch || 0;
    options.extraParams = options.extraParams || {};
    options.loadingClass = options.loadingClass || "ac_loading";
    options.selectFirst = options.selectFirst || false;
    options.selectOnly = options.selectOnly || false;
    options.maxItemsToShow = options.maxItemsToShow || -1;
    options.autoFill = options.autoFill || false;
    options.width = parseInt(options.width, 10) || 0;

    this.each(function()
    {
        var input = this;
        new jQuery.autocomplete(input, options);
    });

    // Don't break the chain
    return this;
}

jQuery.fn.autocompleteArray = function(data, options)
{
    return this.autocomplete(null, options, data);
}

jQuery.fn.indexOf = function(e)
{
    for (var i = 0; i < this.length; i++)
    {
        if (this[i] == e) return i;
    }
    return -1;
};

$(function() {
    if ($('.accordionLinks').length) {
        AccordionWidgetInitContent();
    }
})

function AccordionWidgetInitContent() {
    $(".accordionLinks ul.linksGroupList h3").wrapInner("<a href='#'></a>");
    $(".accordionLinks ul.linksGroupList h3").addClass("jsLink");
    $(".accordionLinks ul.linksGroupList div.wrapper").hide();
    showGroupLinks($(".accordionLinks ul.linksGroupList  div.wrapper:first"));
    $(".accordionLinks ul.linksGroupList h3").click(function() {
        var status = $(this).children("img").attr("class");
        if (status == "showArrow") {
            collapseGroupLinks($(this));
            return false;
        } else {
            showGroupLinks($(this));
            return false;
        }
    });
}

function collapseGroupLinks(current) {
    $(".accordionLinks .selected div.wrapper").slideUp();
    current.parent().removeClass("selected");
}

function showGroupLinks(current) {
    $(".accordionLinks .selected div.wrapper").slideUp();
    $(".accordionLinks .selected").removeClass("selected");
    current.parent().addClass("selected");
    current.parent().children("div.wrapper").slideDown();
}

$(document).ready(function () {

    $("li.AudiencePanel div.boxContent").addClass("audienceBoxContent");
    $("li.AudiencePanel div.boxContent").removeClass("boxContent");
    $("li.AudiencePanel div.OuterContent").removeClass("OuterContent");
    $("li.AudiencePanel div.boxInner").addClass("audienceBoxInner");
    $("li.AudiencePanel div.boxInner").removeClass("boxInner");

    //  Disable the action click if no link is present.
    $("li.AudiencePanel a[href='#']").unbind("click");


    $("li.AudiencePanel a[href = '#']").click(function () {
        return false;
    });

});



/* Rotating Panel */

var rotatingPanel = function () {

    this.rotatingActions = {};

    var panels = [];
    var rotating = false;

    return {
        init: function () {
            // Get rotating panels and store them in a private array
            $('div#audiencePanelWidget div.rotating-feature').each(function (i) {
                panels.push($(this));
            })

            // If this results in more than one panel begin rotating and setup pager
            if (panels.length > 1) {
                rotatingPanel.rotatingActions = $('span#action1, ul#actions a');

                // Add click handlers to the actions container and allow events to bubble
                rotatingPanel.rotatingActions.mouseenter(function (e) {
                    var action = $(this);

                    action.addClass('hasFocus')
                    .oneTime(50, function () {
                        if (action.hasClass('hasFocus')) {
                            var id = $(this).attr('id');
                            rotatingPanel.rotatingActions.removeClass('current');
                            action.addClass('current');
                            rotatingPanel.state = "stopped";
                            rotatingPanel.rotate(null, id.replace('action', ''), true); // Call public rotate panel method when event activated
                        }
                    });

                }).mouseleave(function () { rotatingPanel.state = "started"; $(this).removeClass('hasFocus'); });
            }
        },
        currentIndex: 0,
        state: "started", /* "started" or "stopped". Bit of a hack to prevent the timer being started on callback of the hide animations */
        // Function to allow all panels to be shown and timers stopped
        showAllPanels: function () {
            this.state = "stopped";
            for (var ii = 0, jj = panels.length; ii < jj; ii = ii + 1) {
                panels[ii].show(0);
            }
        },
        // Resets all the panels to start rotating again
        reset: function () {
            for (var ii = 1, jj = panels.length; ii < jj; ii = ii + 1) {
                panels[ii].hide(0);
            }
            this.state = "started";
            this.rotate(null, 1, true);
        },
        rotate: function (direction, index, noFade) {

            if (!rotating) {
                rotating = true;
                var oldIndex = this.currentIndex; // Store of the old index for refernce later

                // If moving back decrement else if forward increment anything else does nothing
                if (direction && direction === 'prev') {
                    this.currentIndex--;

                    if (this.currentIndex < 0) {
                        this.currentIndex = (panels.length - 1);
                    }
                }
                else if (direction && direction === 'next') {
                    this.currentIndex++;

                    if (this.currentIndex > (panels.length - 1)) {
                        this.currentIndex = 0;
                    }
                }
                else if (index > 0) {
                    this.currentIndex = (index - 1);
                }

                if (noFade) {
                    panels[oldIndex].hide(0,
                    function () {
                        rotatingPanel.rotatingActions.removeClass('current');
                        rotatingPanel.rotatingActions.filter('[id="action' + (rotatingPanel.currentIndex + 1) + '"]').addClass('current');
                    }); // Fade old panel out
                    panels[rotatingPanel.currentIndex].show(0, function () { rotating = false; }); // Fade new panel in and on completion begin timer again
                }
                else {
                    panels[oldIndex].fadeOut(500,
                    function () {
                        rotatingPanel.rotatingActions.removeClass('current');
                        rotatingPanel.rotatingActions.filter('[id="action' + (rotatingPanel.currentIndex + 1) + '"]').addClass('current');
                        panels[rotatingPanel.currentIndex].fadeIn(500, function () { rotating = false; }); // Fade new panel in and on completion begin timer again
                    }); // Fade old panel out
                }
            }
        }
    }
} ();

$(document).ready(function () { rotatingPanel.init(); });


/*  ContentFlow, version 1.0.2 
*  (c) 2007 - 2010 Sebastian Kutsch
*  <http://www.jacksasylum.eu/ContentFlow/>
*
*  ContentFlow is distributed under the terms of the MIT license.
*  (see http://www.jacksasylum.eu/ContentFlow/LICENSE)
*
*--------------------------------------------------------------------------*/
/* 
* ============================================================
* Global configutaion and initilization object
* ============================================================
*/
var ContentFlowGlobal = {
    Flows: new Array,
    AddOns: {},
    scriptName: 'FrontEnd.js', //'contentflow.js'
    scriptElement: null,
    Browser: new (function() {
        this.Opera = window.opera ? true : false;
        this.IE = document.all && !this.Opera ? true : false;
        this.IE6 = this.IE && typeof (window.XMLHttpRequest) == "undefined" ? true : false;
        this.IE8 = this.IE && typeof (document.querySelectorAll) != "undefined" ? true : false;
        this.IE7 = this.IE && !this.IE6 && !this.IE8 ? true : false;
        this.WebKit = /WebKit/i.test(navigator.userAgent) ? true : false,
        this.iPhone = /iPhone|iPod/i.test(navigator.userAgent) ? true : false;
        this.Chrome = /Chrome/i.test(navigator.userAgent) ? true : false;
        this.Safari = /Safari/i.test(navigator.userAgent) && !this.Chrome ? true : false;
        this.Konqueror = navigator.vendor == "KDE" ? true : false;
        this.Konqueror4 = this.Konqueror && /native code/.test(document.getElementsByClassName) ? true : false;
        this.Gecko = !this.WebKit && navigator.product == "Gecko" ? true : false;
        this.Gecko19 = this.Gecko && Array.reduce ? true : false;
    })(),

    getAddOnConf: function(name) {
        if (this.AddOns[name])
            return this.AddOns[name].conf;
        else
            return {};
    },

    setAddOnConf: function(name, conf) {
        this.AddOns[name].setConfig(conf);
    },

    getScriptElement: function(scriptName) {
        var regex = new RegExp(scriptName);
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && regex.test(scripts[i].src))
                return scripts[i];
        }
        return '';
    },

    getScriptPath: function(scriptElement, scriptName) {
        var regex = new RegExp(scriptName + ".*");
        return scriptElement.src.replace(regex, '');
    },

    addScript: function(path) {
        if (this.Browser.IE || this.Browser.WebKit || this.Browser.Konqueror) {
            document.write('<script type="text/javascript" src="' + path + '"><\/script>');
        }
        else {
            var script = document.createElement('script');
            script.src = path;
            script.setAttribute('type', 'text/javascript');
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    },

    addScripts: function(basePath, filenames) {
        for (var i = 0; i < filename.length; i++)
            this.addScript(basepath + filenames[i]);
    },

    addStylesheet: function(path) {
        if (this.Browser.Gecko19) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', path);
            link.setAttribute('type', 'text/css');
            link.setAttribute('media', 'screen');
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        else {
            document.write('<link rel="stylesheet" href="' + path + '" type="text/css" media="screen" />');
        }

    },

    addStylesheets: function(basePath, filenames) {
        for (var i = 0; i < filename.length; i++)
            this.addStylesheet(basepath + filenames[i]);
    },

    initPath: function() {
        /* get / set basic values */
        this.scriptElement = this.getScriptElement(this.scriptName);
        if (!this.scriptElement) {
            this.scriptName = 'contentflow_src.js';
            this.scriptElement = this.getScriptElement(this.scriptName);
        }

        this.BaseDir = this.getScriptPath(this.scriptElement, this.scriptName);
        if (!this.AddOnBaseDir) this.AddOnBaseDir = this.BaseDir;
        if (!this.CSSBaseDir) this.CSSBaseDir = this.BaseDir;
    },

    init: function() {
    /* add default stylesheets */
        // TODO: Removed the next 2 lines... don't appear to be needed: PLEASE CHECK
        //this.addStylesheet(this.CSSBaseDir + 'contentflow.css'); 
        //this.addStylesheet(this.CSSBaseDir + 'mycontentflow.css');    // FF2: without adding a css-file FF2 hangs on a reload.
        
        //      I don't have the slidest idea why
        //      Could be timing problem
        this.loadAddOns = new Array();
        /* add AddOns scripts */
        if (this.scriptElement.getAttribute('load')) {
            var AddOns = this.loadAddOns = this.scriptElement.getAttribute('load').replace(/\ +/g, ' ').split(' ');
            for (var i = 0; i < AddOns.length; i++) {
                if (AddOns[i] == '') continue;
                //if (AddOns[i] == 'myStyle') {
                //this.addStylesheet(this.BaseDir+'mycontentflow.css');
                //continue;
                //}
                this.addScript(this.AddOnBaseDir + 'ContentFlowAddOn_' + AddOns[i] + '.js');
            }
        }

        /* ========== ContentFlow auto initialization on document load ==========
        * thanks to Dean Edwards
        * http://dean.edwards.name/weblog/2005/02/order-of-events/
        */
        var CFG = this;

        /* for Mozilla, Opera 9, Safari */
        if (document.addEventListener) {
            /* for Safari */
            if (this.Browser.WebKit) {
                var _timer = setInterval(function() {
                    if (/loaded|complete/.test(document.readyState)) {
                        clearInterval(_timer);
                        CFG.onloadInit(); // call the onload handler
                    }
                }, 10);
            }
            else {
                document.addEventListener("DOMContentLoaded", CFG.onloadInit, false);
            }
        }
        else if (this.Browser.IE) {
            document.write("<script id=__ie_cf_onload defer src=javascript:void(0)><\/script>");
            var script = document.getElementById("__ie_cf_onload");
            script.onreadystatechange = function() {
                if (this.readyState == "complete") {
                    CFG.onloadInit(); // call the onload handler
                }
            };
        }

        /* for all other browsers */
        window.addEvent('load', CFG.onloadInit, false);

        /* ================================================================== */

    },

    onloadInit: function() {
        // quit if this function has already been called
        if (arguments.callee.done) return;
        for (var i = 0; i < ContentFlowGlobal.loadAddOns.length; i++) {
            var a = ContentFlowGlobal.loadAddOns[i];
            if (!ContentFlowGlobal.AddOns[a]) {
                var CFG = ContentFlowGlobal;
                window.setTimeout(CFG.onloadInit, 10);
                return;
            }
        }
        // flag this function so we don't do the same thing twice
        arguments.callee.done = true;

        /* fix for mootools */
        if (window.Element && Element.implement && document.all && !window.opera) {
            for (var prop in window.CFElement.prototype) {
                if (!window.Element.prototype[prop]) {
                    var implement = {};
                    implement[prop] = window.CFElement.prototype[prop];
                    Element.implement(implement);
                }
            }
        }

        /* init all manualy created flows */
        for (var i = 0; i < ContentFlowGlobal.Flows.length; i++) {
            ContentFlowGlobal.Flows[i].init();
        }

        /* init the rest */
        var divs = document.getElementsByTagName('div');
        DIVS: for (var i = 0; i < divs.length; i++) {
            if (divs[i].className.match(/\bContentFlow\b/)) {
                for (var j = 0; j < ContentFlowGlobal.Flows.length; j++) {
                    if (divs[i] == ContentFlowGlobal.Flows[j].Container) continue DIVS;
                }
                var CF = new ContentFlow(divs[i], {}, false);
                CF.init();
            }
        }
    }

};

ContentFlowGlobal.initPath();


/*
* ============================================================
* ContentFlowAddOn
* ============================================================
*/
var ContentFlowAddOn = function(name, methods, register) {
    if (typeof register == "undefined" || register != false)
        ContentFlowGlobal.AddOns[name] = this;

    this.name = name;
    if (!methods) methods = {};
    this.methods = methods;
    this.conf = {};
    if (this.methods.conf) {
        this.setConfig(this.methods.conf);
        delete this.methods.conf;
    }


    this.scriptpath = ContentFlowGlobal.AddOnBaseDir;
    if (methods.init) {
        var init = methods.init.bind(this);
        init(this);
    }
};

ContentFlowAddOn.prototype = {
    Browser: ContentFlowGlobal.Browser,

    addScript: ContentFlowGlobal.addScript,
    addScripts: ContentFlowGlobal.addScripts,

    addStylesheet: function(path) {
        if (!path)
            path = this.scriptpath + 'ContentFlowAddOn_' + this.name + '.css';
        ContentFlowGlobal.addStylesheet(path);
    },
    addStylesheets: ContentFlowGlobal.addStylesheets,

    setConfig: function(conf) {
        for (var c in conf) {
            this.conf[c] = conf[c];
        }
    },

    _init: function(flow) {
        if (this.methods.ContentFlowConf) {
            flow.setConfig(this.methods.ContentFlowConf);
        }
    }


};



/* 
* ============================================================
* ContentFlowGUIElement
* ============================================================
*/

var ContentFlowGUIElement = function(CFobj, element) {
    element.setDimensions = function() {
        this.dimensions = this.getDimensions();
        this.center = { x: this.dimensions.width / 2, y: this.dimensions.height / 2 };
        this.position = this.findPos();
    };
    element.addObserver = function(eventName, method) {
        var m = this.eventMethod = method.bind(CFobj);
        this.observedEvent = eventName;
        this.addEvent(eventName, m, false);
    };

    element.makeDraggable = function(onDrag, beforeDrag, afterDrag) {

        this.stopDrag = function(event) {
            if (!event) var event = window.event;
            if (this.Browser.iPhone) {
                window.removeEvent('touchemove', onDrag, false);
                if (!this.ontochmove) {
                    var t = event.target;
                    if (t.firstChild) t = t.firstChild;
                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click', true, true);
                    t.dispatchEvent(e);
                }
            }
            else {
                window.removeEvent('mousemove', onDrag, false);
            }
            afterDrag(event);
        } .bind(this);

        this.initDrag = function(event) {
            if (!event) var event = window.event;
            var e = event;
            if (event.touches) e = event.touches[0];

            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            beforeDrag(event);

        } .bind(this);

        this.startDrag = function(event) {
            if (!event) var event = window.event;

            var stopDrag = this.stopDrag;

            if (this.Browser.iPhone) {
                var s = this;
                s.ontouchmove = false
                window.addEvent('touchmove', function(e) {
                    s.ontouchmove = true;
                    onDrag(e);
                }, false);
                event.preventDefault();
                window.addEvent('touchend', stopDrag, false);
            }
            else {
                window.addEvent('mousemove', onDrag, false);
                window.addEvent('mouseup', stopDrag, false);
            }
            if (event.preventDefault) { event.preventDefault() }

        } .bind(this);

        var startDrag = this.startDrag;
        if (this.Browser.iPhone) {
            this.addEventListener('touchstart', startDrag, false);
        }
        else {
            this.addEvent('mousedown', startDrag, false);
        }

    };

    element.Browser = ContentFlowGlobal.Browser;
    $CF(element).setDimensions();
    return element;
};


/* 
* ============================================================
* ContentFlowItem
* ============================================================
*/
var ContentFlowItem = function(CFobj, element, index) {
    this.CFobj = CFobj;
    this._activeElement = CFobj.conf.activeElement;
    this.pre = null;
    this.next = null;
    /*
    * ==================== item click events ====================
    * handles the click event on an active and none active item
    */


    this.clickItem = function(event) {
        return false; //---------------------------------------------------------------------------------------------------------------------->DMc: I'VE ADDED THIS!!!!!!!!
        if (!event) var event = window.event;
        var el = event.target ? event.target : event.srcElement;
        var index = el.itemIndex ? el.itemIndex : el.parentNode.itemIndex;
        var item = this.items[index];
        
        if (this._activeItem == item) {
            this.conf.onclickActiveItem(item);
        }
        else {
            if (this.conf.onclickInactiveItem(item) != false) this.moveToIndex(index);
        }
    } .bind(CFobj),

    this.setIndex = function(index) {
        this.index = index;
        this.element.itemIndex = index;
    };
    this.getIndex = function() {
        return this.index;
    };


    /* generate deault HTML structure if item is an image */
    if ($CF(element).nodeName == "IMG") {
        var el = document.createElement('div');
        el.className = "item";

        var cont = element.parentNode.replaceChild(el, element);
        cont.className = "content";
        el.appendChild(cont);

        if (element.title) {
            var cap = document.createElement('div');
            cap.className = "caption";
            cap.innerHTML = element.title;
            el.appendChild(cap);
        }
        element = el;
    }

    /* create item object */
    this.element = $CF(element);
    this.item = element;
    if (typeof index != "undefined") this.setIndex(index);
    this.content = this.element.getChildrenByClassName('content')[0];
    this.caption = this.element.getChildrenByClassName('caption')[0];
    this.label = this.element.getChildrenByClassName('label')[0];

    /* if content is image set properties */
    if (this.content.nodeName == "IMG") {
        CFobj._imagesToLoad++;

        var foobar = function() {
            CFobj._imagesToLoad--;
            this.image = this.content;
            this.setImageFormat(this.image);
            if (CFobj.conf.reflectionHeight > 0) {
                this.addReflection();
            }
            this.initClick();
            CFobj._addItemCueProcess(true);
        } .bind(this);

        if (this.content.complete && this.content.width > 0)
            window.setTimeout(foobar, 100);
        else if (this.Browser.IE && !this.content.onload) {
            var self = this;
            var t = window.setInterval(function() {
                if (self.content.complete && self.content.width > 0) {
                    window.clearInterval(t);
                    foobar();
                }
            }, 10);
        }
        else
            this.content.onload = window.setTimeout(foobar, 100);
    }
    else {
        this.initClick();
        CFobj._addItemCueProcess(true);
    }

};

ContentFlowItem.prototype = {

    Browser: ContentFlowGlobal.Browser,

    makeActive: function() {
        this.element.addClassName('active');
        this.CFobj.conf.onMakeActive(this);
    },

    makeInactive: function() {
        this.element.removeClassName('active');
        this.CFobj.conf.onMakeInactive(this);
    },

    initClick: function() {
        var cItem = this.clickItem;
        this[this._activeElement].addEvent('click', cItem, false);
    },

    setImageFormat: function(img) {
        if (this.Browser.IE6 || this.Browser.IE7) img.style.width = "auto";
        img.origProportion = img.width / img.height;
        img.setAttribute('origProportion', img.width / img.height);
        if (this.Browser.IE6 || this.Browser.IE7) img.style.width = "";
        //img.origWidth = img.width;
        //img.origHeight = img.height;
        if (img.origProportion <= 1)
            img.addClassName('portray');
        else
            img.addClassName('landscape');
    },

    /*
    * add reflection to item
    */
    addReflection: function() {
        var CFobj = this.CFobj;
        var reflection;
        var image = this.content;


        if (this.Browser.IE) {
            var filterString = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)';
            if (CFobj._reflectionColorRGB) {
                // transparent gradient
                if (CFobj.conf.reflectionColor == "transparent") {
                    var RefImg = reflection = this.reflection = document.createElement('img');
                    reflection.src = image.src;
                }
                // color gradient
                else {
                    reflection = this.reflection = document.createElement('div');
                    var RefImg = document.createElement('img');
                    RefImg.src = image.src;
                    reflection.width = RefImg.width;
                    reflection.height = RefImg.height;
                    RefImg.style.width = '100%';
                    RefImg.style.height = '100%';
                    var color = CFobj._reflectionColorRGB;
                    reflection.style.backgroundColor = '#' + color.hR + color.hG + color.hB;
                    reflection.appendChild(RefImg);
                }
                filterString += ' progid:DXImageTransform.Microsoft.Alpha(opacity=0, finishOpacity=50, style=1, finishX=0, startY=' + CFobj.conf.reflectionHeight * 100 + ' finishY=0)';
            } else {
                var RefImg = reflection = this.reflection = document.createElement('img');
                reflection.src = image.src;
            }
            // crop image (streches and crops (clip on default dimensions), original proportions will be restored through CSS)
            filterString += ' progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=0, M21=0, M22=' + 1 / CFobj.conf.reflectionHeight + ')';

            if (ContentFlowGlobal.Browser.IE6) {
                if (image.src.match(/\.png$/)) {
                    image.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image.src + "', sizingMethod=scale )";
                    image.filterString = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image.src + "', sizingMethod=scale )";
                    filterString += " progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + image.src + "', sizingMethod=scale )";
                    image.origSrc = image.src;
                    image.src = 'img/blank.gif';
                    RefImg.src = "img/blank.gif";
                }
            }

            reflection.filterString = filterString;
            RefImg.style.filter = filterString;

        } else {
            if (CFobj._reflectionWithinImage)
                var canvas = this.canvas = $CF(document.createElement('canvas'));
            else
                var canvas = reflection = this.reflection = document.createElement('canvas');

            if (canvas.getContext) {
                if (CFobj._reflectionWithinImage) {
                    for (var i = 0; i < image.attributes.length; i++) {
                        canvas.setAttributeNode(image.attributes[i].cloneNode(true));
                    }
                }

                var context = canvas.getContext("2d");

                /* calc image size */
                var max = CFobj.maxHeight;
                var size = CFobj._scaleImageSize(this, { width: max, height: max }, max)
                var width = size.width;
                var height = size.height;

                // overwrite default height and width
                if (CFobj._reflectionWithinImage) {
                    canvas.width = width;
                    canvas.height = height;
                    this.setImageFormat(canvas);
                    canvas.height = height * (1 + CFobj.conf.reflectionHeight + CFobj.conf.reflectionGap);

                }
                else {
                    canvas.width = width;
                    canvas.height = height * CFobj.conf.reflectionHeight;
                }

                context.save(); /* save default context */

                /* draw image into canvas */
                if (CFobj._reflectionWithinImage) {
                    context.drawImage(image, 0, 0, width, height);
                }

                /* mirror image by transformation of context and image drawing */
                if (CFobj._reflectionWithinImage) {
                    var contextHeight = height * (1 + CFobj.conf.reflectionGap / 2) * 2;
                }
                else {
                    var contextHeight = image.height;
                }
                // -1 for FF 1.5
                contextHeight -= 1;

                context.translate(0, contextHeight);
                context.scale(1, -1);
                /* draw reflection image into canvas */
                context.drawImage(image, 0, 0, width, height);

                /* restore default context for simpler further canvas manupulation */
                context.restore();

                if (CFobj._reflectionColorRGB) {
                    var gradient = context.createLinearGradient(0, 0, 0, canvas.height);

                    var alpha = [0, 0.5, 1];
                    if (CFobj._reflectionColor == "transparent") {
                        context.globalCompositeOperation = "destination-in";
                        alpha = [1, 0.5, 0];
                    }

                    var red = CFobj._reflectionColorRGB.iR;
                    var green = CFobj._reflectionColorRGB.iG;
                    var blue = CFobj._reflectionColorRGB.iB;
                    if (CFobj._reflectionWithinImage) {
                        gradient.addColorStop(0, 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha[0] + ')');
                        gradient.addColorStop(height / canvas.height, 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha[0] + ')');
                        gradient.addColorStop(height / canvas.height, 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha[1] + ')');
                    }
                    else {
                        gradient.addColorStop(0, 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha[1] + ')');
                    }
                    gradient.addColorStop(1, 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha[2] + ')');

                    context.fillStyle = gradient;
                    context.fillRect(0, 0, canvas.width, canvas.height);

                }

                if (CFobj._reflectionWithinImage) {
                    image.parentNode.replaceChild(canvas, image);
                    this.content = canvas;
                    this.origContent = canvas;
                    delete this.image; // = true;

                }

            } else {
                CFobj._reflectionWithinImage = false;
                delete this.reflection;
            }

        }
        if (reflection) {
            reflection.className = "reflection";
            this.element.appendChild(reflection);

            /* be shure that caption is last child */
            if (this.caption) this.element.appendChild(this.caption);
        }

    }


};

/*
* ============================================================
* ContentFlow
* ============================================================
*/
var ContentFlow = function(container, config) {

    if (container) {
        ContentFlowGlobal.Flows.push(this);
        this.Container = container;
        this._userConf = config ? config : {};
        this.conf = {};
        this._loadedAddOns = new Array();
    } else {
        throw ('ContentFlow ERROR: No flow container node or id given');
    }

};

ContentFlow.prototype = {
    _imagesToLoad: 0,
    _activeItem: 0,
    _currentPosition: 0,
    _targetPosition: 0,
    _stepLock: false,
    _millisecondsPerStep: 40,
    _reflectionWithinImage: true,
    Browser: ContentFlowGlobal.Browser,

    _defaultConf: {
        /* pre conf */
        useAddOns: 'all', // all, none, [AddOn1, ... , AddOnN]

        biggestItemPos: 0,
        loadingTimeout: 30000, //milliseconds
        activeElement: 'content', // item or content

        maxItemHeight: 0,
        scaleFactor: 1,
        scaleFactorLandscape: 1.33,
        scaleFactorPortrait: 1.0,
        fixItemSize: false,
        relativeItemPosition: "top center", // align top/above, bottom/below, left, right, center of position coordinate

        circularFlow: true,
        verticalFlow: false,
        visibleItems: -1,
        endOpacity: 1,
        startItem: "start",
        scrollInFrom: "pre",

        flowSpeedFactor: 0.4,
        flowDragFriction: 0.4,
        scrollWheelSpeed: 0.4,
        keys: {
            13: function() { this.conf.onclickActiveItem(this._activeItem) },
            37: function() { this.moveTo('pre') },
            38: function() { this.moveTo('visibleNext') },
            39: function() { this.moveTo('next') },
            40: function() { this.moveTo('visiblePre') }
        },

        reflectionColor: "transparent", // none, transparent or hex RGB CSS style #RRGGBB
        reflectionHeight: 0.5,          // float (relative to original image height)
        reflectionGap: 0.0,

        /* ==================== actions ==================== */

        onInit: function() { },

        onclickInactiveItem: function(item) { },

        onclickActiveItem: function(item) {
            var url, target;

            if (url = item.content.getAttribute('href')) {
                target = item.content.getAttribute('target');
            }
            else if (url = item.element.getAttribute('href')) {
                target = item.element.getAttribute('target');
            }
            else if (url = item.content.getAttribute('src')) {
                target = item.content.getAttribute('target');
            }

            if (url) {
                if (target)
                    window.open(url, target).focus();
                else
                    window.location.href = url;
            }
        },

        onMakeInactive: function(item) { },

        onMakeActive: function(item) { },

        onReachTarget: function(item) { },

        onMoveTo: function(item) { },

        //onDrawItem: function(item, relativePosition, relativePositionNormed, side, size) {},
        onDrawItem: function(item) { },
        onclickPreButton: function(event) {
            this.moveToIndex('pre');
            return Event.stop(event);
        },

        onclickNextButton: function(event) {
            this.moveToIndex('next');
            return Event.stop(event);
        },

        /* ==================== calculations ==================== */

        calcStepWidth: function(diff) {
            var vI = this.conf.visibleItems;
            var items = this.items.length;
            items = items == 0 ? 1 : items;
            if (Math.abs(diff) > vI) {
                if (diff > 0) {
                    var stepwidth = diff - vI;
                } else {
                    var stepwidth = diff + vI;
                }
            } else if (vI >= this.items.length) {
                var stepwidth = diff / items;
            } else {
                var stepwidth = diff * (vI / items);
                //var stepwidth = diff/absDiff * Math.max(diff * diff,Math.min(absDiff,0.3)) * ( vI / this.items.length);
                //var stepwidth = this.flowSpeedFactor * diff / this.visibleItems;
                //var stepwidth = this.flowSpeedFactor * diff * ( this.visibleItems / this.items.length)
                //var stepwidth = this.flowSpeedFactor * diff / this._millisecondsPerStep * 2; // const. speed
            }
            return stepwidth;
        },

        calcSize: function(item) {
            var rP = item.relativePosition;
            //var rPN = relativePositionNormed;
            //var vI = this.conf.visibleItems; 

            var h = 1 / (Math.abs(rP) + 1);
            var w = h;
            return { width: w, height: h };
        },

        calcCoordinates: function(item) {
            var rP = item.relativePosition;
            //var rPN = item.relativePositionNormed;
            var vI = this.conf.visibleItems;

            var f = 1 - 1 / Math.exp(Math.abs(rP) * 0.75);
            var x = item.side * vI / (vI + 1) * f;
            var y = 1;

            return { x: x, y: y };
        },

        /*
        calcRelativeItemPosition: function (item) {
        var x = 0;
        var y = -1;
        return {x: x, y: y};
        },
        */

        calcZIndex: function(item) {
            return -Math.abs(item.relativePositionNormed);
        },

        calcFontSize: function(item) {
            return item.size.height;
        },

        calcOpacity: function(item) {
            return Math.max(1 - ((1 - this.conf.endOpacity) * Math.sqrt(Math.abs(item.relativePositionNormed))), this.conf.endOpacity);
        }
    },

    /* ---------- end of defaultConf ---------- */


    /*
    * ==================== index helper methods ====================
    */

    /*
    * checks if index is within the index range of the this.items array
    * returns a value that is within this range
    */
    _checkIndex: function(index) {
        index = Math.max(index, 0);
        index = Math.min(index, this.itemsLastIndex);
        return index;
    },

    /*
    * sets the object property itemsLastIndex
    */
    _setLastIndex: function() {
        this.itemsLastIndex = this.items.length - 1;
    },

    /*
    */
    _getItemByIndex: function(index) {
        return this.items[this._checkIndex(index)];
    },

    _getItemByPosition: function(position) {
        return this._getItemByIndex(this._getIndexByPosition(position));
    },

    /* returns the position of an item-index relative to current position */
    _getPositionByIndex: function(index) {
        if (!this.conf.circularFlow) return this._checkIndex(index);
        var cI = this._getIndexByPosition(this._currentPosition);
        var dI = index - cI;
        if (Math.abs(dI) > dI + this.items.length)
            dI += this.items.length;
        else if (Math.abs(dI) > (Math.abs(dI - this.items.length)))
            dI -= this.items.length;

        return this._currentPosition + dI;

    },

    /* returns the index an item at position p would have */
    _getIndexByPosition: function(position) {
        if (position < 0) var mod = 0;
        else var mod = 1;

        var I = (Math.round(position) + mod) % this.items.length;
        if (I > 0) I -= mod;
        else if (I < 0) I += this.items.length - mod;
        else if (position < 0) I = 0;
        else I = this.items.length - 1;

        return I;
    },

    _getIndexByKeyWord: function(keyword, relativeTo, check) {
        if (relativeTo)
            var index = relativeTo;
        else if (this._activeItem)
            var index = this._activeItem.index;
        else
            var index = 0;

        if (isNaN(keyword)) {
            switch (keyword) {
                case "first":
                case "start":
                    index = 0;
                    break;
                case "last":
                case "end":
                    index = this.itemsLastIndex;
                    break;
                case "middle":
                case "center":
                    index = Math.round(this.itemsLastIndex / 2);
                    break;
                case "right":
                case "next":
                    index += 1;
                    break;
                case "left":
                case "pre":
                case "previous":
                    index -= 1;
                    break;
                case 'visible':
                case 'visiblePre':
                case 'visibleLeft':
                    index -= this.conf.visibleItems;
                    break;
                case 'visibleNext':
                case 'visibleRight':
                    index += this.conf.visibleItems;
                    break;
                default:
                    index = index;
            }
        }
        else {
            index = keyword;
        }
        if (check != false)
            index = this._checkIndex(index);

        return index;
    },


    _setCaptionLabel: function(index) {
        if (this.Position && !this.Slider.locked)
            this.Position.setLabel(index);
        this._setGlobalCaption();
    },


    /*
    * ==================== public methods ==================== 
    */
    getAddOnConf: function(name) {
        return ContentFlowGlobal.getAddOnConf(name);
    },

    setAddOnConf: function(name, conf) {
        ContentFlowGlobal.setAddOnConf(name, conf);
    },


    /*
    * calls _init() if ContentFlow has not been initialized before
    * needed if ContentFlow is not automatically initialized on window.load
    */
    init: function() {
        if (this.isInit) return;
        this._init();
    },

    /*
    * parses configuration object and initializes configuration values
    */
    setConfig: function(config) {
        if (!config) return;
        var dC = this._defaultConf;
        for (var option in config) {
            if (dC[option] == "undefined") continue;
            switch (option) {
                case "scrollInFrom":
                case "startItem":
                    if (typeof (config[option]) == "number" || typeof (config[option]) == "string") {
                        //this["_"+option] = config[option];
                        this.conf[option] = config[option];
                    }
                    break;
                default:
                    if (typeof (dC[option] == config[option])) {
                        //this["_"+option] = config[option];
                        if (typeof config[option] == "function") {
                            this.conf[option] = config[option].bind(this);
                        }
                        else {
                            this.conf[option] = config[option];
                        }
                    }
            }
        }
        switch (this.conf.reflectionColor) {
            case this.conf.reflectionColor.search(/#[0-9a-fA-F]{6}/) >= 0 ? this.conf.reflectionColor : this.conf.reflectionColor + "x":
                this._reflectionColorRGB = {
                    hR: this.conf.reflectionColor.slice(1, 3),
                    hG: this.conf.reflectionColor.slice(3, 5),
                    hB: this.conf.reflectionColor.slice(5, 7),
                    iR: parseInt(this.conf.reflectionColor.slice(1, 3), 16),
                    iG: parseInt(this.conf.reflectionColor.slice(3, 5), 16),
                    iB: parseInt(this.conf.reflectionColor.slice(5, 7), 16)
                };
                break;
            case "none":
            case "transparent":
            default:
                this._reflectionColor = "transparent";
                this._reflectionColorRGB = {
                    hR: 0, hG: 0, hB: 0,
                    iR: 0, iG: 0, iB: 0
                };
                break;
        }
        if (this.items) {
            if (this.conf.visibleItems < 0)
                this.conf.visibleItems = Math.round(Math.sqrt(this.items.length));
            this.conf.visibleItems = Math.min(this.conf.visibleItems, this.items.length - 1);
        }

        if (this.conf.relativeItemPosition) {
            var calcRP = {
                x: {
                    left: function(size) { return -1 },
                    center: function(size) { return 0 },
                    right: function(size) { return 1 }
                },
                y: {
                    top: function(size) { return -1 },
                    center: function(size) { return 0 },
                    bottom: function(size) { return 1 }
                }
            };

            var iP = this.conf.relativeItemPosition;
            iP = iP.replace(/above/, "top").replace(/below/, "bottom");
            var x, y = null;
            x = iP.match(/left|right/);
            y = iP.match(/top|bottom/);
            c = iP.match(/center/);
            if (!x) {
                if (c) x = "center";
                else x = "center";
            }
            if (!y) {
                if (c) y = "center";
                else y = "top";
            }
            var calcX = calcRP.x[x];
            var calcY = calcRP.y[y];
            this.conf.calcRelativeItemPosition = function(item) {
                var x = calcX(item.size);
                var y = calcY(item.size);
                return { x: x, y: y };
            };
            this.conf.relativeItemPosition = null;
        }

        if (this._reflectionType && this._reflectionType != "clientside") {
            this.conf.reflectionHeight = 0;
        }

    },

    getItem: function(index) {
        return this.items[this._checkIndex(Math.round(index))];
    },

    /*
    * returns the index number of the active item
    */
    getActiveItem: function() {
        return this._activeItem;
    },

    /*
    * returns the number of items the flow contains
    */
    getNumberOfItems: function() {
        return this.items.length;
    },

    /*
    * reinitializes sizes.
    * called on window.resize
    */
    resize: function() {
        this._initSizes();
        this._initStep();
    },

    /*
    * scrolls flow to item i
    */
    moveToPosition: function(p, holdPos) {
        if (!this.conf.circularFlow) p = this._checkIndex(p);
        this._targetPosition = p;
        this.conf.onMoveTo(this._getItemByPosition(p));
        this._initStep(false, holdPos);
    },
    moveToIndex: function(index) {

        this._targetPosition = Math.round(this._getPositionByIndex(this._getIndexByKeyWord(index, this._activeItem.index, !this.conf.circularFlow)));
        this.conf.onMoveTo(this._getItemByPosition(this._targetPosition));
        this._initStep();
    },
    moveToItem: function(item) {
        var i;
        if (item.itemIndex) i = item.itemIndex;
        else i = item.index;
        this.moveToIndex(i);
    },
    moveTo: function(i) {
        if (typeof i == "object") this.moveToItem(i);
        else if (isNaN(i) || (i == Math.floor(i) && i < this.items.length)) this.moveToIndex(i);
        else this.moveToPosition(i);
    },

    /*
    * initializes item and adds it at index position
    */
    _addItemCue: [],
    _addItemCueProcess: function(deleteFirst) {
        var c = this._addItemCue;
        if (deleteFirst == true)
            c.shift();
        if (c.length > 0 && !c[0].p) {
            c[0].p = true;
            var self = this;
            var t = c.length > 5 ? 1 : 40;
            window.setTimeout(function() { self._addItem(c[0].el, c[0].i) }, t);
        }
    },
    addItem: function(el, index) {
        this._addItemCue.push({ el: el, i: index, p: false });
        if (this._addItemCue.length == 1)
            this._addItemCueProcess();
    },

    _addItem: function(el, index) {
        if (typeof index == "string") {
            switch (index) {
                case "first":
                case "start":
                    index = 0;
                    break;
                case "last":
                case "end":
                    index = isNaN(this.itemsLastIndex) ? 0 : this.itemsLastIndex;
                    index += 1;
                    break;
                default:
                    index = this._getIndexByKeyWord(index);
            }
        }

        index = Math.max(index, 0);
        index = Math.min(index, this.itemsLastIndex + 1);
        index = isNaN(index) ? 0 : index;

        this.Flow.appendChild(el);

        /* init item after insertion. that way it's part of the document and all styles are applied */
        var item = new ContentFlowItem(this, el, index);
        if (this.items.length == 0) {
            this.resize();
            if (this.conf.circularFlow) {
                item.pre = item;
                item.next = item;
            }
        }
        else {
            if (index == this.itemsLastIndex + 1) {
                item.pre = this.items[this.itemsLastIndex];
                item.next = item.pre.next;
            }
            else {
                item.next = this.items[index];
                item.pre = item.next.pre;
            }
            if (item.pre) item.pre.next = item;
            if (item.next) item.next.pre = item;
        }
        this.items.splice(index, 0, item);

        /* adjust item indices */
        for (var i = index; i < this.items.length; i++) {
            this.items[i].setIndex(i);
        }
        this._setLastIndex();

        if (this.conf.origVisibleItems < 0) {
            this.conf.visibleItems = Math.round(Math.sqrt(this.items.length));
        }
        this.conf.visibleItems = Math.min(this.conf.visibleItems, this.items.length - 1);

        /* adjust targetItem, currentPos so that current view does not change*/
        if (Math.round(this._getPositionByIndex(index)) <= Math.round(this._targetPosition)) {
            this._targetPosition++;
            if (!this.conf.circularFlow)
                this._targetPosition = Math.min(this._targetPosition, this.itemsLastIndex);
        }
        if (this._getPositionByIndex(index) <= this._currentPosition) {
            this._currentPosition++;
            if (!this.conf.circularFlow)
                this._currentPosition = Math.min(this._currentPosition, this.itemsLastIndex);
        }

        // avoid display errors (wrong sizing)
        var CF = this;
        window.setTimeout(function() {
            if (CF.items.length == 1) {
                CF._currentPosition = -0.01;
                CF._targetPosition = 0;
                CF.resize();
            }
            else {
                CF._initStep();
            }
        }, 100);

        return index;

    },

    /*
    * removes item at index position, cleans it up and returns it
    */
    rmItem: function(index) {
        if (index == "undefined") index = this._activeItem.index;
        index = this._getIndexByKeyWord(index);
        if (!this.items[index]) return null;

        var item = this.items[index];

        if (item.pre) item.pre.next = item.next;
        if (item.next) item.next.pre = item.pre;
        this.items.splice(index, 1);

        /* adjust item indices */
        for (var i = index; i < this.items.length; i++) {
            this.items[i].setIndex(i);
        }
        this._setLastIndex();

        /* adjust targetItem, currentPos and activeItem so that current view does not change*/
        if (Math.round(this._getPositionByIndex(index)) < Math.round(this._targetPosition)) {
            this._targetPosition--;
            if (!this.conf.circularFlow)
                this._targetPosition = this._checkIndex(this._targetPosition);
        }
        if (this._getPositionByIndex(index) < this._currentPosition) {
            this._currentPosition--;
            if (!this.conf.circularFlow)
                this._currentPosition = this._checkIndex(this._currentPosition);
        }
        this._activeItem = this._getItemByPosition(this._currentPosition);

        /* remove item from DOM tree, take the next step and return removed item  */
        var removedItem = item.element.parentNode.removeChild(item.element);
        // avoid display errors (wrong sizing)
        var CF = this;
        window.setTimeout(function() { CF._initStep() }, 10);
        return removedItem;

    },


    /*
    * ==================== initialization ====================
    */


    /* -------------------- main init -------------------- */
    _init: function() {

        if (typeof (this.Container) == 'string') { // no node
            var container = document.getElementById(this.Container);
            if (container) {
                this.Container = container;
            } else {
                throw ('ContentFlow ERROR: No element with id \'' + this.Container + '\' found!');
                return;
            }
        }

        /* ----------  reserve CSS namespace */

        $CF(this.Container).addClassName('ContentFlow');

        /* ---------- detect GUI elements */
        var flow = $CF(this.Container).getChildrenByClassName('flow')[0];
        if (!flow) {
            throw ('ContentFlow ERROR: No element with class\'flow\' found!');
            return;
        }
        this.Flow = new ContentFlowGUIElement(this, flow);

        var scrollbar = this.Container.getChildrenByClassName('scrollbar')[0];
        if (scrollbar) {
            this.Scrollbar = new ContentFlowGUIElement(this, scrollbar);
            var slider = this.Scrollbar.getChildrenByClassName('slider')[0];
            if (slider) {
                this.Slider = new ContentFlowGUIElement(this, slider);
                var position = this.Slider.getChildrenByClassName('position')[0];
                if (position) {
                    this.Position = new ContentFlowGUIElement(this, position);
                }
            }

        }

        /* ----------  init configuration */
        this.setConfig(this._defaultConf);
        this._initAddOns(); /* init AddOns */
        this.setConfig(this._userConf);

        this._initSizes(); // ......


        /* ---------- init item lists ---------- */
        var items = this.Flow.getChildrenByClassName('item');

        this.items = new Array();
        for (var i = 0; i < items.length; i++) {
            var item = this.items[i] = new ContentFlowItem(this, items[i], i);
            if (i > 0) {
                item.pre = this.items[i - 1];
                item.pre.next = item;
            }
        }
        this._setLastIndex();
        if (this.conf.circularFlow && this.items.length > 0) {
            var s = this.items[0];
            s.pre = this.items[this.items.length - 1];
            s.pre.next = s;
        }

        /* ----------  init GUI */
        this._initGUI();

        /* ---------- init start parameters ---------- */
        if (this._activeElement != "content")
            this._activeElement = "element";

        this.conf.origVisibleItems = this.conf.visibleItems;
        if (this.conf.visibleItems < 0) {
            this.conf.visibleItems = Math.round(Math.sqrt(this.items.length));
        }
        this.conf.visibleItems = Math.min(this.conf.visibleItems, this.items.length - 1);

        this._targetPosition = this._getIndexByKeyWord(this.conf.startItem, 0);

        var index = this._getIndexByKeyWord(this.conf.scrollInFrom, this._targetPosition);
        switch (this.conf.scrollInFrom) {
            case "next":
            case "right":
                index -= 0.5;
                break;
            case "pre":
            case "previous":
            case "left":
                index += 0.5;
                break;
        }
        this._currentPosition = index;


        /* ---------- wait till all images are loaded or 
        * grace time is up to show all and take the first step  
        */
        var now = new Date();
        var cf = this;
        var timer = window.setInterval(
            function() {
                if (cf._imagesToLoad == 0 || new Date() - now > cf._loadingTimeout) {
                    clearInterval(timer);

                    cf._activeItem = cf.getItem(cf._currentPosition);
                    if (cf._activeItem) {
                        cf._activeItem.makeActive();
                        cf._setCaptionLabel(cf._activeItem.index);
                    }

                    cf.Flow.style.visibility = "visible"; // show flow after images are loaded
                    if (cf.loadIndicator) cf.loadIndicator.style.display = "none";
                    if (cf.Scrollbar) cf.Scrollbar.style.visibility = "visible";

                    cf.resize();
                    for (var i = 0; i < cf._loadedAddOns.length; i++) {
                        var a = ContentFlowGlobal.AddOns[cf._loadedAddOns[i]];
                        if (a.methods.afterContentFlowInit)
                            a.methods.afterContentFlowInit(cf);
                    }
                    cf.conf.onInit();
                }
            }, 10
        );

        this.isInit = true;

    },

    /* ---------- init AddOns ---------- */
    _initAddOns: function() {

        // get an array of names of all AddOns that should be used
        var loadAddOns = [];
        if (this._userConf.useAddOns) {
            if (typeof this._userConf.useAddOns == "string") {
                loadAddOns = this._userConf.useAddOns.split(" ");
            }
            else if (typeof this._userConf.useAddOns == "array") {
                loadAddOns = this._userConf.useAddOns;
            }
        }
        else if (this.Container.getAttribute("useAddOns")) {
            loadAddOns = this.Container.getAttribute("useAddOns").split(" ");
        }
        else {
            loadAddOns = this.conf.useAddOns.split(' ');
        }


        // check the names for keywords
        for (var i = 0; i < loadAddOns.length; i++) {
            if (loadAddOns[i] == "none") {
                loadAddOns = new Array();
                break;
            }
            else if (loadAddOns[i] == "all") {
                loadAddOns = new Array();
                for (var AddOn in ContentFlowGlobal.AddOns)
                    loadAddOns.push(AddOn);
                break;
            }
        }

        // init all AddOns that should be used and exist
        for (var i = 0; i < loadAddOns.length; i++) {
            var AddOn = ContentFlowGlobal.AddOns[loadAddOns[i]];
            if (AddOn) {
                this._loadedAddOns.push(loadAddOns[i]);
                AddOn._init(this);
                this.Container.addClassName('ContentFlowAddOn_' + AddOn.name);
                if (AddOn.methods.onloadInit)
                    AddOn.methods.onloadInit(this);
            }
        }

    },


    _initGUI: function() {

        // resize
        //if (!this.Browser.iPhone) {
        var resize = this.resize.bind(this);
        window.addEvent('resize', resize, false);
        //}
        //else {
        //var g = this;
        //window.addEvent('resize', function () {
        //g._initSizes();
        //g._initStep();
        //} , false);
        //}

        // pre and next buttons
        var divs = this.Container.getElementsByTagName('div');
        for (var i = 0; i < divs.length; i++) {
            if ($CF(divs[i]).hasClassName('preButton')) {
                var pre = divs[i];
                var mt = this.conf.onclickPreButton;
                pre.addEvent('click', mt, false);
            }
            else if (divs[i].hasClassName('nextButton')) {
                var next = divs[i];
                var mt = this.conf.onclickNextButton;
                next.addEvent('click', mt, false);
            }
        }

        // Container object
        // mousewheel
        if (this.conf.scrollWheelSpeed != 0) {
            var wheel = this._wheel.bind(this);
            if (window.addEventListener) this.Container.addEventListener('DOMMouseScroll', wheel, false);
            this.Container.onmousewheel = wheel;
        }

        // key strokes
        var key = this._keyStroke.bind(this);
        if (this.conf.keys && !this.Browser.iPhone) {
            if (document.addEventListener) {
                if (!this.Browser.Opera) {
                    var mouseoverCheck = document.createElement('div');
                    mouseoverCheck.addClassName('mouseoverCheckElement');
                    this.Container.appendChild(mouseoverCheck);

                    if (this.Browser.WebKit) {
                        document.body.addEvent('keydown', function(event) {
                            if (mouseoverCheck.offsetLeft > 0) key(event);
                        });
                    } else {
                        window.addEvent('keydown', function(event) {
                            if (mouseoverCheck.offsetLeft > 0) key(event);
                        });
                    }
                }
                else {
                    this.Container.addEvent('keydown', key);
                }
            }
            else {
                this.Container.onkeydown = key;
            }
        }


        // Flow object
        if (this.conf.flowDragFriction > 0) {
            var onDrag = function(event) {
                var e = event;
                if (event.touches) e = event.touches[0];
                var mouseX = e.clientX;
                var mouseY = e.clientY;

                if (this.conf.verticalFlow) {
                    var dist = mouseY - this.Flow.mouseY; // px / or px per sec because _dragFlow wil be called in shorter intervalls if draged fast
                    var dim = this.Flow.dimensions.height;
                }
                else {
                    var dist = mouseX - this.Flow.mouseX; // px / or px per sec because _dragFlow wil be called in shorter intervalls if draged fast
                    var dim = this.Flow.dimensions.width;
                }
                var itemDist = (dist / dim) * (2 * this.conf.visibleItems + 1); // items
                var target = this._currentPosition - itemDist * 2 * this.conf.visibleItems / this.conf.flowDragFriction;

                this.Flow.mouseX = mouseX;
                this.Flow.mouseY = mouseY;

                this.moveToPosition(target, true);
            } .bind(this);

            var beforeDrag = function() { };

            var afterDrag = function(event) {
                var t = Math.round(this._targetPosition);
                if (Math.abs(t - this._currentPosition) > 0.001)
                    this.moveToPosition(t);
            } .bind(this);


            this.Flow.makeDraggable(onDrag, beforeDrag, afterDrag);
        }

        // Scrollbar Object
        if (this.Scrollbar) {
            var click = function(event) {
                if (!event) var event = window.event;

                if (!this.Scrollbar.clickLocked) {
                    var mouseX = event.clientX;
                    var positionOnScrollbar = mouseX - this.Scrollbar.position.left;
                    var targetIndex = Math.round(positionOnScrollbar / this.Scrollbar.dimensions.width * this.itemsLastIndex);
                    this.moveToIndex(targetIndex);
                }
                else
                    this.Scrollbar.clickLocked = false;
            } .bind(this);
            this.Scrollbar.addObserver('click', click);
        }

        // Slider Object
        if (this.Slider) {

            if (this.Browser.IE6) {
                var virtualSlider = document.createElement('div');
                virtualSlider.className = 'virtualSlider';
                this.Slider.appendChild(virtualSlider);
            }

            // position slider on scrollbar
            this.Slider.setPosition = function(relPos) {
                relPos = relPos - Math.floor(relPos) + this._getIndexByPosition(Math.floor(relPos));
                if (Math.round(relPos) < 0)
                    relPos = this.itemsLastIndex;
                else if (relPos <= 0)
                    relPos = 0;
                else if (Math.round(relPos) > this.itemsLastIndex)
                    relPos = 0;
                else if (relPos >= this.itemsLastIndex)
                    relPos = this.itemsLastIndex;


                if (this.items.length > 1) {
                    var sPos = (relPos / this.itemsLastIndex) * this.Scrollbar.dimensions.width;
                } else {
                    var sPos = 0.5 * this.Scrollbar.dimensions.width;
                }
                this.Slider.style.left = sPos - this.Slider.center.x + "px";
                this.Slider.style.top = this.Scrollbar.center.y - this.Slider.center.y + "px";

            } .bind(this);

            // make slider draggable
            var beforeDrag = function(event) {
                this.Scrollbar.clickLocked = true;
            } .bind(this);

            var onDrag = function(event) {
                var e = event;
                if (event.touches) e = event.touches[0];
                var selectedIndex = this._checkIndex((e.clientX - this.Scrollbar.position.left) / this.Scrollbar.dimensions.width * this.itemsLastIndex);
                this._targetPosition = this._getPositionByIndex(selectedIndex);
                this.Slider.setPosition(selectedIndex);
                if (this.Position) this.Position.setLabel(selectedIndex);
                this._initStep(true, true);
            } .bind(this);

            var afterDrag = function(event) {
                this._targetPosition = Math.round(this._targetPosition);
                this.conf.onMoveTo(this._getItemByPosition(this._targetPosition));
                this._initStep(true);
            } .bind(this);

            this.Slider.makeDraggable(onDrag, beforeDrag, afterDrag);
        }


        // Position object
        if (this.Position) {
            this.Position.setLabel = function(index) {
                index = this._checkIndex(Math.round(index));
                if (this.items && this.items[index].label)
                    this.Position.innerHTML = this.items[index].label.innerHTML;
                else
                    this.Position.innerHTML = index + 1;
            } .bind(this);
        }


        this.globalCaption = this.Container.getChildrenByClassName('globalCaption')[0];
        this.loadIndicator = this.Container.getChildrenByClassName('loadIndicator')[0];
    },

    /* ---------- init element sizes ---------- */
    _initSizes: function(x) {
        //if (this.Browser.Konqueror4 && x != true) {
        //var t = this;
        //window.setTimeout( function () { t._initSizes(true) }, 0);
        //return;
        //}

        // sets this.maxHeight
        this._initMaxHeight();

        var scrollbarHeight = this._initScrollbarSize();

        // reduce maxHeit if container has a fixed height
        if (!this.conf.verticalFlow && this.Container.style.height && this.Container.style.height != "auto")
            this.maxHeight -= scrollbarHeight;

        if (!this._activeItem) return;

        var mFS = this._findBiggestItem();

        var pF = this.Flow.findPos();

        /* set height / width of flow */
        if (this.conf.verticalFlow) {
            this.Flow.style.width = mFS.width.width + "px";
            this.Flow.style.height = 3 * mFS.width.width * (1 + this.conf.reflectionHeight + this.conf.reflectionGap) + "px";
        } else {
            this.Flow.style.height = mFS.height.height + (mFS.height.top - pF.top) + "px";
        }

        /* remove gap */
        var s = this.conf.verticalFlow ? mFS.width.width : mFS.height.height;
        var cH = s / (1 + this.conf.reflectionHeight + this.conf.reflectionGap);
        this.Flow.style.marginBottom = -(s - cH) + "px";

        this.Flow.dimensions = this.Flow.getDimensions();

        if (!this.Browser.IE6) {
            if (this.conf.verticalFlow && this.Container.clientWidth < this.Flow.dimensions.width) {
                //this.Container.style.width = this.Flow.dimensions.width+"px";
            }
            else if (this.Container.clientHeight < this.Flow.dimensions.height) {
                this.Container.style.height = this.Flow.dimensions.height + "px";
            }
        }

        if (this.conf.verticalFlow) {
            this.Flow.center = { x: this.Flow.dimensions.height / 2, y: mFS.width.width / 2 };
        } else {
            this.Flow.center = { x: this.Flow.dimensions.width / 2, y: mFS.height.height / 2 };
        }

    },

    /* -------------------------------------------------------------------------------- */

    _initScrollbarSize: function() {
        var SB;
        var SL;
        var PO;
        if (SB = this.Scrollbar) {
            SB.setDimensions();
            var scrollbarHeight = SB.dimensions.height;

            if (SL = this.Slider) {
                SL.setDimensions();
                scrollbarHeight += SL.dimensions.height;

                if (PO = this.Position) {

                    var oldLabel = PO.innerHTML;
                    var maxH = maxW = 0;
                    PO.style.width = "auto";

                    if (this.items) {
                        for (var i = 0; i < this.items.length; i++) {
                            var item = this.items[i];
                            if (item.label) {
                                PO.innerHTML = item.label.innerHTML;
                            }
                            else {
                                PO.innerHTML = item.index;
                            }
                            var h = PO.clientHeight;
                            var w = PO.clientWidth;
                            if (h > maxH) maxH = h;
                            if (w > maxW) maxW = w;
                        }
                    }
                    else {
                        PO.innerHTML = "&nbsp;";
                        maxH = PO.clientHeight;
                        maxW = PO.clientWidth;
                    }

                    PO.innerHTML = oldLabel;

                    PO.setDimensions();

                    PO.style.width = maxW + "px";
                    PO.style.left = (SL.dimensions.width - maxW) / 2 + "px";

                    var extraSpace = PO.position.top - SL.position.top;
                    if (extraSpace > 0) {
                        extraSpace += -SB.dimensions.height + maxH;
                        SB.style.marginBottom = extraSpace + "px";
                    }
                    else {
                        extraSpace *= -1;
                        SB.style.marginTop = extraSpace + "px";
                    }
                    scrollbarHeight += extraSpace;
                }
            }
        }
        else {
            scrollbarHeight = 0;
        }

        return scrollbarHeight;

    },

    /* -------------------------------------------------------------------------------- */

    _initMaxHeight: function() {

        if (this.conf.verticalFlow) {
            var proportion = screen.width / screen.height;
            var Csd = this.Container.style.width;
            var Cdim = this.Container.clientWidth;
            var Fsd = this.Flow.style.width;
            var Fdim = this.Flow.clientWidth;
            var Fdim_o = this.Flow.clientHeight;
        } else {
            var proportion = screen.height / screen.width;
            var Csd = this.Container.style.height;
            var Cdim = this.Container.clientHeight;
            var Fsd = this.Flow.style.height;
            var Fdim = this.Flow.clientHeight;
            var Fdim_o = this.Flow.clientWidth;
        }

        // set height of container and flow
        if (this.ContainerOldDim)
            Csd = this.ContainerOldDim;
        if (this.FlowOldDim)
            Fsd = this.FlowOldDim;

        this.ContainerOldDim = "auto";
        this.FlowOldDim = "auto";


        /* calc maxHeight */
        if (this.conf.maxItemHeight <= 0) {

            this.maxHeight = Fdim_o / 3 * proportion / 1 * this.conf.scaleFactor;  // divided by 3 because of left/center/right, yes it's a magic number

            if (this.conf.verticalFlow && (this.maxHeight == 0 || this.maxHeight > Fdim)) {
                this.maxHeight = Fdim;
            }

            if (Csd && Csd != "auto") {
                var gap = this.conf.verticalFlow ? 0 : this.conf.reflectionGap;
                var rH = this.conf.verticalFlow ? 0 : this.conf.reflectionHeight;
                this.maxHeight = Cdim / (this.conf.scaleFactor * (1 + rH + gap));
                this.ContainerOldDim = Csd;
            }
            else if (Fsd && Fsd != "auto") {
                var gap = this.conf.verticalFlow ? 0 : this.conf.reflectionGap;
                this.maxHeight = Fdim / (this.conf.scaleFactor * (1 + this.conf.reflectionHeight + gap));
                this.FlowOldDim = Fsd;
            }
        }
        else {
            this.maxHeight = this.conf.maxItemHeight;
        }
    },

    /* -------------------------------------------------------------------------------- */

    _findBiggestItem: function() {
        var currentItem = this._activeItem;

        var itemP = currentItem.pre;
        var itemN = currentItem.next;
        var mFS = maxFlowSize = {
            width: { width: 0, left: 0, height: 0, top: 0, item: null, rI: 0 },
            height: { width: 0, left: 0, height: 0, top: 0, item: null, rI: 0 }
        }


        var checkMax = function(item, rI) {
            var el = item.element;
            el.style.display = "block";
            var p = el.findPos();
            var h = el.clientHeight;
            var w = el.clientWidth;
            if (h + p.top >= mFS.height.height + mFS.height.top) {
                mFS.height.height = h;
                mFS.height.top = p.top;
                mFS.height.item = item;
                mFS.height.rI = rI;
            }
            if (w + p.left >= mFS.width.width + mFS.width.left) {
                mFS.width.width = w;
                mFS.width.left = p.left;
                mFS.width.item = item;
                mFS.width.rI = rI;
            }
            el.style.display = "none";
        }

        var ocp = this._currentPosition;
        this._currentPosition = this.conf.visibleItems + 1;

        // find the position with highest y-value
        for (var i = -this.conf.visibleItems; i <= this.conf.visibleItems; i++) {
            currentItem.element.style.display = "none";
            this._positionItem(currentItem, i);
            checkMax(currentItem, i);
        }

        // find the biggest item
        var index = mFS.height.rI;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            item.element.style.display = "none";
            this._positionItem(item, index);
            checkMax(item, index);
        }

        this._currentPosition = ocp;

        return mFS
    },



    /*
    * ==================== Key strok ====================
    */

    /*
    * handles keystroke events
    */
    _keyStroke: function(event) {
        if (!event) var event = window.event;

        if (event.which) {
            var keyCode = event.which;
        } else if (event.keyCode) {
            var keyCode = event.keyCode;
        }

        if (this.conf.keys[keyCode]) {
            this.conf.keys[keyCode].bind(this)();
            return Event.stop(event);
        }
        else {
            return true;
        }
    },

    /*
    * ==================== mouse wheel ====================
    * Event handler for mouse wheel event
    * http://adomas.org/javascript-mouse-wheel/
    */

    _wheel: function(event) {
        if (!event) var event = window.event; // MS

        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }

        if (delta) {
            var target = this._targetPosition;
            if (delta < 0) {
                target += (1 * this.conf.scrollWheelSpeed);
            } else {
                target -= (1 * this.conf.scrollWheelSpeed);
            }
            this.moveToPosition(Math.round(target));
        }

        return Event.stop(event);
    },


    /*
    * ==================== set global Caption ====================
    */
    _setGlobalCaption: function() {
        if (this.globalCaption) {
            this.globalCaption.innerHTML = '';
            if (this._activeItem && this._activeItem.caption)
                this.globalCaption.appendChild(this._activeItem.caption.cloneNode(true));
        }
    },

    /*
    * ==================== move items ====================
    */

    /*
    * intend to make a step 
    */
    _initStep: function(holdSlider, holdPos) {
        if (this.Slider) {
            if (holdSlider) {
                this.Slider.locked = true;
            } else {
                this.Slider.locked = false;
            }
        }
        this._holdPos = holdPos == true ? true : false;
        if (!this._stepLock) {
            this._stepLock = true;
            this._step();
        }
    },

    /*
    * make a step
    */
    _step: function() {

        var diff = this._targetPosition - this._currentPosition;
        var absDiff = Math.abs(diff);
        if (absDiff > 0.001) { // till activeItem is nearly at position 0

            this._currentPosition += this.conf.flowSpeedFactor * this.conf.calcStepWidth(diff, absDiff, this.items.length, this.conf.visibleItems);

            var AI = this.items[(this._getIndexByPosition(this._currentPosition))];

            if (AI && AI != this._activeItem) {
                if (this._activeItem) this._activeItem.makeInactive();
                this._activeItem = AI;
                this._activeItem.makeActive();
                this._setCaptionLabel(this._activeItem.index);
                if (Math.abs(this._targetPosition - this._currentPosition) <= 0.5) this.conf.onReachTarget(this._activeItem);
            }

            this._positionItems();

            var st = this._step.bind(this);
            window.setTimeout(st, this._millisecondsPerStep);

        } else if (!this._holdPos) {
            if (this.Slider) this.Slider.locked = false;
            this._currentPosition = Math.round(this._currentPosition);
            if (this.Position && !this.Slider.locked && this._activeItem) {
                this._setCaptionLabel(this._activeItem.index);
            }
            this._positionItems();
            this._stepLock = false;
        } else {
            this._stepLock = false;
        }

        if (this.Slider && !this.Slider.locked) {
            this.Slider.setPosition(this._currentPosition);
        }
    },



    /* ------------------------------------------------------------------------------------------------------ */

    /*
    * position items
    */
    _positionItems: function() {

        if (this._lastStart) {
            var item = this._lastStart;
            while (item) {
                item.element.style.display = "none";
                item = item.next;
                if (item == this._lastStart) break;
                if (item && item.pre == this._lastEnd) break;
            }
        }
        else {
            this._lastStart = this._activeItem;
        }

        if (!this._activeItem) return;
        var currentItem = this._activeItem;
        var itemP = currentItem.pre;
        var itemN = currentItem.next;

        this._positionItem(currentItem, 0);
        for (var i = 1; i <= this.conf.visibleItems && 2 * i < this.items.length; i++) {
            if (itemP) {
                this._positionItem(itemP, -i);
                this._lastStart = itemP;
                itemP = itemP.pre;
            }
            if (itemN) {
                this._positionItem(itemN, i);
                this._lastEnd = itemN;
                itemN = itemN.next;
            }
        }

    },

    _positionItem: function(item, relativeIndex) {

        var conf = this.conf;
        var vF = conf.verticalFlow;

        var els = item.element.style;
        //els.display =" none";
        //if (els.display != "none") return;

        /* Index and position relative to activeItem */
        var p = item.position = this._currentPosition + relativeIndex;
        var relativePosition = item.relativePosition = Math.round(p) - this._currentPosition;
        var relativePositionNormed = item.relativePositionNormed = conf.visibleItems > 0 ? relativePosition / conf.visibleItems : 0;
        var side = relativePosition < 0 ? -1 : 1;
        side *= relativePosition == 0 ? 0 : 1;
        item.side = side;

        var size = conf.calcSize(item);
        size.height = Math.max(size.height, 0);
        size.width = Math.max(size.width, 0);
        if (item.content.origProportion) size = this._scaleImageSize(item, size);
        item.size = size;

        var coords = item.coordinates = conf.calcCoordinates(item);
        var relItemPos = item.relativeItemPosition = conf.calcRelativeItemPosition(item);
        var zIndex = item.zIndex = conf.calcZIndex(item);
        var fontSize = item.fontSize = conf.calcFontSize(item);
        var opacity = item.opacity = conf.calcOpacity(item);

        size.height *= this.maxHeight;
        size.width *= this.maxHeight;

        /* set position */
        var sA = vF ? size.height : size.width;
        var sB = vF ? size.width : size.height;
        var pX = this.Flow.center.x * (1 + coords.x) + (relItemPos.x - 1) * sA / 2;
        var pY = this.maxHeight / 2 * (1 + coords.y) + (relItemPos.y - 1) * sB / 2;
        els.left = (vF ? pY : pX) + "px";
        els.top = (vF ? pX : pY) + "px";

        this._setItemSize(item, size);

        /* set opacity */
        if (conf.endOpacity != 1) {
            this._setItemOpacity(item);
        }

        /* set font size */
        if (!this.Browser.IE) els.fontSize = (fontSize * 100) + "%";

        /* set z-index */
        els.zIndex = 32768 + Math.round(zIndex * this.items.length); // just for FF

        conf.onDrawItem(item);

        els.visibility = "visible";
        els.display = "block";
    },

    _scaleImageSize: function(item, size, max) {
        var sFL = this.conf.scaleFactorLandscape;
        var sFP = this.conf.scaleFactorPortrait;
        var vF = this.conf.verticalFlow;
        var prop = item.content.origProportion;
        var width = size.width;
        var height = size.height;
        var c = item.content;

        if (vF) {
            if (prop <= 1) {
                if (sFL != "max" && sFL != 1) {
                    height *= sFL;
                    width = Math.min(height * prop, max ? max : 1);
                }
                height = width / prop;
            }
            else if (prop > 1) {
                if (sFP == "max") {
                    height = max ? max : 1;
                }
                else if (sFP != 1) {
                    width *= sFP;
                    height = Math.min(width / prop, max ? max : 1)
                }
                else {
                    height = width / prop;
                }
                width = height * prop;
            }
        }
        else {
            if (prop > 1) {
                if (sFL != "max" && sFL != 1) {
                    width *= sFL;
                    height = Math.min(width / prop, max ? max : 1);
                }
                width = height * prop;
            }
            else if (prop <= 1) {
                if (sFP == "max") {
                    width = max ? max : 1;
                }
                else if (sFP != 1) {
                    height *= sFP;
                    width = Math.min(height * prop, max ? max : 1);
                }
                else {
                    width = height * prop;
                }
                height = width / prop;
            }
        }

        height = isNaN(height) ? 0 : height;
        width = isNaN(width) ? 0 : width;

        if (!max && this.conf.fixItemSize) {

            var propS = size.width / size.height;

            var max = Math.max(size.width, size.height);
            var s = this._scaleImageSize(item, { width: max, height: max }, max);

            if (propS < 1) {
                height = s.height / size.height;
                width = height * prop / propS;
            }
            else {
                width = s.width / size.width;
                height = width / prop * propS;
            }

            var h = height * 100;
            var w = width * 100;
            var mL = (1 - width) / 2 * 100;
            var mT = (1 - height) / propS * 100 * (vF ? 0.5 : 1);
            c.style.height = h + "%";
            if (item.reflection) item.reflection.style.height = h * this.conf.reflectionHeight + "%";
            c.style.width = w + "%";
            if (item.reflection) item.reflection.style.width = w + "%";
            c.style.marginLeft = mL + "%";
            if (item.reflection) item.reflection.style.marginLeft = mL + "%";
            c.style.marginTop = mT + "%";

            item.element.style.overflow = "hidden";

            return size;
        }
        else {
            return { width: width, height: height };
        }

    },

    _setItemSize: (function() {
        if (ContentFlowGlobal.Browser.IE) {
            var _setItemSize = function(item, size) {
                if (!this.conf.fixItemSize) {
                    item.content.style.height = size.height + "px";
                }
                else if (ContentFlowGlobal.Browser.IE6) {
                    var h = parseInt(item.content.style.height) / 100;
                    item.content.style.height = size.height * h + "px";
                    var mT = parseInt(item.content.style.marginTop) / 100;
                    item.content.style.marginTop = size.height * mT + "px";
                }
                if (item.reflection) {
                    var h = parseInt(item.content.style.height);
                    item.reflection.style.height = h * this.conf.reflectionHeight + "px";
                    item.reflection.style.marginTop = h * this.conf.reflectionGap + "px";
                }
                item.element.style.width = size.width + "px";
                item.element.style.height = size.height * (1 + this.conf.reflectionHeight + this.conf.reflectionGap) + "px";
            }
        }
        else {
            var _setItemSize = function(item, size) {
                if (item.reflection) {
                    item.element.style.height = size.height * (1 + this.conf.reflectionHeight + this.conf.reflectionGap) + "px";
                    item.reflection.style.marginTop = size.height * this.conf.reflectionGap + "px";
                }
                else if (this._reflectionWithinImage) {
                    item.element.style.height = size.height * (1 + this.conf.reflectionHeight + this.conf.reflectionGap) + "px";
                }
                else {
                    item.element.style.height = size.height + "px";
                }
                item.element.style.width = size.width + "px";
            }
        }
        return _setItemSize;

    })(),

    _setItemOpacity: (function() {
        if (ContentFlowGlobal.Browser.IE6) {
            var _setItemOpacity = function(item) {
                if (item.content.origSrc && item.content.origSrc.match(/\.png$/)) {
                    var s = item.content.src;
                    item.content.src = item.content.origSrc;
                    item.content.style.filter = item.content.filterString + " progid:DXImageTransform.Microsoft.BasicImage(opacity=" + item.opacity + ")";
                    item.content.src = s;
                }
                else {
                    item.content.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(opacity=" + item.opacity + ")";
                }
                if (item.reflection) item.reflection.style.filter = item.reflection.filterString + "progid:DXImageTransform.Microsoft.BasicImage(opacity=" + item.opacity + ")";
            }
        }
        else if (ContentFlowGlobal.Browser.IE) {
            var _setItemOpacity = function(item) { item.element.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(opacity=" + item.opacity + ")"; }
        }
        else {
            var _setItemOpacity = function(item) { item.element.style.opacity = item.opacity; }
        }
        return _setItemOpacity;
    })()


};


/* ==================== extendig javascript/DOM objects ==================== */

/*
*  adds bind method to Function class
*  http://www.digital-web.com/articles/scope_in_javascript/
*/

if (!Function.bind) {
    Function.prototype.bind = function(obj) {
        var method = this;
        return function() {
            return method.apply(obj, arguments);
        };
    };
}


/*
* extending Math object
*/
if (!Math.erf2) {
    // error function (http://en.wikipedia.org/wiki/Error_function), implemented as erf(x)^2
    Math.erf2 = function(x) {
        var a = -(8 * (Math.PI - 3) / (3 * Math.PI * (Math.PI - 4)));
        var x2 = x * x;
        var f = 1 - Math.pow(Math.E, -x2 * (4 / Math.PI + a * x2) / (1 + a * x2));
        return f;
    };
}

if (!Math._2PI05) {
    Math._2PI05 = Math.sqrt(2 * Math.PI);
}

if (!Math.normDist) {
    // normal distribution
    Math.normDist = function(x, sig, mu) {
        if (!sig) var sig = 1;
        if (!mu) var mu = 0;
        if (!x) var x = -mu;
        return 1 / (sig * Math._2PI05) * Math.pow(Math.E, -(x - mu) * (x - mu) / (2 * sig * sig));
    };
}

if (!Math.normedNormDist) {
    Math.normedNormDist = function(x, sig, mu) {
        return this.normDist(x, sig, mu) / this.normDist(mu, sig, mu);
    };
}

if (!Math.exp) {
    Math.exp = function(x) {
        return Math.pow(Math.E, x);
    };
}

if (!Math.ln) {
    Math.ln = Math.log;
}

if (!Math.log2) {
    Math.log2 = function(x) {
        return Math.log(x) / Math.LN2;
    };
}

if (!Math.log10) {
    Math.log10 = function(x) {
        return Math.log(x) / Math.LN10;
    };
}

if (!Math.logerithm) {
    Math.logerithm = function(x, b) {
        if (!b || b == Math.E)
            return Math.log(x);
        else if (b == 2)
            return Math.log2(x);
        else if (b == 10)
            return Math.log10(x);
        else
            return Math.log(x) / Math.log(b);
    };
}


/*
* extending Event object
*/
if (!Event) var Event = {};

if (!Event.stop) {
    Event.stop = function(event) {
        event.cancelBubble = true;
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        return false;
    };
}

/*
* extending Element object
*/
if (document.all && !window.opera) {
    window.$CF = function(el) {
        if (typeof el == "string") {
            return window.$CF(document.getElementById(el));
        }
        else {
            if (CFElement.prototype.extend && el && !el.extend) CFElement.prototype.extend(el);
        }
        return el;
    };
} else {
    window.$CF = function(el) {
        return el;
    };
}

if (!window.HTMLElement) {
    CFElement = {};
    CFElement.prototype = {};
    CFElement.prototype.extend = function(el) {
        for (var method in this) {
            if (!el[method]) el[method] = this[method];
        }
    };
}
else {
    CFElement = window.HTMLElement;
}


/*
* Thanks to Peter-Paul Koch
* http://www.quirksmode.org/js/findpos.html
*/
if (!CFElement.findPos) {
    CFElement.prototype.findPos = function() {
        var obj = this;
        var curleft = curtop = 0;
        try {
            if (obj.offsetParent) {
                curleft = obj.offsetLeft;
                curtop = obj.offsetTop;
                while (obj = obj.offsetParent) {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                }
            }
        }
        catch (ex) { }
        return { left: curleft, top: curtop };
    };
}

if (!CFElement.getDimensions) {
    CFElement.prototype.getDimensions = function() {
        return { width: this.clientWidth, height: this.clientHeight };
    };
}

/*
* checks if an element has the class className
*/
if (!CFElement.hasClassName) {
    CFElement.prototype.hasClassName = function(className) {
        return (new RegExp('\\b' + className + '\\b').test(this.className));
    };
}

/*
* adds the class className to the element
*/
if (!CFElement.addClassName) {
    CFElement.prototype.addClassName = function(className) {
        if (!this.hasClassName(className)) {
            this.className += (this.className ? ' ' : '') + className;
        }
    };
}

/*
* removes the class className from the element el
*/
if (!CFElement.removeClassName) {
    CFElement.prototype.removeClassName = function(className) {
        this.className = this.className.replace(new RegExp('\\b' + className + '\\b'), '').replace(/\s\s/g, ' ');
    };
}

/*
* removes or adds the class className from/to the element el
* depending if the element has the class className or not.
*/
if (!CFElement.toggleClassName) {
    CFElement.prototype.toggleClassName = function(className) {
        if (this.hasClassName(className)) {
            this.removeClassName(className);
        } else {
            this.addClassName(className);
        }
    };
}

/*
* returns all children of element el, which have the class className
*/
if (!CFElement.getChildrenByClassName) {
    CFElement.prototype.getChildrenByClassName = function(className) {
        var children = new Array();
        for (var i = 0; i < this.childNodes.length; i++) {
            var c = this.childNodes[i];
            if (c.nodeType == 1 && $CF(c).hasClassName(className)) {
                children.push(c);
            }
        }
        return children;
    };
}

/*
* Browser independent event handling method.
* adds the eventListener  eventName to element el and attaches the function method to it.
*/
if (!CFElement.addEvent) {
    CFElement.prototype.addEvent = function(eventName, method, capture) {
        if (this.addEventListener) {
            this.addEventListener(eventName, method, capture);
        } else {
            this.attachEvent('on' + eventName, method);
        }
    };
}

/*
* Browser independent event handling method.
* removes the eventListener  eventName with the attached function method from element el.
*/
if (!CFElement.removeEvent) {
    CFElement.prototype.removeEvent = function(eventName, method, capture) {
        if (this.removeEventListener)
            this.removeEventListener(eventName, method, capture);
        else
            this.detachEvent('on' + eventName, method);
    };
}

/*
* Browser independent event handling method.
* adds the eventListener  eventName to element el and attaches the function method to it.
*/
if (!window.addEvent) {
    window.addEvent = function(eventName, method, capture) {
        if (this.addEventListener) {
            this.addEventListener(eventName, method, capture);
        } else {
            if (eventName != 'load' && eventName != 'resize')
                document.attachEvent('on' + eventName, method);
            else
                this.attachEvent('on' + eventName, method);
        }
    };
}

/*
* Browser independent event handling method.
* removes the eventListener  eventName with the attached function method from element el.
*/
if (!window.removeEvent) {
    window.removeEvent = function(eventName, method, capture) {
        if (this.removeEventListener) {
            this.removeEventListener(eventName, method, capture);
        } else {
            if (eventName != 'load' && eventName != 'resize')
                document.detachEvent('on' + eventName, method);
            else
                this.detachEvent('on' + eventName, method);
        }
    };
}

/* ==================== start it all up ==================== */
ContentFlowGlobal.init();




/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;

if (typeof jwplayer == "undefined") { var jwplayer = function (a) { if (jwplayer.api) { return jwplayer.api.selectPlayer(a) } }; var $jw = jwplayer; jwplayer.version = "5.9.2128"; jwplayer.vid = document.createElement("video"); jwplayer.audio = document.createElement("audio"); jwplayer.source = document.createElement("source"); (function (b) { b.utils = function () { }; b.utils.typeOf = function (d) { var c = typeof d; if (c === "object") { if (d) { if (d instanceof Array) { c = "array" } } else { c = "null" } } return c }; b.utils.extend = function () { var c = b.utils.extend["arguments"]; if (c.length > 1) { for (var e = 1; e < c.length; e++) { for (var d in c[e]) { c[0][d] = c[e][d] } } return c[0] } return null }; b.utils.clone = function (f) { var c; var d = b.utils.clone["arguments"]; if (d.length == 1) { switch (b.utils.typeOf(d[0])) { case "object": c = {}; for (var e in d[0]) { c[e] = b.utils.clone(d[0][e]) } break; case "array": c = []; for (var e in d[0]) { c[e] = b.utils.clone(d[0][e]) } break; default: return d[0]; break } } return c }; b.utils.extension = function (c) { if (!c) { return "" } c = c.substring(c.lastIndexOf("/") + 1, c.length); c = c.split("?")[0]; if (c.lastIndexOf(".") > -1) { return c.substr(c.lastIndexOf(".") + 1, c.length).toLowerCase() } return }; b.utils.html = function (c, d) { c.innerHTML = d }; b.utils.wrap = function (c, d) { if (c.parentNode) { c.parentNode.replaceChild(d, c) } d.appendChild(c) }; b.utils.ajax = function (g, f, c) { var e; if (window.XMLHttpRequest) { e = new XMLHttpRequest() } else { e = new ActiveXObject("Microsoft.XMLHTTP") } e.onreadystatechange = function () { if (e.readyState === 4) { if (e.status === 200) { if (f) { if (!b.utils.exists(e.responseXML)) { try { if (window.DOMParser) { var h = (new DOMParser()).parseFromString(e.responseText, "text/xml"); if (h) { e = b.utils.extend({}, e, { responseXML: h }) } } else { h = new ActiveXObject("Microsoft.XMLDOM"); h.async = "false"; h.loadXML(e.responseText); e = b.utils.extend({}, e, { responseXML: h }) } } catch (j) { if (c) { c(g) } } } f(e) } } else { if (c) { c(g) } } } }; try { e.open("GET", g, true); e.send(null) } catch (d) { if (c) { c(g) } } return e }; b.utils.load = function (d, e, c) { d.onreadystatechange = function () { if (d.readyState === 4) { if (d.status === 200) { if (e) { e() } } else { if (c) { c() } } } } }; b.utils.find = function (d, c) { return d.getElementsByTagName(c) }; b.utils.append = function (c, d) { c.appendChild(d) }; b.utils.isIE = function () { return ((! +"\v1") || (typeof window.ActiveXObject != "undefined")) }; b.utils.userAgentMatch = function (d) { var c = navigator.userAgent.toLowerCase(); return (c.match(d) !== null) }; b.utils.isIOS = function () { return b.utils.userAgentMatch(/iP(hone|ad|od)/i) }; b.utils.isIPad = function () { return b.utils.userAgentMatch(/iPad/i) }; b.utils.isIPod = function () { return b.utils.userAgentMatch(/iP(hone|od)/i) }; b.utils.isAndroid = function () { return b.utils.userAgentMatch(/android/i) }; b.utils.isLegacyAndroid = function () { return b.utils.userAgentMatch(/android 2.[012]/i) }; b.utils.isBlackberry = function () { return b.utils.userAgentMatch(/blackberry/i) }; b.utils.isMobile = function () { return b.utils.userAgentMatch(/(iP(hone|ad|od))|android/i) }; b.utils.getFirstPlaylistItemFromConfig = function (c) { var d = {}; var e; if (c.playlist && c.playlist.length) { e = c.playlist[0] } else { e = c } d.file = e.file; d.levels = e.levels; d.streamer = e.streamer; d.playlistfile = e.playlistfile; d.provider = e.provider; if (!d.provider) { if (d.file && (d.file.toLowerCase().indexOf("youtube.com") > -1 || d.file.toLowerCase().indexOf("youtu.be") > -1)) { d.provider = "youtube" } if (d.streamer && d.streamer.toLowerCase().indexOf("rtmp://") == 0) { d.provider = "rtmp" } if (e.type) { d.provider = e.type.toLowerCase() } } if (d.provider == "audio") { d.provider = "sound" } return d }; b.utils.getOuterHTML = function (c) { if (c.outerHTML) { return c.outerHTML } else { try { return new XMLSerializer().serializeToString(c) } catch (d) { return "" } } }; b.utils.setOuterHTML = function (f, e) { if (f.outerHTML) { f.outerHTML = e } else { var g = document.createElement("div"); g.innerHTML = e; var c = document.createRange(); c.selectNodeContents(g); var d = c.extractContents(); f.parentNode.insertBefore(d, f); f.parentNode.removeChild(f) } }; b.utils.hasFlash = function () { if (typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] != "undefined") { return true } if (typeof window.ActiveXObject != "undefined") { try { new ActiveXObject("ShockwaveFlash.ShockwaveFlash"); return true } catch (c) { } } return false }; b.utils.getPluginName = function (c) { if (c.lastIndexOf("/") >= 0) { c = c.substring(c.lastIndexOf("/") + 1, c.length) } if (c.lastIndexOf("-") >= 0) { c = c.substring(0, c.lastIndexOf("-")) } if (c.lastIndexOf(".swf") >= 0) { c = c.substring(0, c.lastIndexOf(".swf")) } if (c.lastIndexOf(".js") >= 0) { c = c.substring(0, c.lastIndexOf(".js")) } return c }; b.utils.getPluginVersion = function (c) { if (c.lastIndexOf("-") >= 0) { if (c.lastIndexOf(".js") >= 0) { return c.substring(c.lastIndexOf("-") + 1, c.lastIndexOf(".js")) } else { if (c.lastIndexOf(".swf") >= 0) { return c.substring(c.lastIndexOf("-") + 1, c.lastIndexOf(".swf")) } else { return c.substring(c.lastIndexOf("-") + 1) } } } return "" }; b.utils.getAbsolutePath = function (j, h) { if (!b.utils.exists(h)) { h = document.location.href } if (!b.utils.exists(j)) { return undefined } if (a(j)) { return j } var k = h.substring(0, h.indexOf("://") + 3); var g = h.substring(k.length, h.indexOf("/", k.length + 1)); var d; if (j.indexOf("/") === 0) { d = j.split("/") } else { var e = h.split("?")[0]; e = e.substring(k.length + g.length + 1, e.lastIndexOf("/")); d = e.split("/").concat(j.split("/")) } var c = []; for (var f = 0; f < d.length; f++) { if (!d[f] || !b.utils.exists(d[f]) || d[f] == ".") { continue } else { if (d[f] == "..") { c.pop() } else { c.push(d[f]) } } } return k + g + "/" + c.join("/") }; function a(d) { if (!b.utils.exists(d)) { return } var e = d.indexOf("://"); var c = d.indexOf("?"); return (e > 0 && (c < 0 || (c > e))) } b.utils.pluginPathType = { ABSOLUTE: "ABSOLUTE", RELATIVE: "RELATIVE", CDN: "CDN" }; b.utils.getPluginPathType = function (d) { if (typeof d != "string") { return } d = d.split("?")[0]; var e = d.indexOf("://"); if (e > 0) { return b.utils.pluginPathType.ABSOLUTE } var c = d.indexOf("/"); var f = b.utils.extension(d); if (e < 0 && c < 0 && (!f || !isNaN(f))) { return b.utils.pluginPathType.CDN } return b.utils.pluginPathType.RELATIVE }; b.utils.mapEmpty = function (c) { for (var d in c) { return false } return true }; b.utils.mapLength = function (d) { var c = 0; for (var e in d) { c++ } return c }; b.utils.log = function (d, c) { if (typeof console != "undefined" && typeof console.log != "undefined") { if (c) { console.log(d, c) } else { console.log(d) } } }; b.utils.css = function (d, g, c) { if (b.utils.exists(d)) { for (var e in g) { try { if (typeof g[e] === "undefined") { continue } else { if (typeof g[e] == "number" && !(e == "zIndex" || e == "opacity")) { if (isNaN(g[e])) { continue } if (e.match(/color/i)) { g[e] = "#" + b.utils.strings.pad(g[e].toString(16), 6) } else { g[e] = Math.ceil(g[e]) + "px" } } } d.style[e] = g[e] } catch (f) { } } } }; b.utils.isYouTube = function (c) { return (c.indexOf("youtube.com") > -1 || c.indexOf("youtu.be") > -1) }; b.utils.transform = function (e, d, c, g, h) { if (!b.utils.exists(d)) { d = 1 } if (!b.utils.exists(c)) { c = 1 } if (!b.utils.exists(g)) { g = 0 } if (!b.utils.exists(h)) { h = 0 } if (d == 1 && c == 1 && g == 0 && h == 0) { e.style.webkitTransform = ""; e.style.MozTransform = ""; e.style.OTransform = "" } else { var f = "scale(" + d + "," + c + ") translate(" + g + "px," + h + "px)"; e.style.webkitTransform = f; e.style.MozTransform = f; e.style.OTransform = f } }; b.utils.stretch = function (k, q, p, g, n, h) { if (typeof p == "undefined" || typeof g == "undefined" || typeof n == "undefined" || typeof h == "undefined") { return } var d = p / n; var f = g / h; var m = 0; var l = 0; var e = false; var c = {}; if (q.parentElement) { q.parentElement.style.overflow = "hidden" } b.utils.transform(q); switch (k.toUpperCase()) { case b.utils.stretching.NONE: c.width = n; c.height = h; c.top = (g - c.height) / 2; c.left = (p - c.width) / 2; break; case b.utils.stretching.UNIFORM: if (d > f) { c.width = n * f; c.height = h * f; if (c.width / p > 0.95) { e = true; d = Math.ceil(100 * p / c.width) / 100; f = 1; c.width = p } } else { c.width = n * d; c.height = h * d; if (c.height / g > 0.95) { e = true; d = 1; f = Math.ceil(100 * g / c.height) / 100; c.height = g } } c.top = (g - c.height) / 2; c.left = (p - c.width) / 2; break; case b.utils.stretching.FILL: if (d > f) { c.width = n * d; c.height = h * d } else { c.width = n * f; c.height = h * f } c.top = (g - c.height) / 2; c.left = (p - c.width) / 2; break; case b.utils.stretching.EXACTFIT: c.width = n; c.height = h; var o = Math.round((n / 2) * (1 - 1 / d)); var j = Math.round((h / 2) * (1 - 1 / f)); e = true; c.top = c.left = 0; break; default: break } if (e) { b.utils.transform(q, d, f, o, j) } b.utils.css(q, c) }; b.utils.stretching = { NONE: "NONE", FILL: "FILL", UNIFORM: "UNIFORM", EXACTFIT: "EXACTFIT" }; b.utils.deepReplaceKeyName = function (k, e, c) { switch (b.utils.typeOf(k)) { case "array": for (var g = 0; g < k.length; g++) { k[g] = b.utils.deepReplaceKeyName(k[g], e, c) } break; case "object": for (var f in k) { var j, h; if (e instanceof Array && c instanceof Array) { if (e.length != c.length) { continue } else { j = e; h = c } } else { j = [e]; h = [c] } var d = f; for (var g = 0; g < j.length; g++) { d = d.replace(new RegExp(e[g], "g"), c[g]) } k[d] = b.utils.deepReplaceKeyName(k[f], e, c); if (f != d) { delete k[f] } } break } return k }; b.utils.isInArray = function (e, d) { if (!(e) || !(e instanceof Array)) { return false } for (var c = 0; c < e.length; c++) { if (d === e[c]) { return true } } return false }; b.utils.exists = function (c) { switch (typeof (c)) { case "string": return (c.length > 0); break; case "object": return (c !== null); case "undefined": return false } return true }; b.utils.empty = function (c) { if (typeof c.hasChildNodes == "function") { while (c.hasChildNodes()) { c.removeChild(c.firstChild) } } }; b.utils.parseDimension = function (c) { if (typeof c == "string") { if (c === "") { return 0 } else { if (c.lastIndexOf("%") > -1) { return c } else { return parseInt(c.replace("px", ""), 10) } } } return c }; b.utils.getDimensions = function (c) { if (c && c.style) { return { x: b.utils.parseDimension(c.style.left), y: b.utils.parseDimension(c.style.top), width: b.utils.parseDimension(c.style.width), height: b.utils.parseDimension(c.style.height)} } else { return {} } }; b.utils.getElementWidth = function (c) { if (!c) { return null } else { if (c == document.body) { return b.utils.parentNode(c).clientWidth } else { if (c.clientWidth > 0) { return c.clientWidth } else { if (c.style) { return b.utils.parseDimension(c.style.width) } else { return null } } } } }; b.utils.getElementHeight = function (c) { if (!c) { return null } else { if (c == document.body) { return b.utils.parentNode(c).clientHeight } else { if (c.clientHeight > 0) { return c.clientHeight } else { if (c.style) { return b.utils.parseDimension(c.style.height) } else { return null } } } } }; b.utils.timeFormat = function (c) { str = "00:00"; if (c > 0) { str = Math.floor(c / 60) < 10 ? "0" + Math.floor(c / 60) + ":" : Math.floor(c / 60) + ":"; str += Math.floor(c % 60) < 10 ? "0" + Math.floor(c % 60) : Math.floor(c % 60) } return str }; b.utils.useNativeFullscreen = function () { return (navigator && navigator.vendor && navigator.vendor.indexOf("Apple") == 0) }; b.utils.parentNode = function (c) { if (!c) { return docuemnt.body } else { if (c.parentNode) { return c.parentNode } else { if (c.parentElement) { return c.parentElement } else { return c } } } }; b.utils.getBoundingClientRect = function (c) { if (typeof c.getBoundingClientRect == "function") { return c.getBoundingClientRect() } else { return { left: c.offsetLeft + document.body.scrollLeft, top: c.offsetTop + document.body.scrollTop, width: c.offsetWidth, height: c.offsetHeight} } }; b.utils.translateEventResponse = function (e, c) { var g = b.utils.extend({}, c); if (e == b.api.events.JWPLAYER_FULLSCREEN && !g.fullscreen) { g.fullscreen = g.message == "true" ? true : false; delete g.message } else { if (typeof g.data == "object") { g = b.utils.extend(g, g.data); delete g.data } else { if (typeof g.metadata == "object") { b.utils.deepReplaceKeyName(g.metadata, ["__dot__", "__spc__", "__dsh__"], [".", " ", "-"]) } } } var d = ["position", "duration", "offset"]; for (var f in d) { if (g[d[f]]) { g[d[f]] = Math.round(g[d[f]] * 1000) / 1000 } } return g }; b.utils.saveCookie = function (c, d) { document.cookie = "jwplayer." + c + "=" + d + "; path=/" }; b.utils.getCookies = function () { var f = {}; var e = document.cookie.split("; "); for (var d = 0; d < e.length; d++) { var c = e[d].split("="); if (c[0].indexOf("jwplayer.") == 0) { f[c[0].substring(9, c[0].length)] = c[1] } } return f }; b.utils.readCookie = function (c) { return b.utils.getCookies()[c] } })(jwplayer); (function (a) { a.events = function () { }; a.events.COMPLETE = "COMPLETE"; a.events.ERROR = "ERROR" })(jwplayer); (function (jwplayer) { jwplayer.events.eventdispatcher = function (debug) { var _debug = debug; var _listeners; var _globallisteners; this.resetEventListeners = function () { _listeners = {}; _globallisteners = [] }; this.resetEventListeners(); this.addEventListener = function (type, listener, count) { try { if (!jwplayer.utils.exists(_listeners[type])) { _listeners[type] = [] } if (typeof (listener) == "string") { eval("listener = " + listener) } _listeners[type].push({ listener: listener, count: count }) } catch (err) { jwplayer.utils.log("error", err) } return false }; this.removeEventListener = function (type, listener) { if (!_listeners[type]) { return } try { for (var listenerIndex = 0; listenerIndex < _listeners[type].length; listenerIndex++) { if (_listeners[type][listenerIndex].listener.toString() == listener.toString()) { _listeners[type].splice(listenerIndex, 1); break } } } catch (err) { jwplayer.utils.log("error", err) } return false }; this.addGlobalListener = function (listener, count) { try { if (typeof (listener) == "string") { eval("listener = " + listener) } _globallisteners.push({ listener: listener, count: count }) } catch (err) { jwplayer.utils.log("error", err) } return false }; this.removeGlobalListener = function (listener) { if (!listener) { return } try { for (var globalListenerIndex = 0; globalListenerIndex < _globallisteners.length; globalListenerIndex++) { if (_globallisteners[globalListenerIndex].listener.toString() == listener.toString()) { _globallisteners.splice(globalListenerIndex, 1); break } } } catch (err) { jwplayer.utils.log("error", err) } return false }; this.sendEvent = function (type, data) { if (!jwplayer.utils.exists(data)) { data = {} } if (_debug) { jwplayer.utils.log(type, data) } if (typeof _listeners[type] != "undefined") { for (var listenerIndex = 0; listenerIndex < _listeners[type].length; listenerIndex++) { try { _listeners[type][listenerIndex].listener(data) } catch (err) { jwplayer.utils.log("There was an error while handling a listener: " + err.toString(), _listeners[type][listenerIndex].listener) } if (_listeners[type][listenerIndex]) { if (_listeners[type][listenerIndex].count === 1) { delete _listeners[type][listenerIndex] } else { if (_listeners[type][listenerIndex].count > 0) { _listeners[type][listenerIndex].count = _listeners[type][listenerIndex].count - 1 } } } } } for (var globalListenerIndex = 0; globalListenerIndex < _globallisteners.length; globalListenerIndex++) { try { _globallisteners[globalListenerIndex].listener(data) } catch (err) { jwplayer.utils.log("There was an error while handling a listener: " + err.toString(), _globallisteners[globalListenerIndex].listener) } if (_globallisteners[globalListenerIndex]) { if (_globallisteners[globalListenerIndex].count === 1) { delete _globallisteners[globalListenerIndex] } else { if (_globallisteners[globalListenerIndex].count > 0) { _globallisteners[globalListenerIndex].count = _globallisteners[globalListenerIndex].count - 1 } } } } } } })(jwplayer); (function (a) { var b = {}; a.utils.animations = function () { }; a.utils.animations.transform = function (c, d) { c.style.webkitTransform = d; c.style.MozTransform = d; c.style.OTransform = d; c.style.msTransform = d }; a.utils.animations.transformOrigin = function (c, d) { c.style.webkitTransformOrigin = d; c.style.MozTransformOrigin = d; c.style.OTransformOrigin = d; c.style.msTransformOrigin = d }; a.utils.animations.rotate = function (c, d) { a.utils.animations.transform(c, ["rotate(", d, "deg)"].join("")) }; a.utils.cancelAnimation = function (c) { delete b[c.id] }; a.utils.fadeTo = function (m, f, e, j, h, d) { if (b[m.id] != d && a.utils.exists(d)) { return } if (m.style.opacity == f) { return } var c = new Date().getTime(); if (d > c) { setTimeout(function () { a.utils.fadeTo(m, f, e, j, 0, d) }, d - c) } if (m.style.display == "none") { m.style.display = "block" } if (!a.utils.exists(j)) { j = m.style.opacity === "" ? 1 : m.style.opacity } if (m.style.opacity == f && m.style.opacity !== "" && a.utils.exists(d)) { if (f === 0) { m.style.display = "none" } return } if (!a.utils.exists(d)) { d = c; b[m.id] = d } if (!a.utils.exists(h)) { h = 0 } var k = (e > 0) ? ((c - d) / (e * 1000)) : 0; k = k > 1 ? 1 : k; var l = f - j; var g = j + (k * l); if (g > 1) { g = 1 } else { if (g < 0) { g = 0 } } m.style.opacity = g; if (h > 0) { b[m.id] = d + h * 1000; a.utils.fadeTo(m, f, e, j, 0, b[m.id]); return } setTimeout(function () { a.utils.fadeTo(m, f, e, j, 0, d) }, 10) } })(jwplayer); (function (a) { a.utils.arrays = function () { }; a.utils.arrays.indexOf = function (c, d) { for (var b = 0; b < c.length; b++) { if (c[b] == d) { return b } } return -1 }; a.utils.arrays.remove = function (c, d) { var b = a.utils.arrays.indexOf(c, d); if (b > -1) { c.splice(b, 1) } } })(jwplayer); (function (a) { a.utils.extensionmap = { "3gp": { html5: "video/3gpp", flash: "video" }, "3gpp": { html5: "video/3gpp" }, "3g2": { html5: "video/3gpp2", flash: "video" }, "3gpp2": { html5: "video/3gpp2" }, flv: { flash: "video" }, f4a: { html5: "audio/mp4" }, f4b: { html5: "audio/mp4", flash: "video" }, f4v: { html5: "video/mp4", flash: "video" }, mov: { html5: "video/quicktime", flash: "video" }, m4a: { html5: "audio/mp4", flash: "video" }, m4b: { html5: "audio/mp4" }, m4p: { html5: "audio/mp4" }, m4v: { html5: "video/mp4", flash: "video" }, mp4: { html5: "video/mp4", flash: "video" }, rbs: { flash: "sound" }, aac: { html5: "audio/aac", flash: "video" }, mp3: { html5: "audio/mp3", flash: "sound" }, ogg: { html5: "audio/ogg" }, oga: { html5: "audio/ogg" }, ogv: { html5: "video/ogg" }, webm: { html5: "video/webm" }, m3u8: { html5: "audio/x-mpegurl" }, gif: { flash: "image" }, jpeg: { flash: "image" }, jpg: { flash: "image" }, swf: { flash: "image" }, png: { flash: "image" }, wav: { html5: "audio/x-wav"}} })(jwplayer); (function (e) { e.utils.mediaparser = function () { }; var g = { element: { width: "width", height: "height", id: "id", "class": "className", name: "name" }, media: { src: "file", preload: "preload", autoplay: "autostart", loop: "repeat", controls: "controls" }, source: { src: "file", type: "type", media: "media", "data-jw-width": "width", "data-jw-bitrate": "bitrate" }, video: { poster: "image"} }; var f = {}; e.utils.mediaparser.parseMedia = function (j) { return d(j) }; function c(k, j) { if (!e.utils.exists(j)) { j = g[k] } else { e.utils.extend(j, g[k]) } return j } function d(n, j) { if (f[n.tagName.toLowerCase()] && !e.utils.exists(j)) { return f[n.tagName.toLowerCase()](n) } else { j = c("element", j); var o = {}; for (var k in j) { if (k != "length") { var m = n.getAttribute(k); if (e.utils.exists(m)) { o[j[k]] = m } } } var l = n.style["#background-color"]; if (l && !(l == "transparent" || l == "rgba(0, 0, 0, 0)")) { o.screencolor = l } return o } } function h(n, k) { k = c("media", k); var l = []; var j = e.utils.selectors("source", n); for (var m in j) { if (!isNaN(m)) { l.push(a(j[m])) } } var o = d(n, k); if (e.utils.exists(o.file)) { l[0] = { file: o.file} } o.levels = l; return o } function a(l, k) { k = c("source", k); var j = d(l, k); j.width = j.width ? j.width : 0; j.bitrate = j.bitrate ? j.bitrate : 0; return j } function b(l, k) { k = c("video", k); var j = h(l, k); return j } f.media = h; f.audio = h; f.source = a; f.video = b })(jwplayer); (function (a) { a.utils.loaderstatus = { NEW: "NEW", LOADING: "LOADING", ERROR: "ERROR", COMPLETE: "COMPLETE" }; a.utils.scriptloader = function (c) { var d = a.utils.loaderstatus.NEW; var b = new a.events.eventdispatcher(); a.utils.extend(this, b); this.load = function () { if (d == a.utils.loaderstatus.NEW) { d = a.utils.loaderstatus.LOADING; var e = document.createElement("script"); e.onload = function (f) { d = a.utils.loaderstatus.COMPLETE; b.sendEvent(a.events.COMPLETE) }; e.onerror = function (f) { d = a.utils.loaderstatus.ERROR; b.sendEvent(a.events.ERROR) }; e.onreadystatechange = function () { if (e.readyState == "loaded" || e.readyState == "complete") { d = a.utils.loaderstatus.COMPLETE; b.sendEvent(a.events.COMPLETE) } }; document.getElementsByTagName("head")[0].appendChild(e); e.src = c } }; this.getStatus = function () { return d } } })(jwplayer); (function (a) { a.utils.selectors = function (b, e) { if (!a.utils.exists(e)) { e = document } b = a.utils.strings.trim(b); var c = b.charAt(0); if (c == "#") { return e.getElementById(b.substr(1)) } else { if (c == ".") { if (e.getElementsByClassName) { return e.getElementsByClassName(b.substr(1)) } else { return a.utils.selectors.getElementsByTagAndClass("*", b.substr(1)) } } else { if (b.indexOf(".") > 0) { var d = b.split("."); return a.utils.selectors.getElementsByTagAndClass(d[0], d[1]) } else { return e.getElementsByTagName(b) } } } return null }; a.utils.selectors.getElementsByTagAndClass = function (e, h, g) { var j = []; if (!a.utils.exists(g)) { g = document } var f = g.getElementsByTagName(e); for (var d = 0; d < f.length; d++) { if (a.utils.exists(f[d].className)) { var c = f[d].className.split(" "); for (var b = 0; b < c.length; b++) { if (c[b] == h) { j.push(f[d]) } } } } return j } })(jwplayer); (function (a) { a.utils.strings = function () { }; a.utils.strings.trim = function (b) { return b.replace(/^\s*/, "").replace(/\s*$/, "") }; a.utils.strings.pad = function (c, d, b) { if (!b) { b = "0" } while (c.length < d) { c = b + c } return c }; a.utils.strings.serialize = function (b) { if (b == null) { return null } else { if (b == "true") { return true } else { if (b == "false") { return false } else { if (isNaN(Number(b)) || b.length > 5 || b.length == 0) { return b } else { return Number(b) } } } } }; a.utils.strings.seconds = function (d) { d = d.replace(",", "."); var b = d.split(":"); var c = 0; if (d.substr(-1) == "s") { c = Number(d.substr(0, d.length - 1)) } else { if (d.substr(-1) == "m") { c = Number(d.substr(0, d.length - 1)) * 60 } else { if (d.substr(-1) == "h") { c = Number(d.substr(0, d.length - 1)) * 3600 } else { if (b.length > 1) { c = Number(b[b.length - 1]); c += Number(b[b.length - 2]) * 60; if (b.length == 3) { c += Number(b[b.length - 3]) * 3600 } } else { c = Number(d) } } } } return c }; a.utils.strings.xmlAttribute = function (b, c) { for (var d = 0; d < b.attributes.length; d++) { if (b.attributes[d].name && b.attributes[d].name.toLowerCase() == c.toLowerCase()) { return b.attributes[d].value.toString() } } return "" }; a.utils.strings.jsonToString = function (f) { var h = h || {}; if (h && h.stringify) { return h.stringify(f) } var c = typeof (f); if (c != "object" || f === null) { if (c == "string") { f = '"' + f.replace(/"/g, '\\"') + '"' } else { return String(f) } } else { var g = [], b = (f && f.constructor == Array); for (var d in f) { var e = f[d]; switch (typeof (e)) { case "string": e = '"' + e.replace(/"/g, '\\"') + '"'; break; case "object": if (a.utils.exists(e)) { e = a.utils.strings.jsonToString(e) } break } if (b) { if (typeof (e) != "function") { g.push(String(e)) } } else { if (typeof (e) != "function") { g.push('"' + d + '":' + String(e)) } } } if (b) { return "[" + String(g) + "]" } else { return "{" + String(g) + "}" } } } })(jwplayer); (function (c) { var d = new RegExp(/^(#|0x)[0-9a-fA-F]{3,6}/); c.utils.typechecker = function (g, f) { f = !c.utils.exists(f) ? b(g) : f; return e(g, f) }; function b(f) { var g = ["true", "false", "t", "f"]; if (g.toString().indexOf(f.toLowerCase().replace(" ", "")) >= 0) { return "boolean" } else { if (d.test(f)) { return "color" } else { if (!isNaN(parseInt(f, 10)) && parseInt(f, 10).toString().length == f.length) { return "integer" } else { if (!isNaN(parseFloat(f)) && parseFloat(f).toString().length == f.length) { return "float" } } } } return "string" } function e(g, f) { if (!c.utils.exists(f)) { return g } switch (f) { case "color": if (g.length > 0) { return a(g) } return null; case "integer": return parseInt(g, 10); case "float": return parseFloat(g); case "boolean": if (g.toLowerCase() == "true") { return true } else { if (g == "1") { return true } } return false } return g } function a(f) { switch (f.toLowerCase()) { case "blue": return parseInt("0000FF", 16); case "green": return parseInt("00FF00", 16); case "red": return parseInt("FF0000", 16); case "cyan": return parseInt("00FFFF", 16); case "magenta": return parseInt("FF00FF", 16); case "yellow": return parseInt("FFFF00", 16); case "black": return parseInt("000000", 16); case "white": return parseInt("FFFFFF", 16); default: f = f.replace(/(#|0x)?([0-9A-F]{3,6})$/gi, "$2"); if (f.length == 3) { f = f.charAt(0) + f.charAt(0) + f.charAt(1) + f.charAt(1) + f.charAt(2) + f.charAt(2) } return parseInt(f, 16) } return parseInt("000000", 16) } })(jwplayer); (function (a) { a.utils.parsers = function () { }; a.utils.parsers.localName = function (b) { if (!b) { return "" } else { if (b.localName) { return b.localName } else { if (b.baseName) { return b.baseName } else { return "" } } } }; a.utils.parsers.textContent = function (b) { if (!b) { return "" } else { if (b.textContent) { return b.textContent } else { if (b.text) { return b.text } else { return "" } } } } })(jwplayer); (function (a) { a.utils.parsers.jwparser = function () { }; a.utils.parsers.jwparser.PREFIX = "jwplayer"; a.utils.parsers.jwparser.parseEntry = function (c, d) { for (var b = 0; b < c.childNodes.length; b++) { if (c.childNodes[b].prefix == a.utils.parsers.jwparser.PREFIX) { d[a.utils.parsers.localName(c.childNodes[b])] = a.utils.strings.serialize(a.utils.parsers.textContent(c.childNodes[b])); if (a.utils.parsers.localName(c.childNodes[b]) == "file" && d.levels) { delete d.levels } } if (!d.file && String(d.link).toLowerCase().indexOf("youtube") > -1) { d.file = d.link } } return d }; a.utils.parsers.jwparser.getProvider = function (c) { if (c.type) { return c.type } else { if (c.file.indexOf("youtube.com/w") > -1 || c.file.indexOf("youtube.com/v") > -1 || c.file.indexOf("youtu.be/") > -1) { return "youtube" } else { if (c.streamer && c.streamer.indexOf("rtmp") == 0) { return "rtmp" } else { if (c.streamer && c.streamer.indexOf("http") == 0) { return "http" } else { var b = a.utils.strings.extension(c.file); if (extensions.hasOwnProperty(b)) { return extensions[b] } } } } } return "" } })(jwplayer); (function (a) { a.utils.parsers.mediaparser = function () { }; a.utils.parsers.mediaparser.PREFIX = "media"; a.utils.parsers.mediaparser.parseGroup = function (d, f) { var e = false; for (var c = 0; c < d.childNodes.length; c++) { if (d.childNodes[c].prefix == a.utils.parsers.mediaparser.PREFIX) { if (!a.utils.parsers.localName(d.childNodes[c])) { continue } switch (a.utils.parsers.localName(d.childNodes[c]).toLowerCase()) { case "content": if (!e) { f.file = a.utils.strings.xmlAttribute(d.childNodes[c], "url") } if (a.utils.strings.xmlAttribute(d.childNodes[c], "duration")) { f.duration = a.utils.strings.seconds(a.utils.strings.xmlAttribute(d.childNodes[c], "duration")) } if (a.utils.strings.xmlAttribute(d.childNodes[c], "start")) { f.start = a.utils.strings.seconds(a.utils.strings.xmlAttribute(d.childNodes[c], "start")) } if (d.childNodes[c].childNodes && d.childNodes[c].childNodes.length > 0) { f = a.utils.parsers.mediaparser.parseGroup(d.childNodes[c], f) } if (a.utils.strings.xmlAttribute(d.childNodes[c], "width") || a.utils.strings.xmlAttribute(d.childNodes[c], "bitrate") || a.utils.strings.xmlAttribute(d.childNodes[c], "url")) { if (!f.levels) { f.levels = [] } f.levels.push({ width: a.utils.strings.xmlAttribute(d.childNodes[c], "width"), bitrate: a.utils.strings.xmlAttribute(d.childNodes[c], "bitrate"), file: a.utils.strings.xmlAttribute(d.childNodes[c], "url") }) } break; case "title": f.title = a.utils.parsers.textContent(d.childNodes[c]); break; case "description": f.description = a.utils.parsers.textContent(d.childNodes[c]); break; case "keywords": f.tags = a.utils.parsers.textContent(d.childNodes[c]); break; case "thumbnail": f.image = a.utils.strings.xmlAttribute(d.childNodes[c], "url"); break; case "credit": f.author = a.utils.parsers.textContent(d.childNodes[c]); break; case "player": var b = d.childNodes[c].url; if (b.indexOf("youtube.com") >= 0 || b.indexOf("youtu.be") >= 0) { e = true; f.file = a.utils.strings.xmlAttribute(d.childNodes[c], "url") } break; case "group": a.utils.parsers.mediaparser.parseGroup(d.childNodes[c], f); break } } } return f } })(jwplayer); (function (b) { b.utils.parsers.rssparser = function () { }; b.utils.parsers.rssparser.parse = function (f) { var c = []; for (var e = 0; e < f.childNodes.length; e++) { if (b.utils.parsers.localName(f.childNodes[e]).toLowerCase() == "channel") { for (var d = 0; d < f.childNodes[e].childNodes.length; d++) { if (b.utils.parsers.localName(f.childNodes[e].childNodes[d]).toLowerCase() == "item") { c.push(a(f.childNodes[e].childNodes[d])) } } } } return c }; function a(d) { var e = {}; for (var c = 0; c < d.childNodes.length; c++) { if (!b.utils.parsers.localName(d.childNodes[c])) { continue } switch (b.utils.parsers.localName(d.childNodes[c]).toLowerCase()) { case "enclosure": e.file = b.utils.strings.xmlAttribute(d.childNodes[c], "url"); break; case "title": e.title = b.utils.parsers.textContent(d.childNodes[c]); break; case "pubdate": e.date = b.utils.parsers.textContent(d.childNodes[c]); break; case "description": e.description = b.utils.parsers.textContent(d.childNodes[c]); break; case "link": e.link = b.utils.parsers.textContent(d.childNodes[c]); break; case "category": if (e.tags) { e.tags += b.utils.parsers.textContent(d.childNodes[c]) } else { e.tags = b.utils.parsers.textContent(d.childNodes[c]) } break } } e = b.utils.parsers.mediaparser.parseGroup(d, e); e = b.utils.parsers.jwparser.parseEntry(d, e); return new b.html5.playlistitem(e) } })(jwplayer); (function (a) { var c = {}; var b = {}; a.plugins = function () { }; a.plugins.loadPlugins = function (e, d) { b[e] = new a.plugins.pluginloader(new a.plugins.model(c), d); return b[e] }; a.plugins.registerPlugin = function (h, f, e) { var d = a.utils.getPluginName(h); if (c[d]) { c[d].registerPlugin(h, f, e) } else { a.utils.log("A plugin (" + h + ") was registered with the player that was not loaded. Please check your configuration."); for (var g in b) { b[g].pluginFailed() } } } })(jwplayer); (function (a) { a.plugins.model = function (b) { this.addPlugin = function (c) { var d = a.utils.getPluginName(c); if (!b[d]) { b[d] = new a.plugins.plugin(c) } return b[d] } } })(jwplayer); (function (a) { a.plugins.pluginmodes = { FLASH: "FLASH", JAVASCRIPT: "JAVASCRIPT", HYBRID: "HYBRID" }; a.plugins.plugin = function (b) { var d = "http://plugins.longtailvideo.com"; var j = a.utils.loaderstatus.NEW; var k; var h; var l; var c = new a.events.eventdispatcher(); a.utils.extend(this, c); function e() { switch (a.utils.getPluginPathType(b)) { case a.utils.pluginPathType.ABSOLUTE: return b; case a.utils.pluginPathType.RELATIVE: return a.utils.getAbsolutePath(b, window.location.href); case a.utils.pluginPathType.CDN: var o = a.utils.getPluginName(b); var n = a.utils.getPluginVersion(b); var m = (window.location.href.indexOf("https://") == 0) ? d.replace("http://", "https://secure") : d; return m + "/" + a.version.split(".")[0] + "/" + o + "/" + o + (n !== "" ? ("-" + n) : "") + ".js" } } function g(m) { l = setTimeout(function () { j = a.utils.loaderstatus.COMPLETE; c.sendEvent(a.events.COMPLETE) }, 1000) } function f(m) { j = a.utils.loaderstatus.ERROR; c.sendEvent(a.events.ERROR) } this.load = function () { if (j == a.utils.loaderstatus.NEW) { if (b.lastIndexOf(".swf") > 0) { k = b; j = a.utils.loaderstatus.COMPLETE; c.sendEvent(a.events.COMPLETE); return } j = a.utils.loaderstatus.LOADING; var m = new a.utils.scriptloader(e()); m.addEventListener(a.events.COMPLETE, g); m.addEventListener(a.events.ERROR, f); m.load() } }; this.registerPlugin = function (o, n, m) { if (l) { clearTimeout(l); l = undefined } if (n && m) { k = m; h = n } else { if (typeof n == "string") { k = n } else { if (typeof n == "function") { h = n } else { if (!n && !m) { k = o } } } } j = a.utils.loaderstatus.COMPLETE; c.sendEvent(a.events.COMPLETE) }; this.getStatus = function () { return j }; this.getPluginName = function () { return a.utils.getPluginName(b) }; this.getFlashPath = function () { if (k) { switch (a.utils.getPluginPathType(k)) { case a.utils.pluginPathType.ABSOLUTE: return k; case a.utils.pluginPathType.RELATIVE: if (b.lastIndexOf(".swf") > 0) { return a.utils.getAbsolutePath(k, window.location.href) } return a.utils.getAbsolutePath(k, e()); case a.utils.pluginPathType.CDN: if (k.indexOf("-") > -1) { return k + "h" } return k + "-h" } } return null }; this.getJS = function () { return h }; this.getPluginmode = function () { if (typeof k != "undefined" && typeof h != "undefined") { return a.plugins.pluginmodes.HYBRID } else { if (typeof k != "undefined") { return a.plugins.pluginmodes.FLASH } else { if (typeof h != "undefined") { return a.plugins.pluginmodes.JAVASCRIPT } } } }; this.getNewInstance = function (n, m, o) { return new h(n, m, o) }; this.getURL = function () { return b } } })(jwplayer); (function (a) { a.plugins.pluginloader = function (h, e) { var g = {}; var k = a.utils.loaderstatus.NEW; var d = false; var b = false; var c = new a.events.eventdispatcher(); a.utils.extend(this, c); function f() { if (!b) { b = true; k = a.utils.loaderstatus.COMPLETE; c.sendEvent(a.events.COMPLETE) } } function j() { if (!b) { var m = 0; for (plugin in g) { var l = g[plugin].getStatus(); if (l == a.utils.loaderstatus.LOADING || l == a.utils.loaderstatus.NEW) { m++ } } if (m == 0) { f() } } } this.setupPlugins = function (n, l, s) { var m = { length: 0, plugins: {} }; var p = { length: 0, plugins: {} }; for (var o in g) { var q = g[o].getPluginName(); if (g[o].getFlashPath()) { m.plugins[g[o].getFlashPath()] = l.plugins[o]; m.plugins[g[o].getFlashPath()].pluginmode = g[o].getPluginmode(); m.length++ } if (g[o].getJS()) { var r = document.createElement("div"); r.id = n.id + "_" + q; r.style.position = "absolute"; r.style.zIndex = p.length + 10; p.plugins[q] = g[o].getNewInstance(n, l.plugins[o], r); p.length++; if (typeof p.plugins[q].resize != "undefined") { n.onReady(s(p.plugins[q], r, true)); n.onResize(s(p.plugins[q], r)) } } } n.plugins = p.plugins; return m }; this.load = function () { k = a.utils.loaderstatus.LOADING; d = true; for (var l in e) { if (a.utils.exists(l)) { g[l] = h.addPlugin(l); g[l].addEventListener(a.events.COMPLETE, j); g[l].addEventListener(a.events.ERROR, j) } } for (l in g) { g[l].load() } d = false; j() }; this.pluginFailed = function () { f() }; this.getStatus = function () { return k } } })(jwplayer); (function (b) { var a = []; b.api = function (d) { this.container = d; this.id = d.id; var m = {}; var s = {}; var p = {}; var c = []; var g = undefined; var k = false; var h = []; var q = undefined; var o = b.utils.getOuterHTML(d); var r = {}; var j = {}; this.getBuffer = function () { return this.callInternal("jwGetBuffer") }; this.getContainer = function () { return this.container }; function e(u, t) { return function (z, v, w, x) { if (u.renderingMode == "flash" || u.renderingMode == "html5") { var y; if (v) { j[z] = v; y = "jwplayer('" + u.id + "').callback('" + z + "')" } else { if (!v && j[z]) { delete j[z] } } g.jwDockSetButton(z, y, w, x) } return t } } this.getPlugin = function (t) { var v = this; var u = {}; if (t == "dock") { return b.utils.extend(u, { setButton: e(v, u), show: function () { v.callInternal("jwDockShow"); return u }, hide: function () { v.callInternal("jwDockHide"); return u }, onShow: function (w) { v.componentListener("dock", b.api.events.JWPLAYER_COMPONENT_SHOW, w); return u }, onHide: function (w) { v.componentListener("dock", b.api.events.JWPLAYER_COMPONENT_HIDE, w); return u } }) } else { if (t == "controlbar") { return b.utils.extend(u, { show: function () { v.callInternal("jwControlbarShow"); return u }, hide: function () { v.callInternal("jwControlbarHide"); return u }, onShow: function (w) { v.componentListener("controlbar", b.api.events.JWPLAYER_COMPONENT_SHOW, w); return u }, onHide: function (w) { v.componentListener("controlbar", b.api.events.JWPLAYER_COMPONENT_HIDE, w); return u } }) } else { if (t == "display") { return b.utils.extend(u, { show: function () { v.callInternal("jwDisplayShow"); return u }, hide: function () { v.callInternal("jwDisplayHide"); return u }, onShow: function (w) { v.componentListener("display", b.api.events.JWPLAYER_COMPONENT_SHOW, w); return u }, onHide: function (w) { v.componentListener("display", b.api.events.JWPLAYER_COMPONENT_HIDE, w); return u } }) } else { return this.plugins[t] } } } }; this.callback = function (t) { if (j[t]) { return j[t]() } }; this.getDuration = function () { return this.callInternal("jwGetDuration") }; this.getFullscreen = function () { return this.callInternal("jwGetFullscreen") }; this.getHeight = function () { return this.callInternal("jwGetHeight") }; this.getLockState = function () { return this.callInternal("jwGetLockState") }; this.getMeta = function () { return this.getItemMeta() }; this.getMute = function () { return this.callInternal("jwGetMute") }; this.getPlaylist = function () { var u = this.callInternal("jwGetPlaylist"); if (this.renderingMode == "flash") { b.utils.deepReplaceKeyName(u, ["__dot__", "__spc__", "__dsh__"], [".", " ", "-"]) } for (var t = 0; t < u.length; t++) { if (!b.utils.exists(u[t].index)) { u[t].index = t } } return u }; this.getPlaylistItem = function (t) { if (!b.utils.exists(t)) { t = this.getCurrentItem() } return this.getPlaylist()[t] }; this.getPosition = function () { return this.callInternal("jwGetPosition") }; this.getRenderingMode = function () { return this.renderingMode }; this.getState = function () { return this.callInternal("jwGetState") }; this.getVolume = function () { return this.callInternal("jwGetVolume") }; this.getWidth = function () { return this.callInternal("jwGetWidth") }; this.setFullscreen = function (t) { if (!b.utils.exists(t)) { this.callInternal("jwSetFullscreen", !this.callInternal("jwGetFullscreen")) } else { this.callInternal("jwSetFullscreen", t) } return this }; this.setMute = function (t) { if (!b.utils.exists(t)) { this.callInternal("jwSetMute", !this.callInternal("jwGetMute")) } else { this.callInternal("jwSetMute", t) } return this }; this.lock = function () { return this }; this.unlock = function () { return this }; this.load = function (t) { this.callInternal("jwLoad", t); return this }; this.playlistItem = function (t) { this.callInternal("jwPlaylistItem", t); return this }; this.playlistPrev = function () { this.callInternal("jwPlaylistPrev"); return this }; this.playlistNext = function () { this.callInternal("jwPlaylistNext"); return this }; this.resize = function (u, t) { if (this.renderingMode == "html5") { g.jwResize(u, t) } else { this.container.width = u; this.container.height = t; var v = document.getElementById(this.id + "_wrapper"); if (v) { v.style.width = u + "px"; v.style.height = t + "px" } } return this }; this.play = function (t) { if (typeof t == "undefined") { t = this.getState(); if (t == b.api.events.state.PLAYING || t == b.api.events.state.BUFFERING) { this.callInternal("jwPause") } else { this.callInternal("jwPlay") } } else { this.callInternal("jwPlay", t) } return this }; this.pause = function (t) { if (typeof t == "undefined") { t = this.getState(); if (t == b.api.events.state.PLAYING || t == b.api.events.state.BUFFERING) { this.callInternal("jwPause") } else { this.callInternal("jwPlay") } } else { this.callInternal("jwPause", t) } return this }; this.stop = function () { this.callInternal("jwStop"); return this }; this.seek = function (t) { this.callInternal("jwSeek", t); return this }; this.setVolume = function (t) { this.callInternal("jwSetVolume", t); return this }; this.loadInstream = function (u, t) { q = new b.api.instream(this, g, u, t); return q }; this.onBufferChange = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_BUFFER, t) }; this.onBufferFull = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL, t) }; this.onError = function (t) { return this.eventListener(b.api.events.JWPLAYER_ERROR, t) }; this.onFullscreen = function (t) { return this.eventListener(b.api.events.JWPLAYER_FULLSCREEN, t) }; this.onMeta = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_META, t) }; this.onMute = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_MUTE, t) }; this.onPlaylist = function (t) { return this.eventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED, t) }; this.onPlaylistItem = function (t) { return this.eventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM, t) }; this.onReady = function (t) { return this.eventListener(b.api.events.API_READY, t) }; this.onResize = function (t) { return this.eventListener(b.api.events.JWPLAYER_RESIZE, t) }; this.onComplete = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_COMPLETE, t) }; this.onSeek = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_SEEK, t) }; this.onTime = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_TIME, t) }; this.onVolume = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_VOLUME, t) }; this.onBeforePlay = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_BEFOREPLAY, t) }; this.onBeforeComplete = function (t) { return this.eventListener(b.api.events.JWPLAYER_MEDIA_BEFORECOMPLETE, t) }; this.onBuffer = function (t) { return this.stateListener(b.api.events.state.BUFFERING, t) }; this.onPause = function (t) { return this.stateListener(b.api.events.state.PAUSED, t) }; this.onPlay = function (t) { return this.stateListener(b.api.events.state.PLAYING, t) }; this.onIdle = function (t) { return this.stateListener(b.api.events.state.IDLE, t) }; this.remove = function () { m = {}; h = []; if (b.utils.getOuterHTML(this.container) != o) { b.api.destroyPlayer(this.id, o) } }; this.setup = function (u) { if (b.embed) { var t = this.id; this.remove(); var v = b(t); v.config = u; return new b.embed(v) } return this }; this.registerPlugin = function (v, u, t) { b.plugins.registerPlugin(v, u, t) }; this.setPlayer = function (t, u) { g = t; this.renderingMode = u }; this.stateListener = function (t, u) { if (!s[t]) { s[t] = []; this.eventListener(b.api.events.JWPLAYER_PLAYER_STATE, f(t)) } s[t].push(u); return this }; this.detachMedia = function () { if (this.renderingMode == "html5") { return this.callInternal("jwDetachMedia") } }; this.attachMedia = function () { if (this.renderingMode == "html5") { return this.callInternal("jwAttachMedia") } }; function f(t) { return function (v) { var u = v.newstate, x = v.oldstate; if (u == t) { var w = s[u]; if (w) { for (var y = 0; y < w.length; y++) { if (typeof w[y] == "function") { w[y].call(this, { oldstate: x, newstate: u }) } } } } } } this.componentListener = function (t, u, v) { if (!p[t]) { p[t] = {} } if (!p[t][u]) { p[t][u] = []; this.eventListener(u, l(t, u)) } p[t][u].push(v); return this }; function l(t, u) { return function (w) { if (t == w.component) { var v = p[t][u]; if (v) { for (var x = 0; x < v.length; x++) { if (typeof v[x] == "function") { v[x].call(this, w) } } } } } } this.addInternalListener = function (t, u) { t.jwAddEventListener(u, 'function(dat) { jwplayer("' + this.id + '").dispatchEvent("' + u + '", dat); }') }; this.eventListener = function (t, u) { if (!m[t]) { m[t] = []; if (g && k) { this.addInternalListener(g, t) } } m[t].push(u); return this }; this.dispatchEvent = function (v) { if (m[v]) { var u = _utils.translateEventResponse(v, arguments[1]); for (var t = 0; t < m[v].length; t++) { if (typeof m[v][t] == "function") { m[v][t].call(this, u) } } } }; this.dispatchInstreamEvent = function (t) { if (q) { q.dispatchEvent(t, arguments) } }; this.callInternal = function () { if (k) { var v = arguments[0], t = []; for (var u = 1; u < arguments.length; u++) { t.push(arguments[u]) } if (typeof g != "undefined" && typeof g[v] == "function") { if (t.length == 2) { return (g[v])(t[0], t[1]) } else { if (t.length == 1) { return (g[v])(t[0]) } else { return (g[v])() } } } return null } else { h.push(arguments) } }; this.playerReady = function (u) { k = true; if (!g) { this.setPlayer(document.getElementById(u.id)) } this.container = document.getElementById(this.id); for (var t in m) { this.addInternalListener(g, t) } this.eventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM, function (v) { r = {} }); this.eventListener(b.api.events.JWPLAYER_MEDIA_META, function (v) { b.utils.extend(r, v.metadata) }); this.dispatchEvent(b.api.events.API_READY); while (h.length > 0) { this.callInternal.apply(this, h.shift()) } }; this.getItemMeta = function () { return r }; this.getCurrentItem = function () { return this.callInternal("jwGetPlaylistIndex") }; function n(v, x, w) { var t = []; if (!x) { x = 0 } if (!w) { w = v.length - 1 } for (var u = x; u <= w; u++) { t.push(v[u]) } return t } return this }; b.api.selectPlayer = function (d) { var c; if (!b.utils.exists(d)) { d = 0 } if (d.nodeType) { c = d } else { if (typeof d == "string") { c = document.getElementById(d) } } if (c) { var e = b.api.playerById(c.id); if (e) { return e } else { return b.api.addPlayer(new b.api(c)) } } else { if (typeof d == "number") { return b.getPlayers()[d] } } return null }; b.api.events = { API_READY: "jwplayerAPIReady", JWPLAYER_READY: "jwplayerReady", JWPLAYER_FULLSCREEN: "jwplayerFullscreen", JWPLAYER_RESIZE: "jwplayerResize", JWPLAYER_ERROR: "jwplayerError", JWPLAYER_MEDIA_BEFOREPLAY: "jwplayerMediaBeforePlay", JWPLAYER_MEDIA_BEFORECOMPLETE: "jwplayerMediaBeforeComplete", JWPLAYER_COMPONENT_SHOW: "jwplayerComponentShow", JWPLAYER_COMPONENT_HIDE: "jwplayerComponentHide", JWPLAYER_MEDIA_BUFFER: "jwplayerMediaBuffer", JWPLAYER_MEDIA_BUFFER_FULL: "jwplayerMediaBufferFull", JWPLAYER_MEDIA_ERROR: "jwplayerMediaError", JWPLAYER_MEDIA_LOADED: "jwplayerMediaLoaded", JWPLAYER_MEDIA_COMPLETE: "jwplayerMediaComplete", JWPLAYER_MEDIA_SEEK: "jwplayerMediaSeek", JWPLAYER_MEDIA_TIME: "jwplayerMediaTime", JWPLAYER_MEDIA_VOLUME: "jwplayerMediaVolume", JWPLAYER_MEDIA_META: "jwplayerMediaMeta", JWPLAYER_MEDIA_MUTE: "jwplayerMediaMute", JWPLAYER_PLAYER_STATE: "jwplayerPlayerState", JWPLAYER_PLAYLIST_LOADED: "jwplayerPlaylistLoaded", JWPLAYER_PLAYLIST_ITEM: "jwplayerPlaylistItem", JWPLAYER_INSTREAM_CLICK: "jwplayerInstreamClicked", JWPLAYER_INSTREAM_DESTROYED: "jwplayerInstreamDestroyed" }; b.api.events.state = { BUFFERING: "BUFFERING", IDLE: "IDLE", PAUSED: "PAUSED", PLAYING: "PLAYING" }; b.api.playerById = function (d) { for (var c = 0; c < a.length; c++) { if (a[c].id == d) { return a[c] } } return null }; b.api.addPlayer = function (c) { for (var d = 0; d < a.length; d++) { if (a[d] == c) { return c } } a.push(c); return c }; b.api.destroyPlayer = function (g, d) { var f = -1; for (var j = 0; j < a.length; j++) { if (a[j].id == g) { f = j; continue } } if (f >= 0) { var c = document.getElementById(a[f].id); if (document.getElementById(a[f].id + "_wrapper")) { c = document.getElementById(a[f].id + "_wrapper") } if (c) { if (d) { b.utils.setOuterHTML(c, d) } else { var h = document.createElement("div"); var e = c.id; if (c.id.indexOf("_wrapper") == c.id.length - 8) { newID = c.id.substring(0, c.id.length - 8) } h.setAttribute("id", e); c.parentNode.replaceChild(h, c) } } a.splice(f, 1) } return null }; b.getPlayers = function () { return a.slice(0) } })(jwplayer); var _userPlayerReady = (typeof playerReady == "function") ? playerReady : undefined; playerReady = function (b) { var a = jwplayer.api.playerById(b.id); if (a) { a.playerReady(b) } else { jwplayer.api.selectPlayer(b.id).playerReady(b) } if (_userPlayerReady) { _userPlayerReady.call(this, b) } }; (function (a) { a.api.instream = function (c, j, n, q) { var h = c; var b = j; var g = n; var k = q; var e = {}; var p = {}; function f() { h.callInternal("jwLoadInstream", n, q) } function m(r, s) { b.jwInstreamAddEventListener(s, 'function(dat) { jwplayer("' + h.id + '").dispatchInstreamEvent("' + s + '", dat); }') } function d(r, s) { if (!e[r]) { e[r] = []; m(b, r) } e[r].push(s); return this } function o(r, s) { if (!p[r]) { p[r] = []; d(a.api.events.JWPLAYER_PLAYER_STATE, l(r)) } p[r].push(s); return this } function l(r) { return function (t) { var s = t.newstate, v = t.oldstate; if (s == r) { var u = p[s]; if (u) { for (var w = 0; w < u.length; w++) { if (typeof u[w] == "function") { u[w].call(this, { oldstate: v, newstate: s, type: t.type }) } } } } } } this.dispatchEvent = function (u, t) { if (e[u]) { var s = _utils.translateEventResponse(u, t[1]); for (var r = 0; r < e[u].length; r++) { if (typeof e[u][r] == "function") { e[u][r].call(this, s) } } } }; this.onError = function (r) { return d(a.api.events.JWPLAYER_ERROR, r) }; this.onFullscreen = function (r) { return d(a.api.events.JWPLAYER_FULLSCREEN, r) }; this.onMeta = function (r) { return d(a.api.events.JWPLAYER_MEDIA_META, r) }; this.onMute = function (r) { return d(a.api.events.JWPLAYER_MEDIA_MUTE, r) }; this.onComplete = function (r) { return d(a.api.events.JWPLAYER_MEDIA_COMPLETE, r) }; this.onSeek = function (r) { return d(a.api.events.JWPLAYER_MEDIA_SEEK, r) }; this.onTime = function (r) { return d(a.api.events.JWPLAYER_MEDIA_TIME, r) }; this.onVolume = function (r) { return d(a.api.events.JWPLAYER_MEDIA_VOLUME, r) }; this.onBuffer = function (r) { return o(a.api.events.state.BUFFERING, r) }; this.onPause = function (r) { return o(a.api.events.state.PAUSED, r) }; this.onPlay = function (r) { return o(a.api.events.state.PLAYING, r) }; this.onIdle = function (r) { return o(a.api.events.state.IDLE, r) }; this.onInstreamClick = function (r) { return d(a.api.events.JWPLAYER_INSTREAM_CLICK, r) }; this.onInstreamDestroyed = function (r) { return d(a.api.events.JWPLAYER_INSTREAM_DESTROYED, r) }; this.play = function (r) { b.jwInstreamPlay(r) }; this.pause = function (r) { b.jwInstreamPause(r) }; this.seek = function (r) { b.jwInstreamSeek(r) }; this.destroy = function () { b.jwInstreamDestroy() }; this.getState = function () { return b.jwInstreamGetState() }; this.getDuration = function () { return b.jwInstreamGetDuration() }; this.getPosition = function () { return b.jwInstreamGetPosition() }; f() } })(jwplayer); (function (a) { var c = a.utils; a.embed = function (h) { var k = { width: 400, height: 300, components: { controlbar: { position: "over"}} }; var g = c.mediaparser.parseMedia(h.container); var f = new a.embed.config(c.extend(k, g, h.config), this); var j = a.plugins.loadPlugins(h.id, f.plugins); function d(n, m) { for (var l in m) { if (typeof n[l] == "function") { (n[l]).call(n, m[l]) } } } function e() { if (j.getStatus() == c.loaderstatus.COMPLETE) { for (var n = 0; n < f.modes.length; n++) { if (f.modes[n].type && a.embed[f.modes[n].type]) { var p = f.modes[n].config; var t = f; if (p) { t = c.extend(c.clone(f), p); var s = ["file", "levels", "playlist"]; for (var m = 0; m < s.length; m++) { var q = s[m]; if (c.exists(p[q])) { for (var l = 0; l < s.length; l++) { if (l != m) { var o = s[l]; if (c.exists(t[o]) && !c.exists(p[o])) { delete t[o] } } } } } } var r = new a.embed[f.modes[n].type](document.getElementById(h.id), f.modes[n], t, j, h); if (r.supportsConfig()) { r.embed(); d(h, f.events); return h } } } c.log("No suitable players found"); new a.embed.logo(c.extend({ hide: true }, f.components.logo), "none", h.id) } } j.addEventListener(a.events.COMPLETE, e); j.addEventListener(a.events.ERROR, e); j.load(); return h }; function b() { if (!document.body) { return setTimeout(b, 15) } var d = c.selectors.getElementsByTagAndClass("video", "jwplayer"); for (var e = 0; e < d.length; e++) { var f = d[e]; if (f.id == "") { f.id = "jwplayer_" + Math.round(Math.random() * 100000) } a(f.id).setup({}) } } b() })(jwplayer); (function (e) { var k = e.utils; function h(m) { var l = [{ type: "flash", src: m ? m : "/jwplayer/player.swf" }, { type: "html5" }, { type: "download"}]; if (k.isAndroid()) { l[0] = l.splice(1, 1, l[0])[0] } return l } var a = { players: "modes", autoplay: "autostart" }; function b(o) { var n = o.toLowerCase(); var m = ["left", "right", "top", "bottom"]; for (var l = 0; l < m.length; l++) { if (n == m[l]) { return true } } return false } function c(m) { var l = false; l = (m instanceof Array) || (typeof m == "object" && !m.position && !m.size); return l } function j(l) { if (typeof l == "string") { if (parseInt(l).toString() == l || l.toLowerCase().indexOf("px") > -1) { return parseInt(l) } } return l } var g = ["playlist", "dock", "controlbar", "logo", "display"]; function f(l) { var o = {}; switch (k.typeOf(l.plugins)) { case "object": for (var n in l.plugins) { o[k.getPluginName(n)] = n } break; case "string": var p = l.plugins.split(","); for (var m = 0; m < p.length; m++) { o[k.getPluginName(p[m])] = p[m] } break } return o } function d(p, o, n, l) { if (k.typeOf(p[o]) != "object") { p[o] = {} } var m = p[o][n]; if (k.typeOf(m) != "object") { p[o][n] = m = {} } if (l) { if (o == "plugins") { var q = k.getPluginName(n); m[l] = p[q + "." + l]; delete p[q + "." + l] } else { m[l] = p[n + "." + l]; delete p[n + "." + l] } } } e.embed.deserialize = function (m) { var n = f(m); for (var l in n) { d(m, "plugins", n[l]) } for (var q in m) { if (q.indexOf(".") > -1) { var p = q.split("."); var o = p[0]; var q = p[1]; if (k.isInArray(g, o)) { d(m, "components", o, q) } else { if (n[o]) { d(m, "plugins", n[o], q) } } } } return m }; e.embed.config = function (l, v) { var u = k.extend({}, l); var s; if (c(u.playlist)) { s = u.playlist; delete u.playlist } u = e.embed.deserialize(u); u.height = j(u.height); u.width = j(u.width); if (typeof u.plugins == "string") { var m = u.plugins.split(","); if (typeof u.plugins != "object") { u.plugins = {} } for (var q = 0; q < m.length; q++) { var r = k.getPluginName(m[q]); if (typeof u[r] == "object") { u.plugins[m[q]] = u[r]; delete u[r] } else { u.plugins[m[q]] = {} } } } for (var t = 0; t < g.length; t++) { var p = g[t]; if (k.exists(u[p])) { if (typeof u[p] != "object") { if (!u.components[p]) { u.components[p] = {} } if (p == "logo") { u.components[p].file = u[p] } else { u.components[p].position = u[p] } delete u[p] } else { if (!u.components[p]) { u.components[p] = {} } k.extend(u.components[p], u[p]); delete u[p] } } if (typeof u[p + "size"] != "undefined") { if (!u.components[p]) { u.components[p] = {} } u.components[p].size = u[p + "size"]; delete u[p + "size"] } } if (typeof u.icons != "undefined") { if (!u.components.display) { u.components.display = {} } u.components.display.icons = u.icons; delete u.icons } for (var o in a) { if (u[o]) { if (!u[a[o]]) { u[a[o]] = u[o] } delete u[o] } } var n; if (u.flashplayer && !u.modes) { n = h(u.flashplayer); delete u.flashplayer } else { if (u.modes) { if (typeof u.modes == "string") { n = h(u.modes) } else { if (u.modes instanceof Array) { n = u.modes } else { if (typeof u.modes == "object" && u.modes.type) { n = [u.modes] } } } delete u.modes } else { n = h() } } u.modes = n; if (s) { u.playlist = s } return u } })(jwplayer); (function (a) { a.embed.download = function (c, g, b, d, f) { this.embed = function () { var k = a.utils.extend({}, b); var q = {}; var j = b.width ? b.width : 480; if (typeof j != "number") { j = parseInt(j, 10) } var m = b.height ? b.height : 320; if (typeof m != "number") { m = parseInt(m, 10) } var u, o, n; var s = {}; if (b.playlist && b.playlist.length) { s.file = b.playlist[0].file; o = b.playlist[0].image; s.levels = b.playlist[0].levels } else { s.file = b.file; o = b.image; s.levels = b.levels } if (s.file) { u = s.file } else { if (s.levels && s.levels.length) { u = s.levels[0].file } } n = u ? "pointer" : "auto"; var l = { display: { style: { cursor: n, width: j, height: m, backgroundColor: "#000", position: "relative", textDecoration: "none", border: "none", display: "block"} }, display_icon: { style: { cursor: n, position: "absolute", display: u ? "block" : "none", top: 0, left: 0, border: 0, margin: 0, padding: 0, zIndex: 3, width: 50, height: 50, backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg==)"} }, display_iconBackground: { style: { cursor: n, position: "absolute", display: u ? "block" : "none", top: ((m - 50) / 2), left: ((j - 50) / 2), border: 0, width: 50, height: 50, margin: 0, padding: 0, zIndex: 2, backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC)"} }, display_image: { style: { width: j, height: m, display: o ? "block" : "none", position: "absolute", cursor: n, left: 0, top: 0, margin: 0, padding: 0, textDecoration: "none", zIndex: 1, border: "none"}} }; var h = function (v, x, y) { var w = document.createElement(v); if (y) { w.id = y } else { w.id = c.id + "_jwplayer_" + x } a.utils.css(w, l[x].style); return w }; q.display = h("a", "display", c.id); if (u) { q.display.setAttribute("href", a.utils.getAbsolutePath(u)) } q.display_image = h("img", "display_image"); q.display_image.setAttribute("alt", "Click to download..."); if (o) { q.display_image.setAttribute("src", a.utils.getAbsolutePath(o)) } if (true) { q.display_icon = h("div", "display_icon"); q.display_iconBackground = h("div", "display_iconBackground"); q.display.appendChild(q.display_image); q.display_iconBackground.appendChild(q.display_icon); q.display.appendChild(q.display_iconBackground) } _css = a.utils.css; _hide = function (v) { _css(v, { display: "none" }) }; function r(v) { _imageWidth = q.display_image.naturalWidth; _imageHeight = q.display_image.naturalHeight; t() } function t() { a.utils.stretch(a.utils.stretching.UNIFORM, q.display_image, j, m, _imageWidth, _imageHeight) } q.display_image.onerror = function (v) { _hide(q.display_image) }; q.display_image.onload = r; c.parentNode.replaceChild(q.display, c); var p = (b.plugins && b.plugins.logo) ? b.plugins.logo : {}; q.display.appendChild(new a.embed.logo(b.components.logo, "download", c.id)); f.container = document.getElementById(f.id); f.setPlayer(q.display, "download") }; this.supportsConfig = function () { if (b) { var j = a.utils.getFirstPlaylistItemFromConfig(b); if (typeof j.file == "undefined" && typeof j.levels == "undefined") { return true } else { if (j.file) { return e(j.file, j.provider, j.playlistfile) } else { if (j.levels && j.levels.length) { for (var h = 0; h < j.levels.length; h++) { if (j.levels[h].file && e(j.levels[h].file, j.provider, j.playlistfile)) { return true } } } } } } else { return true } }; function e(j, l, h) { if (h) { return false } var k = ["image", "sound", "youtube", "http"]; if (l && (k.toString().indexOf(l) > -1)) { return true } if (!l || (l && l == "video")) { var m = a.utils.extension(j); if (m && a.utils.extensionmap[m]) { return true } } return false } } })(jwplayer); (function (a) { a.embed.flash = function (f, g, l, e, j) { function m(o, n, p) { var q = document.createElement("param"); q.setAttribute("name", n); q.setAttribute("value", p); o.appendChild(q) } function k(o, p, n) { return function (q) { if (n) { document.getElementById(j.id + "_wrapper").appendChild(p) } var s = document.getElementById(j.id).getPluginConfig("display"); o.resize(s.width, s.height); var r = { left: s.x, top: s.y }; a.utils.css(p, r) } } function d(p) { if (!p) { return {} } var r = {}; for (var o in p) { var n = p[o]; for (var q in n) { r[o + "." + q] = n[q] } } return r } function h(q, p) { if (q[p]) { var s = q[p]; for (var o in s) { var n = s[o]; if (typeof n == "string") { if (!q[o]) { q[o] = n } } else { for (var r in n) { if (!q[o + "." + r]) { q[o + "." + r] = n[r] } } } } delete q[p] } } function b(q) { if (!q) { return {} } var t = {}, s = []; for (var n in q) { var p = a.utils.getPluginName(n); var o = q[n]; s.push(n); for (var r in o) { t[p + "." + r] = o[r] } } t.plugins = s.join(","); return t } function c(p) { var n = p.netstreambasepath ? "" : "netstreambasepath=" + encodeURIComponent(window.location.href.split("#")[0]) + "&"; for (var o in p) { if (typeof (p[o]) == "object") { n += o + "=" + encodeURIComponent("[[JSON]]" + a.utils.strings.jsonToString(p[o])) + "&" } else { n += o + "=" + encodeURIComponent(p[o]) + "&" } } return n.substring(0, n.length - 1) } this.embed = function () { l.id = j.id; var A; var r = a.utils.extend({}, l); var o = r.width; var y = r.height; if (f.id + "_wrapper" == f.parentNode.id) { A = document.getElementById(f.id + "_wrapper") } else { A = document.createElement("div"); A.id = f.id + "_wrapper"; a.utils.wrap(f, A); a.utils.css(A, { position: "relative", width: o, height: y }) } var p = e.setupPlugins(j, r, k); if (p.length > 0) { a.utils.extend(r, b(p.plugins)) } else { delete r.plugins } var s = ["height", "width", "modes", "events"]; for (var v = 0; v < s.length; v++) { delete r[s[v]] } var q = "opaque"; if (r.wmode) { q = r.wmode } h(r, "components"); h(r, "providers"); if (typeof r["dock.position"] != "undefined") { if (r["dock.position"].toString().toLowerCase() == "false") { r.dock = r["dock.position"]; delete r["dock.position"] } } var x = a.utils.getCookies(); for (var n in x) { if (typeof (r[n]) == "undefined") { r[n] = x[n] } } var z = "#000000"; var u; if (a.utils.isIE()) { var w = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" bgcolor="' + z + '" width="100%" height="100%" id="' + f.id + '" name="' + f.id + '" tabindex=0"">'; w += '<param name="movie" value="' + g.src + '">'; w += '<param name="allowfullscreen" value="true">'; w += '<param name="allowscriptaccess" value="always">'; w += '<param name="seamlesstabbing" value="true">'; w += '<param name="wmode" value="' + q + '">'; w += '<param name="flashvars" value="' + c(r) + '">'; w += "</object>"; a.utils.setOuterHTML(f, w); u = document.getElementById(f.id) } else { var t = document.createElement("object"); t.setAttribute("type", "application/x-shockwave-flash"); t.setAttribute("data", g.src); t.setAttribute("width", "100%"); t.setAttribute("height", "100%"); t.setAttribute("bgcolor", "#000000"); t.setAttribute("id", f.id); t.setAttribute("name", f.id); t.setAttribute("tabindex", 0); m(t, "allowfullscreen", "true"); m(t, "allowscriptaccess", "always"); m(t, "seamlesstabbing", "true"); m(t, "wmode", q); m(t, "flashvars", c(r)); f.parentNode.replaceChild(t, f); u = t } j.container = u; j.setPlayer(u, "flash") }; this.supportsConfig = function () { if (a.utils.hasFlash()) { if (l) { var o = a.utils.getFirstPlaylistItemFromConfig(l); if (typeof o.file == "undefined" && typeof o.levels == "undefined") { return true } else { if (o.file) { return flashCanPlay(o.file, o.provider) } else { if (o.levels && o.levels.length) { for (var n = 0; n < o.levels.length; n++) { if (o.levels[n].file && flashCanPlay(o.levels[n].file, o.provider)) { return true } } } } } } else { return true } } return false }; flashCanPlay = function (n, p) { var o = ["video", "http", "sound", "image"]; if (p && (o.toString().indexOf(p) < 0)) { return true } var q = a.utils.extension(n); if (!q) { return true } if (a.utils.exists(a.utils.extensionmap[q]) && !a.utils.exists(a.utils.extensionmap[q].flash)) { return false } return true } } })(jwplayer); (function (a) { a.embed.html5 = function (c, g, b, d, f) { function e(j, k, h) { return function (l) { var m = document.getElementById(c.id + "_displayarea"); if (h) { m.appendChild(k) } j.resize(m.clientWidth, m.clientHeight); k.left = m.style.left; k.top = m.style.top } } this.embed = function () { if (a.html5) { d.setupPlugins(f, b, e); c.innerHTML = ""; var j = a.utils.extend({ screencolor: "0x000000" }, b); var h = ["plugins", "modes", "events"]; for (var k = 0; k < h.length; k++) { delete j[h[k]] } if (j.levels && !j.sources) { j.sources = b.levels } if (j.skin && j.skin.toLowerCase().indexOf(".zip") > 0) { j.skin = j.skin.replace(/\.zip/i, ".xml") } var l = new (a.html5(c)).setup(j); f.container = document.getElementById(f.id); f.setPlayer(l, "html5") } else { return null } }; this.supportsConfig = function () { if (!!a.vid.canPlayType) { if (b) { var j = a.utils.getFirstPlaylistItemFromConfig(b); if (typeof j.file == "undefined" && typeof j.levels == "undefined") { return true } else { if (j.file) { return html5CanPlay(a.vid, j.file, j.provider, j.playlistfile) } else { if (j.levels && j.levels.length) { for (var h = 0; h < j.levels.length; h++) { if (j.levels[h].file && html5CanPlay(a.vid, j.levels[h].file, j.provider, j.playlistfile)) { return true } } } } } } else { return true } } return false }; html5CanPlay = function (k, j, l, h) { if (h) { return false } if (l && l == "youtube") { return true } if (l && l != "video" && l != "http" && l != "sound") { return false } if (navigator.userAgent.match(/BlackBerry/i) !== null) { return false } var m = a.utils.extension(j); if (!a.utils.exists(m) || !a.utils.exists(a.utils.extensionmap[m])) { return true } if (!a.utils.exists(a.utils.extensionmap[m].html5)) { return false } if (a.utils.isLegacyAndroid() && m.match(/m4v|mp4/)) { return true } return browserCanPlay(k, a.utils.extensionmap[m].html5) }; browserCanPlay = function (j, h) { if (!h) { return true } if (j.canPlayType(h)) { return true } else { if (h == "audio/mp3" && navigator.userAgent.match(/safari/i)) { return j.canPlayType("audio/mpeg") } else { return false } } } } })(jwplayer); (function (a) { a.embed.logo = function (m, l, d) { var j = { prefix: "http://l.longtailvideo.com/" + l + "/", file: "logo.png", link: "http://www.longtailvideo.com/players/jw-flv-player/", linktarget: "_top", margin: 8, out: 0.5, over: 1, timeout: 5, hide: false, position: "bottom-left" }; _css = a.utils.css; var b; var h; k(); function k() { o(); c(); f() } function o() { if (j.prefix) { var q = a.version.split(/\W/).splice(0, 2).join("/"); if (j.prefix.indexOf(q) < 0) { j.prefix += q + "/" } } h = a.utils.extend({}, j) } function p() { var s = { border: "none", textDecoration: "none", position: "absolute", cursor: "pointer", zIndex: 10 }; s.display = h.hide ? "none" : "block"; var r = h.position.toLowerCase().split("-"); for (var q in r) { s[r[q]] = h.margin } return s } function c() { b = document.createElement("img"); b.id = d + "_jwplayer_logo"; b.style.display = "none"; b.onload = function (q) { _css(b, p()); e() }; if (!h.file) { return } if (h.file.indexOf("http://") === 0) { b.src = h.file } else { b.src = h.prefix + h.file } } if (!h.file) { return } function f() { if (h.link) { b.onmouseover = g; b.onmouseout = e; b.onclick = n } else { this.mouseEnabled = false } } function n(q) { if (typeof q != "undefined") { q.preventDefault(); q.stopPropagation() } if (h.link) { window.open(h.link, h.linktarget) } return } function e(q) { if (h.link) { b.style.opacity = h.out } return } function g(q) { if (h.hide) { b.style.opacity = h.over } return } return b } })(jwplayer); (function (a) { a.html5 = function (b) { var c = b; this.setup = function (d) { a.utils.extend(this, new a.html5.api(c, d)); return this }; return this } })(jwplayer); (function (a) { var c = a.utils; var b = c.css; a.html5.view = function (v, u, g) { var A = v; var o = u; var C = g; var B; var h; var L; var w; var M; var s; var I; var t = false; var F, r; var x, f, e; function E() { B = document.createElement("div"); B.id = o.id; B.className = o.className; _videowrapper = document.createElement("div"); _videowrapper.id = B.id + "_video_wrapper"; o.id = B.id + "_video"; b(B, { position: "relative", height: C.height, width: C.width, padding: 0, backgroundColor: N(), zIndex: 0 }); function N() { if (A.skin.getComponentSettings("display") && A.skin.getComponentSettings("display").backgroundcolor) { return A.skin.getComponentSettings("display").backgroundcolor } return parseInt("000000", 16) } b(o, { width: "100%", height: "100%", top: 0, left: 0, zIndex: 1, margin: "auto", display: "block" }); b(_videowrapper, { overflow: "hidden", position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }); c.wrap(o, B); c.wrap(o, _videowrapper); w = document.createElement("div"); w.id = B.id + "_displayarea"; B.appendChild(w); _instreamArea = document.createElement("div"); _instreamArea.id = B.id + "_instreamarea"; b(_instreamArea, { overflow: "hidden", position: "absolute", top: 0, left: 0, bottom: 0, right: 0, zIndex: 100, background: "000000", display: "none" }); B.appendChild(_instreamArea) } function l() { for (var N = 0; N < C.plugins.order.length; N++) { var O = C.plugins.order[N]; if (c.exists(C.plugins.object[O].getDisplayElement)) { C.plugins.object[O].height = c.parseDimension(C.plugins.object[O].getDisplayElement().style.height); C.plugins.object[O].width = c.parseDimension(C.plugins.object[O].getDisplayElement().style.width); C.plugins.config[O].currentPosition = C.plugins.config[O].position } } z() } function n(N) { if (f) { return } if (C.getMedia() && C.getMedia().hasChrome()) { w.style.display = "none" } else { switch (N.newstate) { case N.newstate == a.api.events.state.PLAYING: w.style.display = "none"; break; default: w.style.display = "block"; break } } } function z(O) { var Q = C.getMedia() ? C.getMedia().getDisplayElement() : null; if (c.exists(Q)) { if (I != Q) { if (I && I.parentNode) { I.parentNode.replaceChild(Q, I) } I = Q } for (var N = 0; N < C.plugins.order.length; N++) { var P = C.plugins.order[N]; if (c.exists(C.plugins.object[P].getDisplayElement)) { C.plugins.config[P].currentPosition = C.plugins.config[P].position } } } k(C.width, C.height) } this.setup = function () { if (C && C.getMedia()) { o = C.getMedia().getDisplayElement() } E(); l(); A.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, n); A.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_LOADED, z); A.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_META, function (O) { D() }); var N; if (c.exists(window.onresize)) { N = window.onresize } window.onresize = function (O) { if (c.exists(N)) { try { N(O) } catch (Q) { } } if (A.jwGetFullscreen()) { if (!G()) { var P = c.getBoundingClientRect(document.body); C.width = Math.abs(P.left) + Math.abs(P.right); C.height = window.innerHeight; k(C.width, C.height) } } else { k(C.width, C.height) } } }; function j(N) { switch (N.keyCode) { case 27: if (A.jwGetFullscreen()) { A.jwSetFullscreen(false) } break; case 32: if (A.jwGetState() != a.api.events.state.IDLE && A.jwGetState() != a.api.events.state.PAUSED) { A.jwPause() } else { A.jwPlay() } break } } function k(N, W) { if (B.style.display == "none") { return } var Q = [].concat(C.plugins.order); Q.reverse(); M = Q.length + 2; if (G()) { try { if (C.fullscreen && !C.getMedia().getDisplayElement().webkitDisplayingFullscreen) { C.fullscreen = false } } catch (T) { } } if (!C.fullscreen) { h = N; L = W; if (typeof N == "string" && N.indexOf("%") > 0) { h = c.getElementWidth(c.parentNode(B)) * parseInt(N.replace("%"), "") / 100 } else { h = N } if (typeof W == "string" && W.indexOf("%") > 0) { L = c.getElementHeight(c.parentNode(B)) * parseInt(W.replace("%"), "") / 100 } else { L = W } var R = { top: 0, bottom: 0, left: 0, right: 0, width: h, height: L, position: "absolute" }; b(w, R); var X = {}; var U; try { U = C.plugins.object.display.getDisplayElement() } catch (T) { } if (U) { X.width = c.parseDimension(U.style.width); X.height = c.parseDimension(U.style.height) } var V = c.extend({}, R, X, { zIndex: _instreamArea.style.zIndex, display: _instreamArea.style.display }); b(_instreamArea, V); b(B, { height: L, width: h }); var S = q(y, Q); if (S.length > 0) { M += S.length; var P = S.indexOf("playlist"), O = S.indexOf("controlbar"); if (P >= 0 && O >= 0) { S[P] = S.splice(O, 1, S[P])[0] } q(m, S, true) } F = c.getElementWidth(w); r = c.getElementHeight(w) } else { if (!G()) { q(K, Q, true) } } D() } function q(U, Q, R) { var S = []; for (var P = 0; P < Q.length; P++) { var T = Q[P]; if (c.exists(C.plugins.object[T].getDisplayElement)) { if (C.plugins.config[T].currentPosition != a.html5.view.positions.NONE) { var N = U(T, M--); if (!N) { S.push(T) } else { var O = N.width; var V = N.height; if (R) { delete N.width; delete N.height } b(C.plugins.object[T].getDisplayElement(), N); C.plugins.object[T].resize(O, V) } } else { b(C.plugins.object[T].getDisplayElement(), { display: "none" }) } } } return S } function y(O, P) { if (c.exists(C.plugins.object[O].getDisplayElement)) { if (C.plugins.config[O].position && H(C.plugins.config[O].position)) { if (!c.exists(C.plugins.object[O].getDisplayElement().parentNode)) { B.appendChild(C.plugins.object[O].getDisplayElement()) } var N = d(O); N.zIndex = P; return N } } return false } function m(N, O) { if (!c.exists(C.plugins.object[N].getDisplayElement().parentNode)) { w.appendChild(C.plugins.object[N].getDisplayElement()) } return { position: "absolute", width: (c.getElementWidth(w) - c.parseDimension(w.style.left) - c.parseDimension(w.style.right)), height: (c.getElementHeight(w) - c.parseDimension(w.style.top) - c.parseDimension(w.style.bottom)), zIndex: O} } function K(N, O) { return { position: "fixed", width: C.width, height: C.height, zIndex: O} } var D = this.resizeMedia = function () { w.style.position = "absolute"; var P = C.getMedia() ? C.getMedia().getDisplayElement() : e; if (!P) { return } if (P && P.tagName.toLowerCase() == "video") { if (!P.videoWidth || !P.videoHeight) { return } P.style.position = "absolute"; c.fadeTo(P, 1, 0.25); if (P.parentNode) { P.parentNode.style.left = w.style.left; P.parentNode.style.top = w.style.top } if (C.fullscreen && A.jwGetStretching() == a.utils.stretching.EXACTFIT && !c.isMobile()) { var N = document.createElement("div"); c.stretch(a.utils.stretching.UNIFORM, N, c.getElementWidth(w), c.getElementHeight(w), F, r); c.stretch(a.utils.stretching.EXACTFIT, P, c.parseDimension(N.style.width), c.parseDimension(N.style.height), P.videoWidth ? P.videoWidth : 400, P.videoHeight ? P.videoHeight : 300); b(P, { left: N.style.left, top: N.style.top }) } else { c.stretch(A.jwGetStretching(), P, c.getElementWidth(w), c.getElementHeight(w), P.videoWidth ? P.videoWidth : 400, P.videoHeight ? P.videoHeight : 300) } } else { var O = C.plugins.object.display.getDisplayElement(); if (O) { C.getMedia().resize(c.parseDimension(O.style.width), c.parseDimension(O.style.height)) } else { C.getMedia().resize(c.parseDimension(w.style.width), c.parseDimension(w.style.height)) } } }; var d = this.getComponentPosition = function (O) { var P = { position: "absolute", margin: 0, padding: 0, top: null }; var N = C.plugins.config[O].currentPosition.toLowerCase(); switch (N.toUpperCase()) { case a.html5.view.positions.TOP: P.top = c.parseDimension(w.style.top); P.left = c.parseDimension(w.style.left); P.width = c.getElementWidth(w) - c.parseDimension(w.style.left) - c.parseDimension(w.style.right); P.height = C.plugins.object[O].height; w.style[N] = c.parseDimension(w.style[N]) + C.plugins.object[O].height + "px"; w.style.height = c.getElementHeight(w) - P.height + "px"; break; case a.html5.view.positions.RIGHT: P.top = c.parseDimension(w.style.top); P.right = c.parseDimension(w.style.right); P.width = C.plugins.object[O].width; P.height = c.getElementHeight(w) - c.parseDimension(w.style.top) - c.parseDimension(w.style.bottom); w.style.width = c.getElementWidth(w) - P.width + "px"; break; case a.html5.view.positions.BOTTOM: P.bottom = c.parseDimension(w.style.bottom); P.left = c.parseDimension(w.style.left); P.width = c.getElementWidth(w) - c.parseDimension(w.style.left) - c.parseDimension(w.style.right); P.height = C.plugins.object[O].height; w.style.height = c.getElementHeight(w) - P.height + "px"; break; case a.html5.view.positions.LEFT: P.top = c.parseDimension(w.style.top); P.left = c.parseDimension(w.style.left); P.width = C.plugins.object[O].width; P.height = c.getElementHeight(w) - c.parseDimension(w.style.top) - c.parseDimension(w.style.bottom); w.style[N] = c.parseDimension(w.style[N]) + C.plugins.object[O].width + "px"; w.style.width = c.getElementWidth(w) - P.width + "px"; break; default: break } return P }; this.resize = k; var p; this.fullscreen = function (Q) { var S; try { S = C.getMedia().getDisplayElement() } catch (R) { } if (G() && S && S.webkitSupportsFullscreen) { if (Q && !S.webkitDisplayingFullscreen) { try { c.transform(S); p = w.style.display; w.style.display = "none"; S.webkitEnterFullscreen() } catch (P) { } } else { if (!Q) { D(); if (S.webkitDisplayingFullscreen) { try { S.webkitExitFullscreen() } catch (P) { } } w.style.display = p } } t = false } else { if (Q) { document.onkeydown = j; clearInterval(s); var O = c.getBoundingClientRect(document.body); C.width = Math.abs(O.left) + Math.abs(O.right); C.height = window.innerHeight; var N = { position: "fixed", width: "100%", height: "100%", top: 0, left: 0, zIndex: 2147483000 }; b(B, N); N.zIndex = 1; if (C.getMedia() && C.getMedia().getDisplayElement()) { b(C.getMedia().getDisplayElement(), N) } N.zIndex = 2; b(w, N); t = true } else { document.onkeydown = ""; C.width = h; C.height = L; b(B, { position: "relative", height: C.height, width: C.width, zIndex: 0 }); t = false } k(C.width, C.height) } }; function H(N) { return ([a.html5.view.positions.TOP, a.html5.view.positions.RIGHT, a.html5.view.positions.BOTTOM, a.html5.view.positions.LEFT].toString().indexOf(N.toUpperCase()) > -1) } function G() { if (A.jwGetState() != a.api.events.state.IDLE && !t && (C.getMedia() && C.getMedia().getDisplayElement() && C.getMedia().getDisplayElement().webkitSupportsFullscreen) && c.useNativeFullscreen()) { return true } return false } this.setupInstream = function (N, O) { c.css(_instreamArea, { display: "block", position: "absolute" }); w.style.display = "none"; _instreamArea.appendChild(N); e = O; f = true }; var J = this.destroyInstream = function () { _instreamArea.style.display = "none"; _instreamArea.innerHTML = ""; w.style.display = "block"; e = null; f = false; k(C.width, C.height) } }; a.html5.view.positions = { TOP: "TOP", RIGHT: "RIGHT", BOTTOM: "BOTTOM", LEFT: "LEFT", OVER: "OVER", NONE: "NONE"} })(jwplayer); (function (a) { var b = { backgroundcolor: "", margin: 10, font: "Arial,sans-serif", fontsize: 10, fontcolor: parseInt("000000", 16), fontstyle: "normal", fontweight: "bold", buttoncolor: parseInt("ffffff", 16), position: a.html5.view.positions.BOTTOM, idlehide: false, hideplaylistcontrols: false, forcenextprev: false, layout: { left: { position: "left", elements: [{ name: "play", type: "button" }, { name: "divider", type: "divider" }, { name: "prev", type: "button" }, { name: "divider", type: "divider" }, { name: "next", type: "button" }, { name: "divider", type: "divider" }, { name: "elapsed", type: "text"}] }, center: { position: "center", elements: [{ name: "time", type: "slider"}] }, right: { position: "right", elements: [{ name: "duration", type: "text" }, { name: "blank", type: "button" }, { name: "divider", type: "divider" }, { name: "mute", type: "button" }, { name: "volume", type: "slider" }, { name: "divider", type: "divider" }, { name: "fullscreen", type: "button"}]}} }; _utils = a.utils; _css = _utils.css; _hide = function (c) { _css(c, { display: "none" }) }; _show = function (c) { _css(c, { display: "block" }) }; a.html5.controlbar = function (m, X) { window.controlbar = this; var l = m; var D = _utils.extend({}, b, l.skin.getComponentSettings("controlbar"), X); if (D.position == a.html5.view.positions.NONE || typeof a.html5.view.positions[D.position] == "undefined") { return } if (_utils.mapLength(l.skin.getComponentLayout("controlbar")) > 0) { D.layout = l.skin.getComponentLayout("controlbar") } var af; var Q; var ae; var E; var w = "none"; var h; var k; var ag; var g; var f; var z; var R = {}; var q = false; var c = {}; var ab; var j = false; var p; var d; var U = false; var G = false; var H; var Z = new a.html5.eventdispatcher(); _utils.extend(this, Z); function K() { if (!ab) { ab = l.skin.getSkinElement("controlbar", "background"); if (!ab) { ab = { width: 0, height: 0, src: null} } } return ab } function O() { ae = 0; E = 0; Q = 0; if (!q) { var ao = { height: K().height, backgroundColor: D.backgroundcolor }; af = document.createElement("div"); af.id = l.id + "_jwplayer_controlbar"; _css(af, ao) } var an = (l.skin.getSkinElement("controlbar", "capLeft")); var am = (l.skin.getSkinElement("controlbar", "capRight")); if (an) { y("capLeft", "left", false, af) } ac("background", af, { position: "absolute", height: K().height, left: (an ? an.width : 0), zIndex: 0 }, "img"); if (K().src) { R.background.src = K().src } ac("elements", af, { position: "relative", height: K().height, zIndex: 1 }); if (am) { y("capRight", "right", false, af) } } this.getDisplayElement = function () { return af }; this.resize = function (ao, am) { S(); _utils.cancelAnimation(af); f = ao; z = am; if (G != l.jwGetFullscreen()) { G = l.jwGetFullscreen(); if (!G) { Y() } d = undefined } var an = x(); J({ id: l.id, duration: ag, position: k }); v({ id: l.id, bufferPercent: g }); return an }; this.show = function () { if (j) { j = false; _show(af); V() } }; this.hide = function () { if (!j) { j = true; _hide(af); ad() } }; function r() { var an = ["timeSlider", "volumeSlider", "timeSliderRail", "volumeSliderRail"]; for (var ao in an) { var am = an[ao]; if (typeof R[am] != "undefined") { c[am] = _utils.getBoundingClientRect(R[am]) } } } var e; function Y(am) { if (j) { return } clearTimeout(p); if (D.position == a.html5.view.positions.OVER || l.jwGetFullscreen()) { switch (l.jwGetState()) { case a.api.events.state.PAUSED: case a.api.events.state.IDLE: if (af && af.style.opacity < 1 && (!D.idlehide || _utils.exists(am))) { e = false; setTimeout(function () { if (!e) { W() } }, 100) } if (D.idlehide) { p = setTimeout(function () { A() }, 2000) } break; default: e = true; if (am) { W() } p = setTimeout(function () { A() }, 2000); break } } else { W() } } function A() { if (!j) { ad(); if (af.style.opacity == 1) { _utils.cancelAnimation(af); _utils.fadeTo(af, 0, 0.1, 1, 0) } } } function W() { if (!j) { V(); if (af.style.opacity == 0) { _utils.cancelAnimation(af); _utils.fadeTo(af, 1, 0.1, 0, 0) } } } function I(am) { return function () { if (U && d != am) { d = am; Z.sendEvent(am, { component: "controlbar", boundingRect: P() }) } } } var V = I(a.api.events.JWPLAYER_COMPONENT_SHOW); var ad = I(a.api.events.JWPLAYER_COMPONENT_HIDE); function P() { if (D.position == a.html5.view.positions.OVER || l.jwGetFullscreen()) { return _utils.getDimensions(af) } else { return { x: 0, y: 0, width: 0, height: 0} } } function ac(aq, ap, ao, am) { var an; if (!q) { if (!am) { am = "div" } an = document.createElement(am); R[aq] = an; an.id = af.id + "_" + aq; ap.appendChild(an) } else { an = document.getElementById(af.id + "_" + aq) } if (_utils.exists(ao)) { _css(an, ao) } return an } function N() { if (l.jwGetHeight() <= 40) { D.layout = _utils.clone(D.layout); for (var am = 0; am < D.layout.left.elements.length; am++) { if (D.layout.left.elements[am].name == "fullscreen") { D.layout.left.elements.splice(am, 1) } } for (am = 0; am < D.layout.right.elements.length; am++) { if (D.layout.right.elements[am].name == "fullscreen") { D.layout.right.elements.splice(am, 1) } } o() } al(D.layout.left); al(D.layout.center); al(D.layout.right) } function al(ap, am) { var aq = ap.position == "right" ? "right" : "left"; var ao = _utils.extend([], ap.elements); if (_utils.exists(am)) { ao.reverse() } var ap = ac(ap.position + "Group", R.elements, { "float": "left", styleFloat: "left", cssFloat: "left", height: "100%" }); for (var an = 0; an < ao.length; an++) { C(ao[an], aq, ap) } } function L() { return Q++ } function C(aq, at, av) { var ap, an, ao, am, aw; if (!av) { av = R.elements } if (aq.type == "divider") { y("divider" + L(), at, true, av, undefined, aq.width, aq.element); return } switch (aq.name) { case "play": y("playButton", at, false, av); y("pauseButton", at, true, av); T("playButton", "jwPlay"); T("pauseButton", "jwPause"); break; case "prev": y("prevButton", at, true, av); T("prevButton", "jwPlaylistPrev"); break; case "stop": y("stopButton", at, true, av); T("stopButton", "jwStop"); break; case "next": y("nextButton", at, true, av); T("nextButton", "jwPlaylistNext"); break; case "elapsed": y("elapsedText", at, true, av, null, null, l.skin.getSkinElement("controlbar", "elapsedBackground")); break; case "time": an = !_utils.exists(l.skin.getSkinElement("controlbar", "timeSliderCapLeft")) ? 0 : l.skin.getSkinElement("controlbar", "timeSliderCapLeft").width; ao = !_utils.exists(l.skin.getSkinElement("controlbar", "timeSliderCapRight")) ? 0 : l.skin.getSkinElement("controlbar", "timeSliderCapRight").width; ap = at == "left" ? an : ao; aw = { height: K().height, position: "relative", "float": "left", styleFloat: "left", cssFloat: "left" }; var ar = ac("timeSlider", av, aw); y("timeSliderCapLeft", at, true, ar, "relative"); y("timeSliderRail", at, false, ar, "relative"); y("timeSliderBuffer", at, false, ar, "absolute"); y("timeSliderProgress", at, false, ar, "absolute"); y("timeSliderThumb", at, false, ar, "absolute"); y("timeSliderCapRight", at, true, ar, "relative"); aa("time"); break; case "fullscreen": y("fullscreenButton", at, false, av); y("normalscreenButton", at, true, av); T("fullscreenButton", "jwSetFullscreen", true); T("normalscreenButton", "jwSetFullscreen", false); break; case "volume": an = !_utils.exists(l.skin.getSkinElement("controlbar", "volumeSliderCapLeft")) ? 0 : l.skin.getSkinElement("controlbar", "volumeSliderCapLeft").width; ao = !_utils.exists(l.skin.getSkinElement("controlbar", "volumeSliderCapRight")) ? 0 : l.skin.getSkinElement("controlbar", "volumeSliderCapRight").width; ap = at == "left" ? an : ao; am = l.skin.getSkinElement("controlbar", "volumeSliderRail").width + an + ao; aw = { height: K().height, position: "relative", width: am, "float": "left", styleFloat: "left", cssFloat: "left" }; var au = ac("volumeSlider", av, aw); y("volumeSliderCapLeft", at, false, au, "relative"); y("volumeSliderRail", at, false, au, "relative"); y("volumeSliderProgress", at, false, au, "absolute"); y("volumeSliderThumb", at, false, au, "absolute"); y("volumeSliderCapRight", at, false, au, "relative"); aa("volume"); break; case "mute": y("muteButton", at, false, av); y("unmuteButton", at, true, av); T("muteButton", "jwSetMute", true); T("unmuteButton", "jwSetMute", false); break; case "duration": y("durationText", at, true, av, null, null, l.skin.getSkinElement("controlbar", "durationBackground")); break } } function y(ap, at, an, aw, aq, am, ao) { if (_utils.exists(l.skin.getSkinElement("controlbar", ap)) || ap.indexOf("Text") > 0 || ap.indexOf("divider") === 0) { var ar = { height: "100%", position: aq ? aq : "relative", display: "block", "float": "left", styleFloat: "left", cssFloat: "left" }; if ((ap.indexOf("next") === 0 || ap.indexOf("prev") === 0) && (l.jwGetPlaylist().length < 2 || D.hideplaylistcontrols.toString() == "true")) { if (D.forcenextprev.toString() != "true") { an = false; ar.display = "none" } } var ax; if (ap.indexOf("Text") > 0) { ap.innerhtml = "00:00"; ar.font = D.fontsize + "px/" + (K().height + 1) + "px " + D.font; ar.color = D.fontcolor; ar.textAlign = "center"; ar.fontWeight = D.fontweight; ar.fontStyle = D.fontstyle; ar.cursor = "default"; if (ao) { ar.background = "url(" + ao.src + ") no-repeat center"; ar.backgroundSize = "100% " + K().height + "px" } ar.padding = "0 5px" } else { if (ap.indexOf("divider") === 0) { if (am) { if (!isNaN(parseInt(am))) { ax = parseInt(am) } } else { if (ao) { var au = l.skin.getSkinElement("controlbar", ao); if (au) { ar.background = "url(" + au.src + ") repeat-x center left"; ax = au.width } } else { ar.background = "url(" + l.skin.getSkinElement("controlbar", "divider").src + ") repeat-x center left"; ax = l.skin.getSkinElement("controlbar", "divider").width } } } else { ar.background = "url(" + l.skin.getSkinElement("controlbar", ap).src + ") repeat-x center left"; ax = l.skin.getSkinElement("controlbar", ap).width } } if (at == "left") { if (an) { ae += ax } } else { if (at == "right") { if (an) { E += ax } } } if (_utils.typeOf(aw) == "undefined") { aw = R.elements } ar.width = ax; if (q) { _css(R[ap], ar) } else { var av = ac(ap, aw, ar); if (_utils.exists(l.skin.getSkinElement("controlbar", ap + "Over"))) { av.onmouseover = function (ay) { av.style.backgroundImage = ["url(", l.skin.getSkinElement("controlbar", ap + "Over").src, ")"].join("") }; av.onmouseout = function (ay) { av.style.backgroundImage = ["url(", l.skin.getSkinElement("controlbar", ap).src, ")"].join("") } } if (ap.indexOf("divider") == 0) { av.setAttribute("class", "divider") } av.innerHTML = "&nbsp;" } } } function F() { l.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, B); l.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, t); l.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER, v); l.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, s); l.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_TIME, J); l.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE, ak); l.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_VOLUME, n); l.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, M) } function B() { if (!D.hideplaylistcontrols) { if (l.jwGetPlaylist().length > 1 || D.forcenextprev.toString() == "true") { _show(R.nextButton); _show(R.prevButton) } else { _hide(R.nextButton); _hide(R.prevButton) } x(); ah() } } function t(am) { ag = l.jwGetPlaylist()[am.index].duration; J({ id: l.id, duration: ag, position: 0 }); v({ id: l.id, bufferProgress: 0 }) } function ah() { J({ id: l.id, duration: l.jwGetDuration(), position: 0 }); v({ id: l.id, bufferProgress: 0 }); ak({ id: l.id, mute: l.jwGetMute() }); s({ id: l.id, newstate: a.api.events.state.IDLE }); n({ id: l.id, volume: l.jwGetVolume() }) } function T(ao, ap, an) { if (q) { return } if (_utils.exists(l.skin.getSkinElement("controlbar", ao))) { var am = R[ao]; if (_utils.exists(am)) { _css(am, { cursor: "pointer" }); if (ap == "fullscreen") { am.onmouseup = function (aq) { aq.stopPropagation(); l.jwSetFullscreen(!l.jwGetFullscreen()) } } else { am.onmouseup = function (aq) { aq.stopPropagation(); if (_utils.exists(an)) { l[ap](an) } else { l[ap]() } } } } } } function aa(am) { if (q) { return } var an = R[am + "Slider"]; _css(R.elements, { cursor: "pointer" }); _css(an, { cursor: "pointer" }); an.onmousedown = function (ao) { w = am }; an.onmouseup = function (ao) { ao.stopPropagation(); aj(ao.pageX) }; an.onmousemove = function (ao) { if (w == "time") { h = true; var ap = ao.pageX - c[am + "Slider"].left - window.pageXOffset; _css(R[w + "SliderThumb"], { left: ap }) } } } function aj(an) { h = false; var am; if (w == "time") { am = an - c.timeSliderRail.left + window.pageXOffset; var ap = am / c.timeSliderRail.width * ag; if (ap < 0) { ap = 0 } else { if (ap > ag) { ap = ag - 3 } } if (l.jwGetState() == a.api.events.state.PAUSED || l.jwGetState() == a.api.events.state.IDLE) { l.jwPlay() } l.jwSeek(ap) } else { if (w == "volume") { am = an - c.volumeSliderRail.left - window.pageXOffset; var ao = Math.round(am / c.volumeSliderRail.width * 100); if (ao < 10) { ao = 0 } else { if (ao > 100) { ao = 100 } } if (l.jwGetMute()) { l.jwSetMute(false) } l.jwSetVolume(ao) } } w = "none" } function v(an) { if (_utils.exists(an.bufferPercent)) { g = an.bufferPercent } if (c.timeSliderRail) { var ap = l.skin.getSkinElement("controlbar", "timeSliderCapLeft"); var ao = c.timeSliderRail.width; var am = isNaN(Math.round(ao * g / 100)) ? 0 : Math.round(ao * g / 100); _css(R.timeSliderBuffer, { width: am, left: ap ? ap.width : 0 }) } } function ak(am) { if (am.mute) { _hide(R.muteButton); _show(R.unmuteButton); _hide(R.volumeSliderProgress) } else { _show(R.muteButton); _hide(R.unmuteButton); _show(R.volumeSliderProgress) } } function s(am) { if (am.newstate == a.api.events.state.BUFFERING || am.newstate == a.api.events.state.PLAYING) { _show(R.pauseButton); _hide(R.playButton) } else { _hide(R.pauseButton); _show(R.playButton) } Y(); if (am.newstate == a.api.events.state.IDLE) { _hide(R.timeSliderBuffer); _hide(R.timeSliderProgress); _hide(R.timeSliderThumb); J({ id: l.id, duration: l.jwGetDuration(), position: 0 }) } else { _show(R.timeSliderBuffer); if (am.newstate != a.api.events.state.BUFFERING) { _show(R.timeSliderProgress); _show(R.timeSliderThumb) } } } function M(am) { v({ bufferPercent: 0 }); J(_utils.extend(am, { position: 0, duration: ag })) } function J(aq) { if (_utils.exists(aq.position)) { k = aq.position } var am = false; if (_utils.exists(aq.duration) && aq.duration != ag) { ag = aq.duration; am = true } var ao = (k === ag === 0) ? 0 : k / ag; var at = c.timeSliderRail; if (at) { var an = isNaN(Math.round(at.width * ao)) ? 0 : Math.round(at.width * ao); var ar = l.skin.getSkinElement("controlbar", "timeSliderCapLeft"); var ap = an + (ar ? ar.width : 0); if (R.timeSliderProgress) { _css(R.timeSliderProgress, { width: an, left: ar ? ar.width : 0 }); if (!h) { if (R.timeSliderThumb) { R.timeSliderThumb.style.left = ap + "px" } } } } if (R.durationText) { R.durationText.innerHTML = _utils.timeFormat(ag) } if (R.elapsedText) { R.elapsedText.innerHTML = _utils.timeFormat(k) } if (am) { x() } } function o() { var am = R.elements.childNodes; var ar, ap; for (var ao = 0; ao < am.length; ao++) { var aq = am[ao].childNodes; for (var an in aq) { if (isNaN(parseInt(an, 10))) { continue } if (aq[an].id.indexOf(af.id + "_divider") === 0 && ap && ap.id.indexOf(af.id + "_divider") === 0 && aq[an].style.backgroundImage == ap.style.backgroundImage) { aq[an].style.display = "none" } else { if (aq[an].id.indexOf(af.id + "_divider") === 0 && ar && ar.style.display != "none") { aq[an].style.display = "block" } } if (aq[an].style.display != "none") { ap = aq[an] } ar = aq[an] } } } function ai() { if (l.jwGetFullscreen()) { _show(R.normalscreenButton); _hide(R.fullscreenButton) } else { _hide(R.normalscreenButton); _show(R.fullscreenButton) } if (l.jwGetState() == a.api.events.state.BUFFERING || l.jwGetState() == a.api.events.state.PLAYING) { _show(R.pauseButton); _hide(R.playButton) } else { _hide(R.pauseButton); _show(R.playButton) } if (l.jwGetMute() == true) { _hide(R.muteButton); _show(R.unmuteButton); _hide(R.volumeSliderProgress) } else { _show(R.muteButton); _hide(R.unmuteButton); _show(R.volumeSliderProgress) } } function x() { o(); ai(); var ao = { width: f }; var aw = { "float": "left", styleFloat: "left", cssFloat: "left" }; if (D.position == a.html5.view.positions.OVER || l.jwGetFullscreen()) { ao.left = D.margin; ao.width -= 2 * D.margin; ao.top = z - K().height - D.margin; ao.height = K().height } var aq = l.skin.getSkinElement("controlbar", "capLeft"); var au = l.skin.getSkinElement("controlbar", "capRight"); aw.width = ao.width - (aq ? aq.width : 0) - (au ? au.width : 0); var ap = _utils.getBoundingClientRect(R.leftGroup).width; var at = _utils.getBoundingClientRect(R.rightGroup).width; var ar = aw.width - ap - at - 1; var an = ar; var am = l.skin.getSkinElement("controlbar", "timeSliderCapLeft"); var av = l.skin.getSkinElement("controlbar", "timeSliderCapRight"); if (_utils.exists(am)) { an -= am.width } if (_utils.exists(av)) { an -= av.width } R.timeSlider.style.width = ar + "px"; R.timeSliderRail.style.width = an + "px"; _css(af, ao); _css(R.elements, aw); _css(R.background, aw); r(); return ao } function n(ar) { if (_utils.exists(R.volumeSliderRail)) { var ao = isNaN(ar.volume / 100) ? 1 : ar.volume / 100; var ap = _utils.parseDimension(R.volumeSliderRail.style.width); var am = isNaN(Math.round(ap * ao)) ? 0 : Math.round(ap * ao); var at = _utils.parseDimension(R.volumeSliderRail.style.right); var an = (!_utils.exists(l.skin.getSkinElement("controlbar", "volumeSliderCapLeft"))) ? 0 : l.skin.getSkinElement("controlbar", "volumeSliderCapLeft").width; _css(R.volumeSliderProgress, { width: am, left: an }); if (R.volumeSliderThumb) { var aq = (am - Math.round(_utils.parseDimension(R.volumeSliderThumb.style.width) / 2)); aq = Math.min(Math.max(aq, 0), ap - _utils.parseDimension(R.volumeSliderThumb.style.width)); _css(R.volumeSliderThumb, { left: aq }) } if (_utils.exists(R.volumeSliderCapLeft)) { _css(R.volumeSliderCapLeft, { left: 0 }) } } } function S() { try { var an = (l.id.indexOf("_instream") > 0 ? l.id.replace("_instream", "") : l.id); H = document.getElementById(an); H.addEventListener("mousemove", Y) } catch (am) { _utils.log("Could not add mouse listeners to controlbar: " + am) } } function u() { O(); N(); r(); q = true; F(); D.idlehide = (D.idlehide.toString().toLowerCase() == "true"); if (D.position == a.html5.view.positions.OVER && D.idlehide) { af.style.opacity = 0; U = true } else { af.style.opacity = 1; setTimeout((function () { U = true; V() }), 1) } S(); ah() } u(); return this } })(jwplayer); (function (b) { var a = ["width", "height", "state", "playlist", "item", "position", "buffer", "duration", "volume", "mute", "fullscreen"]; var c = b.utils; b.html5.controller = function (o, K, f, h) { var n = o, m = f, j = h, y = K, M = true, G = -1, A = false, d = false, P, C = [], q = false; var D = (c.exists(m.config.debug) && (m.config.debug.toString().toLowerCase() == "console")), N = new b.html5.eventdispatcher(y.id, D); c.extend(this, N); function L(T) { if (q) { N.sendEvent(T.type, T) } else { C.push(T) } } function s(T) { if (!q) { q = true; N.sendEvent(b.api.events.JWPLAYER_READY, T); if (b.utils.exists(window.playerReady)) { playerReady(T) } if (b.utils.exists(window[f.config.playerReady])) { window[f.config.playerReady](T) } while (C.length > 0) { var V = C.shift(); N.sendEvent(V.type, V) } if (f.config.autostart && !b.utils.isIOS()) { O() } while (x.length > 0) { var U = x.shift(); B(U.method, U.arguments) } } } m.addGlobalListener(L); m.addEventListener(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL, function () { m.getMedia().play() }); m.addEventListener(b.api.events.JWPLAYER_MEDIA_TIME, function (T) { if (T.position >= m.playlist[m.item].start && G >= 0) { m.playlist[m.item].start = G; G = -1 } }); m.addEventListener(b.api.events.JWPLAYER_MEDIA_COMPLETE, function (T) { setTimeout(E, 25) }); m.addEventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED, O); m.addEventListener(b.api.events.JWPLAYER_FULLSCREEN, p); function F() { try { P = F; if (!A) { A = true; N.sendEvent(b.api.events.JWPLAYER_MEDIA_BEFOREPLAY); A = false; if (d) { d = false; P = null; return } } v(m.item); if (m.playlist[m.item].levels[0].file.length > 0) { if (M || m.state == b.api.events.state.IDLE) { m.getMedia().load(m.playlist[m.item]); M = false } else { if (m.state == b.api.events.state.PAUSED) { m.getMedia().play() } } } return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T); P = null } return false } function e() { try { if (m.playlist[m.item].levels[0].file.length > 0) { switch (m.state) { case b.api.events.state.PLAYING: case b.api.events.state.BUFFERING: if (m.getMedia()) { m.getMedia().pause() } break; default: if (A) { d = true } } } return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function z(T) { try { if (m.playlist[m.item].levels[0].file.length > 0) { if (typeof T != "number") { T = parseFloat(T) } switch (m.state) { case b.api.events.state.IDLE: if (G < 0) { G = m.playlist[m.item].start; m.playlist[m.item].start = T } if (!A) { F() } break; case b.api.events.state.PLAYING: case b.api.events.state.PAUSED: case b.api.events.state.BUFFERING: m.seek(T); break } } return true } catch (U) { N.sendEvent(b.api.events.JWPLAYER_ERROR, U) } return false } function w(T) { P = null; if (!c.exists(T)) { T = true } try { if ((m.state != b.api.events.state.IDLE || T) && m.getMedia()) { m.getMedia().stop(T) } if (A) { d = true } return true } catch (U) { N.sendEvent(b.api.events.JWPLAYER_ERROR, U) } return false } function k() { try { if (m.playlist[m.item].levels[0].file.length > 0) { if (m.config.shuffle) { v(S()) } else { if (m.item + 1 == m.playlist.length) { v(0) } else { v(m.item + 1) } } } if (m.state != b.api.events.state.IDLE) { var U = m.state; m.state = b.api.events.state.IDLE; N.sendEvent(b.api.events.JWPLAYER_PLAYER_STATE, { oldstate: U, newstate: b.api.events.state.IDLE }) } F(); return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function I() { try { if (m.playlist[m.item].levels[0].file.length > 0) { if (m.config.shuffle) { v(S()) } else { if (m.item === 0) { v(m.playlist.length - 1) } else { v(m.item - 1) } } } if (m.state != b.api.events.state.IDLE) { var U = m.state; m.state = b.api.events.state.IDLE; N.sendEvent(b.api.events.JWPLAYER_PLAYER_STATE, { oldstate: U, newstate: b.api.events.state.IDLE }) } F(); return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function S() { var T = null; if (m.playlist.length > 1) { while (!c.exists(T)) { T = Math.floor(Math.random() * m.playlist.length); if (T == m.item) { T = null } } } else { T = 0 } return T } function H(U) { if (!m.playlist || !m.playlist[U]) { return false } try { if (m.playlist[U].levels[0].file.length > 0) { var V = m.state; if (V !== b.api.events.state.IDLE) { if (m.playlist[m.item] && m.playlist[m.item].provider == m.playlist[U].provider) { w(false) } else { w() } } v(U); F() } return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function v(T) { if (!m.playlist[T]) { return } m.setActiveMediaProvider(m.playlist[T]); if (m.item != T) { m.item = T; M = true; N.sendEvent(b.api.events.JWPLAYER_PLAYLIST_ITEM, { index: T }) } } function g(U) { try { v(m.item); var V = m.getMedia(); switch (typeof (U)) { case "number": V.volume(U); break; case "string": V.volume(parseInt(U, 10)); break } m.setVolume(U); return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function r(U) { try { v(m.item); var V = m.getMedia(); if (typeof U == "undefined") { V.mute(!m.mute); m.setMute(!m.mute) } else { if (U.toString().toLowerCase() == "true") { V.mute(true); m.setMute(true) } else { V.mute(false); m.setMute(false) } } return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function J(U, T) { try { m.width = U; m.height = T; j.resize(U, T); N.sendEvent(b.api.events.JWPLAYER_RESIZE, { width: m.width, height: m.height }); return true } catch (V) { N.sendEvent(b.api.events.JWPLAYER_ERROR, V) } return false } function u(U, V) { try { if (typeof U == "undefined") { U = !m.fullscreen } if (typeof V == "undefined") { V = true } if (U != m.fullscreen) { m.fullscreen = (U.toString().toLowerCase() == "true"); j.fullscreen(m.fullscreen); if (V) { N.sendEvent(b.api.events.JWPLAYER_FULLSCREEN, { fullscreen: m.fullscreen }) } N.sendEvent(b.api.events.JWPLAYER_RESIZE, { width: m.width, height: m.height }) } return true } catch (T) { N.sendEvent(b.api.events.JWPLAYER_ERROR, T) } return false } function R(T) { try { w(); if (A) { d = false } m.loadPlaylist(T); if (m.playlist[m.item].provider) { v(m.item); if (m.config.autostart.toString().toLowerCase() == "true" && !c.isIOS() && !A) { F() } return true } else { return false } } catch (U) { N.sendEvent(b.api.events.JWPLAYER_ERROR, U) } return false } function O(T) { if (!c.isIOS()) { v(m.item); if (m.config.autostart.toString().toLowerCase() == "true" && !c.isIOS()) { F() } } } function p(T) { u(T.fullscreen, false) } function t() { try { return m.getMedia().detachMedia() } catch (T) { return null } } function l() { try { var T = m.getMedia().attachMedia(); if (typeof P == "function") { P() } } catch (U) { return null } } b.html5.controller.repeatoptions = { LIST: "LIST", ALWAYS: "ALWAYS", SINGLE: "SINGLE", NONE: "NONE" }; function E() { if (m.state != b.api.events.state.IDLE) { return } P = E; switch (m.config.repeat.toUpperCase()) { case b.html5.controller.repeatoptions.SINGLE: F(); break; case b.html5.controller.repeatoptions.ALWAYS: if (m.item == m.playlist.length - 1 && !m.config.shuffle) { H(0) } else { k() } break; case b.html5.controller.repeatoptions.LIST: if (m.item == m.playlist.length - 1 && !m.config.shuffle) { w(); v(0) } else { k() } break; default: w(); break } } var x = []; function Q(T) { return function () { if (q) { B(T, arguments) } else { x.push({ method: T, arguments: arguments }) } } } function B(V, U) { var T = []; for (i = 0; i < U.length; i++) { T.push(U[i]) } V.apply(this, T) } this.play = Q(F); this.pause = Q(e); this.seek = Q(z); this.stop = Q(w); this.next = Q(k); this.prev = Q(I); this.item = Q(H); this.setVolume = Q(g); this.setMute = Q(r); this.resize = Q(J); this.setFullscreen = Q(u); this.load = Q(R); this.playerReady = s; this.detachMedia = t; this.attachMedia = l; this.beforePlay = function () { return A } } })(jwplayer); (function (a) { a.html5.defaultSkin = function () { this.text = '<?xml version="1.0" ?><skin author="LongTail Video" name="Five" version="1.1"><components><component name="controlbar"><settings><setting name="margin" value="20"/><setting name="fontsize" value="11"/><setting name="fontcolor" value="0x000000"/></settings><layout><group position="left"><button name="play"/><divider name="divider"/><button name="prev"/><divider name="divider"/><button name="next"/><divider name="divider"/><text name="elapsed"/></group><group position="center"><slider name="time"/></group><group position="right"><text name="duration"/><divider name="divider"/><button name="blank"/><divider name="divider"/><button name="mute"/><slider name="volume"/><divider name="divider"/><button name="fullscreen"/></group></layout><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAElJREFUOI3t1LERACAMQlFgGvcfxNIhHMK4gsUvUviOmgtNsiAZkBSEKxKEnCYkkQrJn/YwbUNiSDDYRZaQRDaShv+oX9GBZEIuK+8hXVLs+/YAAAAASUVORK5CYII="/><element name="blankButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAYCAYAAAAyJzegAAAAFElEQVQYV2P8//8/AzpgHBUc7oIAGZdH0RjKN8EAAAAASUVORK5CYII="/><element name="capLeft" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAYAAAA7zJfaAAAAQElEQVQIWz3LsRGAMADDQJ0XB5bMINABZ9GENGrszxhjT2WLSqxEJG2JQrTMdV2q5LpOAvyRaVmsi7WdeZ/7+AAaOTq7BVrfOQAAAABJRU5ErkJggg=="/><element name="capRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAYAAAA7zJfaAAAAQElEQVQIWz3LsRGAMADDQJ0XB5bMINABZ9GENGrszxhjT2WLSqxEJG2JQrTMdV2q5LpOAvyRaVmsi7WdeZ/7+AAaOTq7BVrfOQAAAABJRU5ErkJggg=="/><element name="divider" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADhJREFUCB0FwcENgEAAw7Aq+893g8APUILNOQcbFRktVGqUVFRkWNz3xTa2sUaLNUosKlRUvvf5AdbWOTtzmzyWAAAAAElFTkSuQmCC"/><element name="playButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAANUlEQVR42u2RsQkAAAjD/NTTPaW6dXLrINJA1kBpGPMAjDWmOgp1HFQXx+b1KOefO4oxY57R73YnVYCQUCQAAAAASUVORK5CYII="/><element name="pauseButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAIUlEQVQ4jWNgGAWjYOiD/0gYG3/U0FFDB4Oho2AUDAYAAEwiL9HrpdMVAAAAAElFTkSuQmCC"/><element name="prevButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAQklEQVQ4y2NgGAWjYOiD/1AMA/JAfB5NjCJD/YH4PRaLyDa0H4lNNUP/DxlD59PCUBCIp3ZEwYA+NZLUKBgFgwEAAN+HLX9sB8u8AAAAAElFTkSuQmCC"/><element name="nextButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAQElEQVQ4y2NgGAWjYOiD/0B8Hojl0cT+U2ooCL8HYn9qGwrD/bQw9P+QMXQ+tSMqnpoRBUpS+tRMUqNgFAwGAADxZy1/mHvFnAAAAABJRU5ErkJggg=="/><element name="timeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAOElEQVRIDe3BwQkAIRADwAhhw/nU/kWwUK+KPITMABFh19Y+F0acY8CJvX9wYpXgRElwolSIiMf9ZWEDhtwurFsAAAAASUVORK5CYII="/><element name="timeSliderBuffer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAN0lEQVRIDe3BwQkAMQwDMBcc55mRe9zi7RR+FCwBEWG39vcfGHFm4MTuhhMlwYlVBSdKhYh43AW/LQMKm1spzwAAAABJRU5ErkJggg=="/><element name="timeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAIElEQVRIiWNgGAWjYBTQBfynMR61YCRYMApGwSigMQAAiVWPcbq6UkIAAAAASUVORK5CYII="/><element name="timeSliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAYCAYAAAA/OUfnAAAAO0lEQVQYlWP4//8/Awwz0JgDBP/BeN6Cxf/hnI2btiI4u/fsQ3AOHjqK4Jw4eQbBOX/hEoKDYjSd/AMA4cS4mfLsorgAAAAASUVORK5CYII="/><element name="muteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAJklEQVQ4y2NgGAUjDcwH4v/kaPxPikZkxcNVI9mBQ5XoGAWDFwAAsKAXKQQmfbUAAAAASUVORK5CYII="/><element name="unmuteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAMklEQVQ4y2NgGAWDHPyntub5xBr6Hwv/Pzk2/yfVG/8psRFE25Oq8T+tQnsIaB4FVAcAi2YVysVY52AAAAAASUVORK5CYII="/><element name="volumeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAAACmpqampqbBXAu8AAAAAnRSTlMAgJsrThgAAAArSURBVAhbY2AgErBAyA4I2QEhOyBkB4TsYOhAoaCCUCUwDTDtMMNgRuMHAFB5FoGH5T0UAAAAAElFTkSuQmCC"/><element name="volumeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYAgMAAACdGdVrAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAgJsrThgAAAArSURBVAhbY2AgErBAyA4I2QEhOyBkB4TsYOhAoaCCUCUwDTDtMMNgRuMHAFB5FoGH5T0UAAAAAElFTkSuQmCC"/><element name="volumeSliderCapRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAYCAYAAAAyJzegAAAAFElEQVQYV2P8//8/AzpgHBUc7oIAGZdH0RjKN8EAAAAASUVORK5CYII="/><element name="fullscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAQklEQVRIiWNgGAWjYMiD/0iYFDmSLbDHImdPLQtgBpEiR7Zl2NijAA5oEkT/0Whi5UiyAJ8BVMsHNMtoo2AUDAIAAGdcIN3IDNXoAAAAAElFTkSuQmCC"/><element name="normalscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAP0lEQVRIx2NgGAWjYMiD/1RSQ5QB/wmIUWzJfzx8qhj+n4DYCAY0DyJ7PBbYU8sHMEvwiZFtODXUjIJRMJgBACpWIN2ZxdPTAAAAAElFTkSuQmCC"/></elements></component><component name="display"><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlOZpuml+rYAAAASSURBVBhXY2AYJuA/GBwY6jQAyDyoK8QcL4QAAAAASUVORK5CYII="/><element name="playIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAiUlEQVR42u3XSw2AMBREURwgAQlIQAISKgUpSEFKJeCg5b0E0kWBTVcD9ySTsL0Jn9IBAAAA+K2UUrBlW/Rr5ZDoIeeuoFkxJD9ss03aIXXQqB9SttoG7ZA6qNcOKdttiwcJh9RB+iFl4SshkRBuLR72+9cvH0SOKI2HRo7x/Fi1/uoCAAAAwLsD8ki99IlO2dQAAAAASUVORK5CYII="/><element name="muteIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAVUlEQVR42u3WMQrAIAxAUW/g/SdvGmvpoOBeSHgPsjj5QTANAACARCJilIhYM0tEvJM+Ik3Id9E957kQIb+F3OdCPC0hPkQriqWx9hp/x/QGAABQyAPLB22VGrpLDgAAAABJRU5ErkJggg=="/><element name="errorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA/0lEQVR42u2U0QmEMBAF7cASLMESUoIlpARLSCkpwRJSgiWkhOvAXD4WsgRkyaG5DbyB+Yvg8KITAAAAAAAYk+u61mwk15EjPtlEfihmqIiZR1Qx80ghjgdUuiHXGHSVsoag0x6x8DUoyjD5KovmEJ9NTDMRPIT0mtdIUkjlonuNohO+Ha99DTmkuGgKCTcvebAzx82ZoCWC3/3aIMWSRucaxcjORSFY4xpFdjYJGp1rFGcyCYZ/RVh6AUnfcNZ2zih3/mGj1jVCdiNDwyrq1rA/xMdeEXvDVdnYc1vDc3uPkDObXrlaxbNHSOohQhr/WOeLEWfWTgAAAAAAADzNF9sHJ7PJ57MlAAAAAElFTkSuQmCC"/><element name="bufferIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACBklEQVR42u3Zv0sCYRzH8USTzOsHHEWGkC1HgaDgkktGDjUYtDQ01RDSljQ1BLU02+rk1NTm2NLq4Nx/0L/h9fnCd3j4cnZe1/U8xiO8h3uurufF0/3COd/3/0UWYiEWYiEWYiGJQ+J8xuPxKhXjEMZANinjIZhkGuVRNioE4wVURo4JkHm0xKWmhRAc1bh1EyCUw5BcBIjHiApKa4CErko6DEJwuRo6IRKzyJD8FJAyI3Zp2zRImiBcRhlfo5RtlxCcE3CcDNpGrhYIT2IhAJKilO0VRmzJ32fAMTpBTS0QMfGwlcuKMRftE0DJ0wCJdcOsCkBdXP3Mh9CEFUBTPS9mDZJBG6io4aqVzMdCokCw9H3kT6j/C/9iDdSeUMNC7DkyyxAs/Rk6Qss8FPWRZgdVtUH4DjxEn1zxh+/zj1wHlf4MQhNGrwqA6sY40U8JonRJwEQh+AO3AvCG6gHv4U7IY4krxkroWoAOkoQMGfCBrgIm+YBGqPENpIJ66CJg3x66Y0gnSUidAEEnNr9jjLiWMn5DiWP0OC/oAsCgkq43xBdGDMQr7YASP/vEkHvdl1+JOCcEV5sC4hGEOzTlPuKgd0b0xD4JkRcOgnRRTjdErkYhAsQVq6IdUuPJtmk7BCL3t/h88cx91pKQkI/pkDx6pmYTIjEoxiHsN1YWYiEWYiEWknhflZ5IErA5nr8AAAAASUVORK5CYII="/></elements></component><component name="dock"><settings><setting name="fontcolor" value="0xffffff"/></settings><elements><element name="button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlOZpuml+rYAAAASSURBVBhXY2AYJuA/GBwY6jQAyDyoK8QcL4QAAAAASUVORK5CYII="/></elements></component><component name="playlist"><settings><setting name="backgroundcolor" value="0xe8e8e8"/></settings><elements><element name="item" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUaN7t2MENwCAMBEEe9N8wSKYC/D8YV7CyJoRkVtVImxkZPQInMxoP0XiIxkM0HsGbjjSNBx544IEHHnjggUe/6UQeey0PIh7XTftGxKPj4eXCtLsHHh+ZxkO0Iw8PR55Ni8ZD9Hu/EAoP0dc5RRg9qeRjVF8AAAAASUVORK5CYII="/><element name="sliderCapTop" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAHCAYAAADnCQYGAAAAFUlEQVQokWP8//8/A7UB46ihI9hQAKt6FPPXhVGHAAAAAElFTkSuQmCC"/><element name="sliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAKElEQVQ4y2P4//8/Az68bNmy/+iYkB6GUUNHDR01dNTQUUNHDaXcUABUDOKhcxnsSwAAAABJRU5ErkJggg=="/><element name="sliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAJUlEQVQ4T2P4//8/Ay4MBP9xYbz6Rg0dNXTU0FFDRw0dNZRyQwHH4NBa7GJsXAAAAABJRU5ErkJggg=="/><element name="sliderCapBottom" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAHCAYAAADnCQYGAAAAFUlEQVQokWP8//8/A7UB46ihI9hQAKt6FPPXhVGHAAAAAElFTkSuQmCC"/></elements></component></components></skin>'; this.xml = null; if (window.DOMParser) { parser = new DOMParser(); this.xml = parser.parseFromString(this.text, "text/xml") } else { this.xml = new ActiveXObject("Microsoft.XMLDOM"); this.xml.async = "false"; this.xml.loadXML(this.text) } return this } })(jwplayer); (function (a) { _utils = a.utils; _css = _utils.css; _hide = function (b) { _css(b, { display: "none" }) }; _show = function (b) { _css(b, { display: "block" }) }; a.html5.display = function (k, K) { var j = { icons: true, showmute: false }; var X = _utils.extend({}, j, K); var h = k; var W = {}; var e; var w; var z; var T; var u; var M; var E; var N = !_utils.exists(h.skin.getComponentSettings("display").bufferrotation) ? 15 : parseInt(h.skin.getComponentSettings("display").bufferrotation, 10); var s = !_utils.exists(h.skin.getComponentSettings("display").bufferinterval) ? 100 : parseInt(h.skin.getComponentSettings("display").bufferinterval, 10); var D = -1; var v = a.api.events.state.IDLE; var O = true; var d; var C = false, V = true; var p = ""; var g = false; var o = false; var m; var y, R; var L = new a.html5.eventdispatcher(); _utils.extend(this, L); var H = { display: { style: { cursor: "pointer", top: 0, left: 0, overflow: "hidden" }, click: n }, display_icon: { style: { cursor: "pointer", position: "absolute", top: ((h.skin.getSkinElement("display", "background").height - h.skin.getSkinElement("display", "playIcon").height) / 2), left: ((h.skin.getSkinElement("display", "background").width - h.skin.getSkinElement("display", "playIcon").width) / 2), border: 0, margin: 0, padding: 0, zIndex: 3, display: "none"} }, display_iconBackground: { style: { cursor: "pointer", position: "absolute", top: ((w - h.skin.getSkinElement("display", "background").height) / 2), left: ((e - h.skin.getSkinElement("display", "background").width) / 2), border: 0, backgroundImage: (["url(", h.skin.getSkinElement("display", "background").src, ")"]).join(""), width: h.skin.getSkinElement("display", "background").width, height: h.skin.getSkinElement("display", "background").height, margin: 0, padding: 0, zIndex: 2, display: "none"} }, display_image: { style: { display: "none", width: e, height: w, position: "absolute", cursor: "pointer", left: 0, top: 0, margin: 0, padding: 0, textDecoration: "none", zIndex: 1} }, display_text: { style: { zIndex: 4, position: "relative", opacity: 0.8, backgroundColor: parseInt("000000", 16), color: parseInt("ffffff", 16), textAlign: "center", fontFamily: "Arial,sans-serif", padding: "0 5px", fontSize: 14}} }; h.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, q); h.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE, q); h.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, P); h.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, q); h.jwAddEventListener(a.api.events.JWPLAYER_ERROR, r); Q(); function Q() { W.display = G("div", "display"); W.display_text = G("div", "display_text"); W.display.appendChild(W.display_text); W.display_image = G("img", "display_image"); W.display_image.onerror = function (Y) { _hide(W.display_image) }; W.display_image.onload = B; W.display_icon = G("div", "display_icon"); W.display_iconBackground = G("div", "display_iconBackground"); W.display.appendChild(W.display_image); W.display_iconBackground.appendChild(W.display_icon); W.display.appendChild(W.display_iconBackground); f(); setTimeout((function () { o = true; if (X.icons.toString() == "true") { J() } }), 1) } this.getDisplayElement = function () { return W.display }; this.resize = function (Z, Y) { if (h.jwGetFullscreen() && _utils.useNativeFullscreen()) { return } _css(W.display, { width: Z, height: Y }); _css(W.display_text, { width: (Z - 10), top: ((Y - _utils.getBoundingClientRect(W.display_text).height) / 2) }); _css(W.display_iconBackground, { top: ((Y - h.skin.getSkinElement("display", "background").height) / 2), left: ((Z - h.skin.getSkinElement("display", "background").width) / 2) }); if (e != Z || w != Y) { e = Z; w = Y; d = undefined; J() } if (!h.jwGetFullscreen()) { y = Z; R = Y } c(); q({}) }; this.show = function () { if (g) { g = false; t(h.jwGetState()) } }; this.hide = function () { if (!g) { F(); g = true } }; function B(Y) { z = W.display_image.naturalWidth; T = W.display_image.naturalHeight; c(); if (h.jwGetState() == a.api.events.state.IDLE) { _css(W.display_image, { display: "block", opacity: 0 }); _utils.fadeTo(W.display_image, 1, 0.1) } C = false } function c() { if (h.jwGetFullscreen() && h.jwGetStretching() == a.utils.stretching.EXACTFIT) { var Y = document.createElement("div"); _utils.stretch(a.utils.stretching.UNIFORM, Y, e, w, y, R); _utils.stretch(a.utils.stretching.EXACTFIT, W.display_image, _utils.parseDimension(Y.style.width), _utils.parseDimension(Y.style.height), z, T); _css(W.display_image, { left: Y.style.left, top: Y.style.top }) } else { _utils.stretch(h.jwGetStretching(), W.display_image, e, w, z, T) } } function G(Y, aa) { var Z = document.createElement(Y); Z.id = h.id + "_jwplayer_" + aa; _css(Z, H[aa].style); return Z } function f() { for (var Y in W) { if (_utils.exists(H[Y].click)) { W[Y].onclick = H[Y].click } } } function n(Y) { if (typeof Y.preventDefault != "undefined") { Y.preventDefault() } else { Y.returnValue = false } if (typeof m == "function") { m(Y); return } else { if (h.jwGetState() != a.api.events.state.PLAYING) { h.jwPlay() } else { h.jwPause() } } } function U(Y) { if (E) { F(); return } W.display_icon.style.backgroundImage = (["url(", h.skin.getSkinElement("display", Y).src, ")"]).join(""); _css(W.display_icon, { width: h.skin.getSkinElement("display", Y).width, height: h.skin.getSkinElement("display", Y).height, top: (h.skin.getSkinElement("display", "background").height - h.skin.getSkinElement("display", Y).height) / 2, left: (h.skin.getSkinElement("display", "background").width - h.skin.getSkinElement("display", Y).width) / 2 }); b(); if (_utils.exists(h.skin.getSkinElement("display", Y + "Over"))) { W.display_icon.onmouseover = function (Z) { W.display_icon.style.backgroundImage = ["url(", h.skin.getSkinElement("display", Y + "Over").src, ")"].join("") }; W.display_icon.onmouseout = function (Z) { W.display_icon.style.backgroundImage = ["url(", h.skin.getSkinElement("display", Y).src, ")"].join("") } } else { W.display_icon.onmouseover = null; W.display_icon.onmouseout = null } } function F() { if (X.icons.toString() == "true") { _hide(W.display_icon); _hide(W.display_iconBackground); S() } } function b() { if (!g && X.icons.toString() == "true") { _show(W.display_icon); _show(W.display_iconBackground); J() } } function r(Y) { E = true; F(); W.display_text.innerHTML = Y.message; _show(W.display_text); W.display_text.style.top = ((w - _utils.getBoundingClientRect(W.display_text).height) / 2) + "px" } function I() { V = false; W.display_image.style.display = "none" } function P() { v = "" } function q(Y) { if ((Y.type == a.api.events.JWPLAYER_PLAYER_STATE || Y.type == a.api.events.JWPLAYER_PLAYLIST_ITEM) && E) { E = false; _hide(W.display_text) } var Z = h.jwGetState(); if (Z == v) { return } v = Z; if (D >= 0) { clearTimeout(D) } if (O || h.jwGetState() == a.api.events.state.PLAYING || h.jwGetState() == a.api.events.state.PAUSED) { t(h.jwGetState()) } else { D = setTimeout(l(h.jwGetState()), 500) } } function l(Y) { return (function () { t(Y) }) } function t(Y) { if (_utils.exists(M)) { clearInterval(M); M = null; _utils.animations.rotate(W.display_icon, 0) } switch (Y) { case a.api.events.state.BUFFERING: if (_utils.isIPod()) { I(); F() } else { if (h.jwGetPlaylist()[h.jwGetPlaylistIndex()].provider == "sound") { x() } u = 0; M = setInterval(function () { u += N; _utils.animations.rotate(W.display_icon, u % 360) }, s); U("bufferIcon"); O = true } break; case a.api.events.state.PAUSED: if (!_utils.isIPod()) { if (h.jwGetPlaylist()[h.jwGetPlaylistIndex()].provider != "sound") { _css(W.display_image, { background: "transparent no-repeat center center" }) } U("playIcon"); O = true } break; case a.api.events.state.IDLE: if (h.jwGetPlaylist()[h.jwGetPlaylistIndex()] && h.jwGetPlaylist()[h.jwGetPlaylistIndex()].image) { x() } else { I() } U("playIcon"); O = true; break; default: if (h.jwGetPlaylist()[h.jwGetPlaylistIndex()] && h.jwGetPlaylist()[h.jwGetPlaylistIndex()].provider == "sound") { if (_utils.isIPod()) { I(); O = false } else { x() } } else { I(); O = false } if (h.jwGetMute() && X.showmute) { U("muteIcon") } else { F() } break } D = -1 } function x() { if (h.jwGetPlaylist()[h.jwGetPlaylistIndex()]) { var Y = h.jwGetPlaylist()[h.jwGetPlaylistIndex()].image; if (Y) { if (Y != p) { p = Y; W.display_image.style.display = "none"; C = true; W.display_image.src = _utils.getAbsolutePath(Y) } else { if (!(C || V)) { V = true; W.display_image.style.opacity = 0; W.display_image.style.display = "block"; _utils.fadeTo(W.display_image, 1, 0.1) } } } } } function A(Y) { return function () { if (!o) { return } if (!g && d != Y) { d = Y; L.sendEvent(Y, { component: "display", boundingRect: _utils.getDimensions(W.display_iconBackground) }) } } } var J = A(a.api.events.JWPLAYER_COMPONENT_SHOW); var S = A(a.api.events.JWPLAYER_COMPONENT_HIDE); this.setAlternateClickHandler = function (Y) { m = Y }; this.revertAlternateClickHandler = function () { m = undefined }; return this } })(jwplayer); (function (a) { var c = a.utils; var b = c.css; a.html5.dock = function (w, D) { function x() { return { align: a.html5.view.positions.RIGHT} } var n = c.extend({}, x(), D); if (n.align == "FALSE") { return } var j = {}; var A = []; var k; var F; var f = false; var C = false; var g = { x: 0, y: 0, width: 0, height: 0 }; var z; var o; var y; var m = new a.html5.eventdispatcher(); c.extend(this, m); var r = document.createElement("div"); r.id = w.id + "_jwplayer_dock"; r.style.opacity = 1; p(); w.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, q); this.getDisplayElement = function () { return r }; this.setButton = function (K, H, I, J) { if (!H && j[K]) { c.arrays.remove(A, K); r.removeChild(j[K].div); delete j[K] } else { if (H) { if (!j[K]) { j[K] = {} } j[K].handler = H; j[K].outGraphic = I; j[K].overGraphic = J; if (!j[K].div) { A.push(K); j[K].div = document.createElement("div"); j[K].div.style.position = "absolute"; r.appendChild(j[K].div); j[K].div.appendChild(document.createElement("div")); j[K].div.childNodes[0].style.position = "relative"; j[K].div.childNodes[0].style.width = "100%"; j[K].div.childNodes[0].style.height = "100%"; j[K].div.childNodes[0].style.zIndex = 10; j[K].div.childNodes[0].style.cursor = "pointer"; j[K].div.appendChild(document.createElement("img")); j[K].div.childNodes[1].style.position = "absolute"; j[K].div.childNodes[1].style.left = 0; j[K].div.childNodes[1].style.top = 0; if (w.skin.getSkinElement("dock", "button")) { j[K].div.childNodes[1].src = w.skin.getSkinElement("dock", "button").src } j[K].div.childNodes[1].style.zIndex = 9; j[K].div.childNodes[1].style.cursor = "pointer"; j[K].div.onmouseover = function () { if (j[K].overGraphic) { j[K].div.childNodes[0].style.background = h(j[K].overGraphic) } if (w.skin.getSkinElement("dock", "buttonOver")) { j[K].div.childNodes[1].src = w.skin.getSkinElement("dock", "buttonOver").src } }; j[K].div.onmouseout = function () { if (j[K].outGraphic) { j[K].div.childNodes[0].style.background = h(j[K].outGraphic) } if (w.skin.getSkinElement("dock", "button")) { j[K].div.childNodes[1].src = w.skin.getSkinElement("dock", "button").src } }; if (w.skin.getSkinElement("dock", "button")) { j[K].div.childNodes[1].src = w.skin.getSkinElement("dock", "button").src } } if (j[K].outGraphic) { j[K].div.childNodes[0].style.background = h(j[K].outGraphic) } else { if (j[K].overGraphic) { j[K].div.childNodes[0].style.background = h(j[K].overGraphic) } } if (H) { j[K].div.onclick = function (L) { L.preventDefault(); a(w.id).callback(K); if (j[K].overGraphic) { j[K].div.childNodes[0].style.background = h(j[K].overGraphic) } if (w.skin.getSkinElement("dock", "button")) { j[K].div.childNodes[1].src = w.skin.getSkinElement("dock", "button").src } } } } } l(k, F) }; function h(H) { return "url(" + H + ") no-repeat center center" } function t(H) { } function l(H, T) { p(); if (A.length > 0) { var I = 10; var S = I; var P = -1; var Q = w.skin.getSkinElement("dock", "button").height; var O = w.skin.getSkinElement("dock", "button").width; var M = H - O - I; var R, L; if (n.align == a.html5.view.positions.LEFT) { P = 1; M = I } for (var J = 0; J < A.length; J++) { var U = Math.floor(S / T); if ((S + Q + I) > ((U + 1) * T)) { S = ((U + 1) * T) + I; U = Math.floor(S / T) } var K = j[A[J]].div; K.style.top = (S % T) + "px"; K.style.left = (M + (w.skin.getSkinElement("dock", "button").width + I) * U * P) + "px"; var N = { x: c.parseDimension(K.style.left), y: c.parseDimension(K.style.top), width: O, height: Q }; if (!R || (N.x <= R.x && N.y <= R.y)) { R = N } if (!L || (N.x >= L.x && N.y >= L.y)) { L = N } K.style.width = O + "px"; K.style.height = Q + "px"; S += w.skin.getSkinElement("dock", "button").height + I } g = { x: R.x, y: R.y, width: L.x - R.x + L.width, height: R.y - L.y + L.height} } if (C != w.jwGetFullscreen() || k != H || F != T) { k = H; F = T; C = w.jwGetFullscreen(); z = undefined; setTimeout(s, 1) } } function d(H) { return function () { if (!f && z != H && A.length > 0) { z = H; m.sendEvent(H, { component: "dock", boundingRect: g }) } } } function q(H) { if (c.isMobile()) { if (H.newstate == a.api.events.state.IDLE) { v() } else { e() } } else { B() } } function B(H) { if (f) { return } clearTimeout(y); if (D.position == a.html5.view.positions.OVER || w.jwGetFullscreen()) { switch (w.jwGetState()) { case a.api.events.state.PAUSED: case a.api.events.state.IDLE: if (r && r.style.opacity < 1 && (!D.idlehide || c.exists(H))) { E() } if (D.idlehide) { y = setTimeout(function () { u() }, 2000) } break; default: if (c.exists(H)) { E() } y = setTimeout(function () { u() }, 2000); break } } else { E() } } var s = d(a.api.events.JWPLAYER_COMPONENT_SHOW); var G = d(a.api.events.JWPLAYER_COMPONENT_HIDE); this.resize = l; var v = function () { b(r, { display: "block" }); if (f) { f = false; s() } }; var e = function () { b(r, { display: "none" }); if (!f) { G(); f = true } }; function u() { if (!f) { G(); if (r.style.opacity == 1) { c.cancelAnimation(r); c.fadeTo(r, 0, 0.1, 1, 0) } } } function E() { if (!f) { s(); if (r.style.opacity == 0) { c.cancelAnimation(r); c.fadeTo(r, 1, 0.1, 0, 0) } } } function p() { try { o = document.getElementById(w.id); o.addEventListener("mousemove", B) } catch (H) { c.log("Could not add mouse listeners to dock: " + H) } } this.hide = e; this.show = v; return this } })(jwplayer); (function (a) { a.html5.eventdispatcher = function (d, b) { var c = new a.events.eventdispatcher(b); a.utils.extend(this, c); this.sendEvent = function (e, f) { if (!a.utils.exists(f)) { f = {} } a.utils.extend(f, { id: d, version: a.version, type: e }); c.sendEvent(e, f) } } })(jwplayer); (function (a) { var b = a.utils; a.html5.instream = function (y, m, x, z) { var t = { controlbarseekable: "always", controlbarpausable: true, controlbarstoppable: true, playlistclickable: true }; var v, A, C = y, E = m, j = x, w = z, r, H, o, G, e, f, g, l, q, h = false, k, d, n = this; this.load = function (M, K) { c(); h = true; A = b.extend(t, K); v = a.html5.playlistitem(M); F(); d = document.createElement("div"); d.id = n.id + "_instream_container"; w.detachMedia(); r = g.getDisplayElement(); f = E.playlist[E.item]; e = C.jwGetState(); if (e == a.api.events.state.BUFFERING || e == a.api.events.state.PLAYING) { r.pause() } H = r.src ? r.src : r.currentSrc; o = r.innerHTML; G = r.currentTime; q = new a.html5.display(n, b.extend({}, E.plugins.config.display)); q.setAlternateClickHandler(function (N) { if (_fakemodel.state == a.api.events.state.PAUSED) { n.jwInstreamPlay() } else { D(a.api.events.JWPLAYER_INSTREAM_CLICK, N) } }); d.appendChild(q.getDisplayElement()); if (!b.isMobile()) { l = new a.html5.controlbar(n, b.extend({}, E.plugins.config.controlbar, {})); if (E.plugins.config.controlbar.position == a.html5.view.positions.OVER) { d.appendChild(l.getDisplayElement()) } else { var L = E.plugins.object.controlbar.getDisplayElement().parentNode; L.appendChild(l.getDisplayElement()) } } j.setupInstream(d, r); p(); g.load(v) }; this.jwInstreamDestroy = function (K) { if (!h) { return } h = false; if (e != a.api.events.state.IDLE) { g.load(f, false); g.stop(false) } else { g.stop(true) } g.detachMedia(); j.destroyInstream(); if (l) { try { l.getDisplayElement().parentNode.removeChild(l.getDisplayElement()) } catch (L) { } } D(a.api.events.JWPLAYER_INSTREAM_DESTROYED, { reason: (K ? "complete" : "destroyed") }, true); w.attachMedia(); if (e == a.api.events.state.BUFFERING || e == a.api.events.state.PLAYING) { r.play(); if (E.playlist[E.item] == f) { E.getMedia().seek(G) } } return }; this.jwInstreamAddEventListener = function (K, L) { k.addEventListener(K, L) }; this.jwInstreamRemoveEventListener = function (K, L) { k.removeEventListener(K, L) }; this.jwInstreamPlay = function () { if (!h) { return } g.play(true) }; this.jwInstreamPause = function () { if (!h) { return } g.pause(true) }; this.jwInstreamSeek = function (K) { if (!h) { return } g.seek(K) }; this.jwInstreamGetState = function () { if (!h) { return undefined } return _fakemodel.state }; this.jwInstreamGetPosition = function () { if (!h) { return undefined } return _fakemodel.position }; this.jwInstreamGetDuration = function () { if (!h) { return undefined } return _fakemodel.duration }; this.playlistClickable = function () { return (!h || A.playlistclickable.toString().toLowerCase() == "true") }; function s() { _fakemodel = new a.html5.model(this, E.getMedia() ? E.getMedia().getDisplayElement() : E.container, E); k = new a.html5.eventdispatcher(); C.jwAddEventListener(a.api.events.JWPLAYER_RESIZE, p); C.jwAddEventListener(a.api.events.JWPLAYER_FULLSCREEN, p) } function c() { _fakemodel.setMute(E.mute); _fakemodel.setVolume(E.volume) } function F() { if (!g) { g = new a.html5.mediavideo(_fakemodel, E.getMedia() ? E.getMedia().getDisplayElement() : E.container); g.addGlobalListener(I); g.addEventListener(a.api.events.JWPLAYER_MEDIA_META, J); g.addEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE, u); g.addEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL, B) } g.attachMedia() } function I(K) { if (h) { D(K.type, K) } } function B(K) { if (h) { g.play() } } function u(K) { if (h) { setTimeout(function () { n.jwInstreamDestroy(true) }, 10) } } function J(K) { if (K.metadata.width && K.metadata.height) { j.resizeMedia() } } function D(K, L, M) { if (h || M) { k.sendEvent(K, L) } } function p() { var K = E.plugins.object.display.getDisplayElement().style; if (l) { var L = E.plugins.object.controlbar.getDisplayElement().style; l.resize(b.parseDimension(K.width), b.parseDimension(L.height)); _css(l.getDisplayElement(), b.extend({}, L, { zIndex: 1001, opacity: 1 })) } if (q) { q.resize(b.parseDimension(K.width), b.parseDimension(K.height)); _css(q.getDisplayElement(), b.extend({}, K, { zIndex: 1000 })) } if (j) { j.resizeMedia() } } this.jwPlay = function (K) { if (A.controlbarpausable.toString().toLowerCase() == "true") { this.jwInstreamPlay() } }; this.jwPause = function (K) { if (A.controlbarpausable.toString().toLowerCase() == "true") { this.jwInstreamPause() } }; this.jwStop = function () { if (A.controlbarstoppable.toString().toLowerCase() == "true") { this.jwInstreamDestroy(); C.jwStop() } }; this.jwSeek = function (K) { switch (A.controlbarseekable.toLowerCase()) { case "always": this.jwInstreamSeek(K); break; case "backwards": if (_fakemodel.position > K) { this.jwInstreamSeek(K) } break } }; this.jwGetPosition = function () { }; this.jwGetDuration = function () { }; this.jwGetWidth = C.jwGetWidth; this.jwGetHeight = C.jwGetHeight; this.jwGetFullscreen = C.jwGetFullscreen; this.jwSetFullscreen = C.jwSetFullscreen; this.jwGetVolume = function () { return E.volume }; this.jwSetVolume = function (K) { g.volume(K); C.jwSetVolume(K) }; this.jwGetMute = function () { return E.mute }; this.jwSetMute = function (K) { g.mute(K); C.jwSetMute(K) }; this.jwGetState = function () { return _fakemodel.state }; this.jwGetPlaylist = function () { return [v] }; this.jwGetPlaylistIndex = function () { return 0 }; this.jwGetStretching = function () { return E.config.stretching }; this.jwAddEventListener = function (L, K) { k.addEventListener(L, K) }; this.jwRemoveEventListener = function (L, K) { k.removeEventListener(L, K) }; this.skin = C.skin; this.id = C.id + "_instream"; s(); return this } })(jwplayer); (function (a) { var b = { prefix: "http://l.longtailvideo.com/html5/", file: "logo.png", link: "http://www.longtailvideo.com/players/jw-flv-player/", linktarget: "_top", margin: 8, out: 0.5, over: 1, timeout: 5, hide: true, position: "bottom-left" }; _css = a.utils.css; a.html5.logo = function (n, r) { var q = n; var u; var d; var t; var h = false; g(); function g() { o(); q.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, j); c(); l() } function o() { if (b.prefix) { var v = n.version.split(/\W/).splice(0, 2).join("/"); if (b.prefix.indexOf(v) < 0) { b.prefix += v + "/" } } if (r.position == a.html5.view.positions.OVER) { r.position = b.position } try { if (window.location.href.indexOf("https") == 0) { b.prefix = b.prefix.replace("http://l.longtailvideo.com", "https://securel.longtailvideo.com") } } catch (w) { } d = a.utils.extend({}, b) } function c() { t = document.createElement("img"); t.id = q.id + "_jwplayer_logo"; t.style.display = "none"; t.onload = function (v) { _css(t, k()); p() }; if (!d.file) { return } if (d.file.indexOf("/") >= 0) { t.src = d.file } else { t.src = d.prefix + d.file } } if (!d.file) { return } this.resize = function (w, v) { }; this.getDisplayElement = function () { return t }; function l() { if (d.link) { t.onmouseover = f; t.onmouseout = p; t.onclick = s } else { this.mouseEnabled = false } } function s(v) { if (typeof v != "undefined") { v.stopPropagation() } if (!h) { return } q.jwPause(); q.jwSetFullscreen(false); if (d.link) { window.open(d.link, d.linktarget) } return } function p(v) { if (d.link && h) { t.style.opacity = d.out } return } function f(v) { if (h) { t.style.opacity = d.over } return } function k() { var x = { textDecoration: "none", position: "absolute", cursor: "pointer" }; x.display = (d.hide.toString() == "true" && !h) ? "none" : "block"; var w = d.position.toLowerCase().split("-"); for (var v in w) { x[w[v]] = parseInt(d.margin) } return x } function m() { if (d.hide.toString() == "true") { t.style.display = "block"; t.style.opacity = 0; a.utils.fadeTo(t, d.out, 0.1, parseFloat(t.style.opacity)); u = setTimeout(function () { e() }, d.timeout * 1000) } h = true } function e() { h = false; if (d.hide.toString() == "true") { a.utils.fadeTo(t, 0, 0.1, parseFloat(t.style.opacity)) } } function j(v) { if (v.newstate == a.api.events.state.BUFFERING) { clearTimeout(u); m() } } return this } })(jwplayer); (function (b) { var d = { ended: b.api.events.state.IDLE, playing: b.api.events.state.PLAYING, pause: b.api.events.state.PAUSED, buffering: b.api.events.state.BUFFERING }; var e = b.utils; var a = e.isMobile(); var c = {}; b.html5.mediavideo = function (h, F) { var J = { abort: y, canplay: p, canplaythrough: p, durationchange: u, emptied: y, ended: p, error: o, loadeddata: u, loadedmetadata: u, loadstart: p, pause: p, play: y, playing: p, progress: D, ratechange: y, seeked: p, seeking: p, stalled: p, suspend: p, timeupdate: N, volumechange: l, waiting: p, canshowcurrentframe: y, dataunavailable: y, empty: y, load: g, loadedfirstframe: y, webkitfullscreenchange: k }; var K = new b.html5.eventdispatcher(); e.extend(this, K); var j = h, B = F, m, f, C, T, E, M, L = false, t = false, x = false, I, G, Q; R(); this.load = function (V, W) { if (typeof W == "undefined") { W = true } if (!t) { return } T = V; x = (T.duration > 0); j.duration = T.duration; e.empty(m); Q = 0; q(V.levels); if (V.levels && V.levels.length > 0) { if (V.levels.length == 1 || e.isIOS()) { m.src = V.levels[0].file } else { if (m.src) { m.removeAttribute("src") } for (var U = 0; U < V.levels.length; U++) { var X = m.ownerDocument.createElement("source"); X.src = V.levels[U].file; m.appendChild(X); Q++ } } } else { m.src = V.file } m.style.display = "block"; m.style.opacity = 1; m.volume = j.volume / 100; m.muted = j.mute; if (a) { P() } I = G = C = false; j.buffer = 0; if (!e.exists(V.start)) { V.start = 0 } M = (V.start > 0) ? V.start : -1; s(b.api.events.JWPLAYER_MEDIA_LOADED); if ((!a && V.levels.length == 1) || !L) { m.load() } L = false; if (W) { w(b.api.events.state.BUFFERING); s(b.api.events.JWPLAYER_MEDIA_BUFFER, { bufferPercent: 0 }); A() } if (m.videoWidth > 0 && m.videoHeight > 0) { u() } }; this.play = function () { if (!t) { return } A(); if (G) { w(b.api.events.state.PLAYING) } else { w(b.api.events.state.BUFFERING) } m.play() }; this.pause = function () { if (!t) { return } m.pause(); w(b.api.events.state.PAUSED) }; this.seek = function (U) { if (!t) { return } if (!C && m.readyState > 0) { if (!(j.duration <= 0 || isNaN(j.duration)) && !(j.position <= 0 || isNaN(j.position))) { m.currentTime = U; m.play() } } else { M = U } }; var z = this.stop = function (U) { if (!t) { return } if (!e.exists(U)) { U = true } r(); if (U) { G = false; var V = navigator.userAgent; if (m.webkitSupportsFullscreen) { try { m.webkitExitFullscreen() } catch (W) { } } m.style.opacity = 0; v(); if (e.isIE()) { m.src = "" } else { m.removeAttribute("src") } e.empty(m); m.load(); L = true } w(b.api.events.state.IDLE) }; this.fullscreen = function (U) { if (U === true) { this.resize("100%", "100%") } else { this.resize(j.config.width, j.config.height) } }; this.resize = function (V, U) { }; this.volume = function (U) { if (!a) { m.volume = U / 100; s(b.api.events.JWPLAYER_MEDIA_VOLUME, { volume: (U / 100) }) } }; this.mute = function (U) { if (!a) { m.muted = U; s(b.api.events.JWPLAYER_MEDIA_MUTE, { mute: U }) } }; this.getDisplayElement = function () { return m }; this.hasChrome = function () { return a && (f == b.api.events.state.PLAYING) }; this.detachMedia = function () { t = false; return this.getDisplayElement() }; this.attachMedia = function () { t = true }; function H(V, U) { return function (W) { if (e.exists(W.target.parentNode)) { U(W) } } } function R() { f = b.api.events.state.IDLE; t = true; m = n(); m.setAttribute("x-webkit-airplay", "allow"); if (B.parentNode) { B.parentNode.replaceChild(m, B) } } function n() { var U; if (!c[j.id]) { if (B.tagName.toLowerCase() == "video") { U = B } else { U = document.createElement("video") } c[j.id] = U; if (!U.id) { U.id = B.id } for (var V in J) { U.addEventListener(V, H(V, J[V]), true) } } return c[j.id] } function w(U) { if (U == b.api.events.state.PAUSED && f == b.api.events.state.IDLE) { return } if (a) { switch (U) { case b.api.events.state.PLAYING: P(); break; case b.api.events.state.BUFFERING: case b.api.events.state.PAUSED: v(); break } } if (f != U) { var V = f; j.state = f = U; s(b.api.events.JWPLAYER_PLAYER_STATE, { oldstate: V, newstate: U }) } } function y(U) { } function l(U) { var V = Math.round(m.volume * 100); s(b.api.events.JWPLAYER_MEDIA_VOLUME, { volume: V }, true); s(b.api.events.JWPLAYER_MEDIA_MUTE, { mute: m.muted }, true) } function D(W) { if (!t) { return } var V; if (e.exists(W) && W.lengthComputable && W.total) { V = W.loaded / W.total * 100 } else { if (e.exists(m.buffered) && (m.buffered.length > 0)) { var U = m.buffered.length - 1; if (U >= 0) { V = m.buffered.end(U) / m.duration * 100 } } } if (e.useNativeFullscreen() && e.exists(m.webkitDisplayingFullscreen)) { if (j.fullscreen != m.webkitDisplayingFullscreen) { s(b.api.events.JWPLAYER_FULLSCREEN, { fullscreen: m.webkitDisplayingFullscreen }, true) } } if (G === false && f == b.api.events.state.BUFFERING) { s(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL); G = true } if (!I) { if (V == 100) { I = true } if (e.exists(V) && (V > j.buffer)) { j.buffer = Math.round(V); s(b.api.events.JWPLAYER_MEDIA_BUFFER, { bufferPercent: Math.round(V) }) } } } function N(V) { if (!t) { return } if (e.exists(V) && e.exists(V.target)) { if (x > 0) { if (!isNaN(V.target.duration) && (isNaN(j.duration) || j.duration < 1)) { if (V.target.duration == Infinity) { j.duration = 0 } else { j.duration = Math.round(V.target.duration * 10) / 10 } } } if (!C && m.readyState > 0) { w(b.api.events.state.PLAYING) } if (f == b.api.events.state.PLAYING) { if (m.readyState > 0 && (M > -1 || !C)) { C = true; try { if (m.currentTime != M && M > -1) { m.currentTime = M; M = -1 } } catch (U) { } m.volume = j.volume / 100; m.muted = j.mute } j.position = j.duration > 0 ? (Math.round(V.target.currentTime * 10) / 10) : 0; s(b.api.events.JWPLAYER_MEDIA_TIME, { position: j.position, duration: j.duration }); if (j.position >= j.duration && (j.position > 0 || j.duration > 0)) { O(); return } } } D(V) } function g(U) { } function p(U) { if (!t) { return } if (d[U.type]) { if (U.type == "ended") { O() } else { w(d[U.type]) } } } function u(V) { if (!t) { return } var U = Math.round(m.duration * 10) / 10; var W = { height: m.videoHeight, width: m.videoWidth, duration: U }; if (!x) { if ((j.duration < U || isNaN(j.duration)) && m.duration != Infinity) { j.duration = U } } s(b.api.events.JWPLAYER_MEDIA_META, { metadata: W }) } function o(W) { if (!t) { return } if (f == b.api.events.state.IDLE) { return } var V = "There was an error: "; if ((W.target.error && W.target.tagName.toLowerCase() == "video") || W.target.parentNode.error && W.target.parentNode.tagName.toLowerCase() == "video") { var U = !e.exists(W.target.error) ? W.target.parentNode.error : W.target.error; switch (U.code) { case U.MEDIA_ERR_ABORTED: e.log("User aborted the video playback."); return; case U.MEDIA_ERR_NETWORK: V = "A network error caused the video download to fail part-way: "; break; case U.MEDIA_ERR_DECODE: V = "The video playback was aborted due to a corruption problem or because the video used features your browser did not support: "; break; case U.MEDIA_ERR_SRC_NOT_SUPPORTED: V = "The video could not be loaded, either because the server or network failed or because the format is not supported: "; break; default: V = "An unknown error occurred: "; break } } else { if (W.target.tagName.toLowerCase() == "source") { Q--; if (Q > 0) { return } if (e.userAgentMatch(/firefox/i)) { e.log("The video could not be loaded, either because the server or network failed or because the format is not supported."); z(false); return } else { V = "The video could not be loaded, either because the server or network failed or because the format is not supported: " } } else { e.log("An unknown error occurred.  Continuing..."); return } } z(false); V += S(); _error = true; s(b.api.events.JWPLAYER_ERROR, { message: V }); return } function S() { var W = ""; for (var V in T.levels) { var U = T.levels[V]; var X = B.ownerDocument.createElement("source"); W += b.utils.getAbsolutePath(U.file); if (V < (T.levels.length - 1)) { W += ", " } } return W } function A() { if (!e.exists(E)) { E = setInterval(function () { D() }, 100) } } function r() { clearInterval(E); E = null } function O() { if (f == b.api.events.state.PLAYING) { z(false); s(b.api.events.JWPLAYER_MEDIA_BEFORECOMPLETE); s(b.api.events.JWPLAYER_MEDIA_COMPLETE) } } function k(U) { if (e.exists(m.webkitDisplayingFullscreen)) { if (j.fullscreen && !m.webkitDisplayingFullscreen) { s(b.api.events.JWPLAYER_FULLSCREEN, { fullscreen: false }, true) } } } function q(W) { if (W.length > 0 && e.userAgentMatch(/Safari/i)) { var U = -1; for (var V = 0; V < W.length; V++) { switch (e.extension(W[V].file)) { case "mp4": if (U < 0) { U = V } break; case "webm": W.splice(V, 1); break } } if (U > 0) { var X = W.splice(U, 1)[0]; W.unshift(X) } } } function P() { setTimeout(function () { m.setAttribute("controls", "controls") }, 100) } function v() { setTimeout(function () { m.removeAttribute("controls") }, 250) } function s(U, W, V) { if (t || V) { if (W) { K.sendEvent(U, W) } else { K.sendEvent(U) } } } } })(jwplayer); (function (a) { var c = { ended: a.api.events.state.IDLE, playing: a.api.events.state.PLAYING, pause: a.api.events.state.PAUSED, buffering: a.api.events.state.BUFFERING }; var b = a.utils.css; a.html5.mediayoutube = function (j, e) { var f = new a.html5.eventdispatcher(); a.utils.extend(this, f); var l = j; var h = document.getElementById(e.id); var g = a.api.events.state.IDLE; var n, m; function k(p) { if (g != p) { var q = g; l.state = p; g = p; f.sendEvent(a.api.events.JWPLAYER_PLAYER_STATE, { oldstate: q, newstate: p }) } } this.getDisplayElement = this.detachMedia = function () { return h }; this.attachMedia = function () { }; this.play = function () { if (g == a.api.events.state.IDLE) { f.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER, { bufferPercent: 100 }); f.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL); k(a.api.events.state.PLAYING) } else { if (g == a.api.events.state.PAUSED) { k(a.api.events.state.PLAYING) } } }; this.pause = function () { k(a.api.events.state.PAUSED) }; this.seek = function (p) { }; this.stop = function (p) { if (!_utils.exists(p)) { p = true } l.position = 0; k(a.api.events.state.IDLE); if (p) { b(h, { display: "none" }) } }; this.volume = function (p) { l.setVolume(p); f.sendEvent(a.api.events.JWPLAYER_MEDIA_VOLUME, { volume: Math.round(p) }) }; this.mute = function (p) { h.muted = p; f.sendEvent(a.api.events.JWPLAYER_MEDIA_MUTE, { mute: p }) }; this.resize = function (q, p) { if (q * p > 0 && n) { n.width = m.width = q; n.height = m.height = p } }; this.fullscreen = function (p) { if (p === true) { this.resize("100%", "100%") } else { this.resize(l.config.width, l.config.height) } }; this.load = function (p) { o(p); b(n, { display: "block" }); k(a.api.events.state.BUFFERING); f.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER, { bufferPercent: 0 }); f.sendEvent(a.api.events.JWPLAYER_MEDIA_LOADED); this.play() }; this.hasChrome = function () { return (g != a.api.events.state.IDLE) }; function o(v) { var s = v.levels[0].file; s = ["http://www.youtube.com/v/", d(s), "&amp;hl=en_US&amp;fs=1&autoplay=1"].join(""); n = document.createElement("object"); n.id = h.id; n.style.position = "absolute"; var u = { movie: s, allowfullscreen: "true", allowscriptaccess: "always" }; for (var p in u) { var t = document.createElement("param"); t.name = p; t.value = u[p]; n.appendChild(t) } m = document.createElement("embed"); n.appendChild(m); var q = { src: s, type: "application/x-shockwave-flash", allowfullscreen: "true", allowscriptaccess: "always", width: n.width, height: n.height }; for (var r in q) { m.setAttribute(r, q[r]) } n.appendChild(m); n.style.zIndex = 2147483000; if (h != n && h.parentNode) { h.parentNode.replaceChild(n, h) } h = n } function d(q) { var p = q.split(/\?|\#\!/); var s = ""; for (var r = 0; r < p.length; r++) { if (p[r].substr(0, 2) == "v=") { s = p[r].substr(2) } } if (s == "") { if (q.indexOf("/v/") >= 0) { s = q.substr(q.indexOf("/v/") + 3) } else { if (q.indexOf("youtu.be") >= 0) { s = q.substr(q.indexOf("youtu.be/") + 9) } else { s = q } } } if (s.indexOf("?") > -1) { s = s.substr(0, s.indexOf("?")) } if (s.indexOf("&") > -1) { s = s.substr(0, s.indexOf("&")) } return s } this.embed = m; return this } })(jwplayer); (function (jwplayer) { var _configurableStateVariables = ["width", "height", "start", "duration", "volume", "mute", "fullscreen", "item", "plugins", "stretching"]; var _utils = jwplayer.utils; jwplayer.html5.model = function (api, container, options) { var _api = api; var _container = container; var _cookies = _utils.getCookies(); var _model = { id: _container.id, playlist: [], state: jwplayer.api.events.state.IDLE, position: 0, buffer: 0, container: _container, config: { width: 480, height: 320, item: -1, skin: undefined, file: undefined, image: undefined, start: 0, duration: 0, bufferlength: 5, volume: _cookies.volume ? _cookies.volume : 90, mute: _cookies.mute && _cookies.mute.toString().toLowerCase() == "true" ? true : false, fullscreen: false, repeat: "", stretching: jwplayer.utils.stretching.UNIFORM, autostart: false, debug: undefined, screencolor: undefined} }; var _media; var _eventDispatcher = new jwplayer.html5.eventdispatcher(); var _components = ["display", "logo", "controlbar", "playlist", "dock"]; jwplayer.utils.extend(_model, _eventDispatcher); for (var option in options) { if (typeof options[option] == "string") { var type = /color$/.test(option) ? "color" : null; options[option] = jwplayer.utils.typechecker(options[option], type) } var config = _model.config; var path = option.split("."); for (var edge in path) { if (edge == path.length - 1) { config[path[edge]] = options[option] } else { if (!jwplayer.utils.exists(config[path[edge]])) { config[path[edge]] = {} } config = config[path[edge]] } } } for (var index in _configurableStateVariables) { var configurableStateVariable = _configurableStateVariables[index]; _model[configurableStateVariable] = _model.config[configurableStateVariable] } var pluginorder = _components.concat([]); if (jwplayer.utils.exists(_model.plugins)) { if (typeof _model.plugins == "string") { var userplugins = _model.plugins.split(","); for (var userplugin in userplugins) { if (typeof userplugins[userplugin] == "string") { pluginorder.push(userplugins[userplugin].replace(/^\s+|\s+$/g, "")) } } } } if (jwplayer.utils.isMobile()) { pluginorder = ["display", "logo", "dock", "playlist"]; if (!jwplayer.utils.exists(_model.config.repeat)) { _model.config.repeat = "list" } } else { if (_model.config.chromeless) { pluginorder = ["logo", "dock", "playlist"]; if (!jwplayer.utils.exists(_model.config.repeat)) { _model.config.repeat = "list" } } } _model.plugins = { order: pluginorder, config: {}, object: {} }; if (typeof _model.config.components != "undefined") { for (var component in _model.config.components) { _model.plugins.config[component] = _model.config.components[component] } } var playlistVisible = false; for (var pluginIndex in _model.plugins.order) { var pluginName = _model.plugins.order[pluginIndex]; var pluginConfig = !jwplayer.utils.exists(_model.plugins.config[pluginName]) ? {} : _model.plugins.config[pluginName]; _model.plugins.config[pluginName] = !jwplayer.utils.exists(_model.plugins.config[pluginName]) ? pluginConfig : jwplayer.utils.extend(_model.plugins.config[pluginName], pluginConfig); if (!jwplayer.utils.exists(_model.plugins.config[pluginName].position)) { if (pluginName == "playlist") { _model.plugins.config[pluginName].position = jwplayer.html5.view.positions.NONE } else { _model.plugins.config[pluginName].position = jwplayer.html5.view.positions.OVER } } else { if (pluginName == "playlist") { playlistVisible = true } _model.plugins.config[pluginName].position = _model.plugins.config[pluginName].position.toString().toUpperCase() } } if (_model.plugins.config.controlbar && playlistVisible) { _model.plugins.config.controlbar.hideplaylistcontrols = true } if (typeof _model.plugins.config.dock != "undefined") { if (typeof _model.plugins.config.dock != "object") { var position = _model.plugins.config.dock.toString().toUpperCase(); _model.plugins.config.dock = { position: position} } if (typeof _model.plugins.config.dock.position != "undefined") { _model.plugins.config.dock.align = _model.plugins.config.dock.position; _model.plugins.config.dock.position = jwplayer.html5.view.positions.OVER } if (typeof _model.plugins.config.dock.idlehide == "undefined") { try { _model.plugins.config.dock.idlehide = _model.plugins.config.controlbar.idlehide } catch (e) { } } } function _loadExternal(playlistfile) { var loader = new jwplayer.html5.playlistloader(); loader.addEventListener(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED, function (evt) { _model.playlist = new jwplayer.html5.playlist(evt); _loadComplete(true) }); loader.addEventListener(jwplayer.api.events.JWPLAYER_ERROR, function (evt) { _model.playlist = new jwplayer.html5.playlist({ playlist: [] }); _loadComplete(false) }); loader.load(playlistfile) } function _loadComplete() { if (_model.config.shuffle) { _model.item = _getShuffleItem() } else { if (_model.config.item >= _model.playlist.length) { _model.config.item = _model.playlist.length - 1 } else { if (_model.config.item < 0) { _model.config.item = 0 } } _model.item = _model.config.item } _model.position = 0; _model.duration = _model.playlist.length > 0 ? _model.playlist[_model.item].duration : 0; _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED, { playlist: _model.playlist }); _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_ITEM, { index: _model.item }) } _model.loadPlaylist = function (arg) { var input; if (typeof arg == "string") { if (arg.indexOf("[") == 0 || arg.indexOf("{") == "0") { try { input = eval(arg) } catch (err) { input = arg } } else { input = arg } } else { input = arg } var config; switch (jwplayer.utils.typeOf(input)) { case "object": config = input; break; case "array": config = { playlist: input }; break; default: config = { file: input }; break } _model.playlist = new jwplayer.html5.playlist(config); _model.item = _model.config.item >= 0 ? _model.config.item : 0; if (!_model.playlist[0].provider && _model.playlist[0].file) { _loadExternal(_model.playlist[0].file) } else { _loadComplete() } }; function _getShuffleItem() { var result = null; if (_model.playlist.length > 1) { while (!jwplayer.utils.exists(result)) { result = Math.floor(Math.random() * _model.playlist.length); if (result == _model.item) { result = null } } } else { result = 0 } return result } function forward(evt) { switch (evt.type) { case jwplayer.api.events.JWPLAYER_MEDIA_LOADED: _container = _media.getDisplayElement(); break; case jwplayer.api.events.JWPLAYER_MEDIA_MUTE: this.mute = evt.mute; break; case jwplayer.api.events.JWPLAYER_MEDIA_VOLUME: this.volume = evt.volume; break } _eventDispatcher.sendEvent(evt.type, evt) } var _mediaProviders = {}; _model.setActiveMediaProvider = function (playlistItem) { if (playlistItem.provider == "audio") { playlistItem.provider = "sound" } var provider = playlistItem.provider; var current = _media ? _media.getDisplayElement() : null; if (provider == "sound" || provider == "http" || provider == "") { provider = "video" } if (!jwplayer.utils.exists(_mediaProviders[provider])) { switch (provider) { case "video": _media = new jwplayer.html5.mediavideo(_model, current ? current : _container); break; case "youtube": _media = new jwplayer.html5.mediayoutube(_model, current ? current : _container); break } if (!jwplayer.utils.exists(_media)) { return false } _media.addGlobalListener(forward); _mediaProviders[provider] = _media } else { if (_media != _mediaProviders[provider]) { if (_media) { _media.stop() } _media = _mediaProviders[provider] } } return true }; _model.getMedia = function () { return _media }; _model.seek = function (pos) { _eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_MEDIA_SEEK, { position: _model.position, offset: pos }); return _media.seek(pos) }; _model.setVolume = function (newVol) { _utils.saveCookie("volume", newVol); _model.volume = newVol }; _model.setMute = function (state) { _utils.saveCookie("mute", state); _model.mute = state }; _model.setupPlugins = function () { if (!jwplayer.utils.exists(_model.plugins) || !jwplayer.utils.exists(_model.plugins.order) || _model.plugins.order.length == 0) { jwplayer.utils.log("No plugins to set up"); return _model } for (var i = 0; i < _model.plugins.order.length; i++) { try { var pluginName = _model.plugins.order[i]; if (jwplayer.utils.exists(jwplayer.html5[pluginName])) { if (pluginName == "playlist") { _model.plugins.object[pluginName] = new jwplayer.html5.playlistcomponent(_api, _model.plugins.config[pluginName]) } else { _model.plugins.object[pluginName] = new jwplayer.html5[pluginName](_api, _model.plugins.config[pluginName]) } } else { _model.plugins.order.splice(plugin, plugin + 1) } if (typeof _model.plugins.object[pluginName].addGlobalListener == "function") { _model.plugins.object[pluginName].addGlobalListener(forward) } } catch (err) { jwplayer.utils.log("Could not setup " + pluginName) } } }; return _model } })(jwplayer); (function (a) { a.html5.playlist = function (b) { var d = []; if (b.playlist && b.playlist instanceof Array && b.playlist.length > 0) { for (var c in b.playlist) { if (!isNaN(parseInt(c))) { d.push(new a.html5.playlistitem(b.playlist[c])) } } } else { d.push(new a.html5.playlistitem(b)) } return d } })(jwplayer); (function (a) { var c = { size: 180, position: a.html5.view.positions.NONE, itemheight: 60, thumbs: true, fontcolor: "#000000", overcolor: "", activecolor: "", backgroundcolor: "#f8f8f8", font: "_sans", fontsize: "", fontstyle: "", fontweight: "" }; var b = { _sans: "Arial, Helvetica, sans-serif", _serif: "Times, Times New Roman, serif", _typewriter: "Courier New, Courier, monospace" }; _utils = a.utils; _css = _utils.css; _hide = function (d) { _css(d, { display: "none" }) }; _show = function (d) { _css(d, { display: "block" }) }; a.html5.playlistcomponent = function (r, C) { var x = r; var e = a.utils.extend({}, c, x.skin.getComponentSettings("playlist"), C); if (e.position == a.html5.view.positions.NONE || typeof a.html5.view.positions[e.position] == "undefined") { return } var y; var l; var D; var d; var g; var f; var k = -1; var h = { background: undefined, item: undefined, itemOver: undefined, itemImage: undefined, itemActive: undefined }; this.getDisplayElement = function () { return y }; this.resize = function (G, E) { l = G; D = E; if (x.jwGetFullscreen()) { _hide(y) } else { var F = { display: "block", width: l, height: D }; _css(y, F) } }; this.show = function () { _show(y) }; this.hide = function () { _hide(y) }; function j() { y = document.createElement("div"); y.id = x.id + "_jwplayer_playlistcomponent"; y.style.overflow = "hidden"; switch (e.position) { case a.html5.view.positions.RIGHT: case a.html5.view.positions.LEFT: y.style.width = e.size + "px"; break; case a.html5.view.positions.TOP: case a.html5.view.positions.BOTTOM: y.style.height = e.size + "px"; break } B(); if (h.item) { e.itemheight = h.item.height } y.style.backgroundColor = "#C6C6C6"; x.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, s); x.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM, v); x.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE, m) } function p() { var E = document.createElement("ul"); _css(E, { width: y.style.width, minWidth: y.style.width, height: y.style.height, backgroundColor: e.backgroundcolor, backgroundImage: h.background ? "url(" + h.background.src + ")" : "", color: e.fontcolor, listStyle: "none", margin: 0, padding: 0, fontFamily: b[e.font] ? b[e.font] : b._sans, fontSize: (e.fontsize ? e.fontsize : 11) + "px", fontStyle: e.fontstyle, fontWeight: e.fontweight, overflowY: "auto" }); return E } function z(E) { return function () { var F = f.getElementsByClassName("item")[E]; var G = e.fontcolor; var H = h.item ? "url(" + h.item.src + ")" : ""; if (E == x.jwGetPlaylistIndex()) { if (e.activecolor !== "") { G = e.activecolor } if (h.itemActive) { H = "url(" + h.itemActive.src + ")" } } _css(F, { color: e.overcolor !== "" ? e.overcolor : G, backgroundImage: h.itemOver ? "url(" + h.itemOver.src + ")" : H }) } } function o(E) { return function () { var F = f.getElementsByClassName("item")[E]; var G = e.fontcolor; var H = h.item ? "url(" + h.item.src + ")" : ""; if (E == x.jwGetPlaylistIndex()) { if (e.activecolor !== "") { G = e.activecolor } if (h.itemActive) { H = "url(" + h.itemActive.src + ")" } } _css(F, { color: G, backgroundImage: H }) } } function q(J) { var Q = d[J]; var P = document.createElement("li"); P.className = "item"; _css(P, { height: e.itemheight, display: "block", cursor: "pointer", backgroundImage: h.item ? "url(" + h.item.src + ")" : "", backgroundSize: "100% " + e.itemheight + "px" }); P.onmouseover = z(J); P.onmouseout = o(J); var K = document.createElement("div"); var G = new Image(); var L = 0; var M = 0; var N = 0; if (w() && (Q.image || Q["playlist.image"] || h.itemImage)) { G.className = "image"; if (h.itemImage) { L = (e.itemheight - h.itemImage.height) / 2; M = h.itemImage.width; N = h.itemImage.height } else { M = e.itemheight * 4 / 3; N = e.itemheight } _css(K, { height: N, width: M, "float": "left", styleFloat: "left", cssFloat: "left", margin: "0 5px 0 0", background: "black", overflow: "hidden", margin: L + "px", position: "relative" }); _css(G, { position: "relative" }); K.appendChild(G); G.onload = function () { a.utils.stretch(a.utils.stretching.FILL, G, M, N, this.naturalWidth, this.naturalHeight) }; if (Q["playlist.image"]) { G.src = Q["playlist.image"] } else { if (Q.image) { G.src = Q.image } else { if (h.itemImage) { G.src = h.itemImage.src } } } P.appendChild(K) } var F = l - M - L * 2; if (D < e.itemheight * d.length) { F -= 15 } var E = document.createElement("div"); _css(E, { position: "relative", height: "100%", overflow: "hidden" }); var H = document.createElement("span"); if (Q.duration > 0) { H.className = "duration"; _css(H, { fontSize: (e.fontsize ? e.fontsize : 11) + "px", fontWeight: (e.fontweight ? e.fontweight : "bold"), width: "40px", height: e.fontsize ? e.fontsize + 10 : 20, lineHeight: 24, "float": "right", styleFloat: "right", cssFloat: "right" }); H.innerHTML = _utils.timeFormat(Q.duration); E.appendChild(H) } var O = document.createElement("span"); O.className = "title"; _css(O, { padding: "5px 5px 0 " + (L ? 0 : "5px"), height: e.fontsize ? e.fontsize + 10 : 20, lineHeight: e.fontsize ? e.fontsize + 10 : 20, overflow: "hidden", "float": "left", styleFloat: "left", cssFloat: "left", width: ((Q.duration > 0) ? F - 50 : F) - 10 + "px", fontSize: (e.fontsize ? e.fontsize : 13) + "px", fontWeight: (e.fontweight ? e.fontweight : "bold") }); O.innerHTML = Q ? Q.title : ""; E.appendChild(O); if (Q.description) { var I = document.createElement("span"); I.className = "description"; _css(I, { display: "block", "float": "left", styleFloat: "left", cssFloat: "left", margin: 0, paddingLeft: O.style.paddingLeft, paddingRight: O.style.paddingRight, lineHeight: (e.fontsize ? e.fontsize + 4 : 16) + "px", overflow: "hidden", position: "relative" }); I.innerHTML = Q.description; E.appendChild(I) } P.appendChild(E); return P } function s(F) { y.innerHTML = ""; d = t(); if (!d) { return } items = []; f = p(); for (var G = 0; G < d.length; G++) { var E = q(G); E.onclick = A(G); f.appendChild(E); items.push(E) } k = x.jwGetPlaylistIndex(); o(k)(); y.appendChild(f); if (_utils.isIOS() && window.iScroll) { f.style.height = e.itemheight * d.length + "px"; var H = new iScroll(y.id) } } function t() { var F = x.jwGetPlaylist(); var G = []; for (var E = 0; E < F.length; E++) { if (!F[E]["ova.hidden"]) { G.push(F[E]) } } return G } function A(E) { return function () { x.jwPlaylistItem(E); x.jwPlay(true) } } function n() { f.scrollTop = x.jwGetPlaylistIndex() * e.itemheight } function w() { return e.thumbs.toString().toLowerCase() == "true" } function v(E) { if (k >= 0) { o(k)(); k = E.index } o(E.index)(); n() } function m() { if (e.position == a.html5.view.positions.OVER) { switch (x.jwGetState()) { case a.api.events.state.IDLE: _show(y); break; default: _hide(y); break } } } function B() { for (var E in h) { h[E] = u(E) } } function u(E) { return x.skin.getSkinElement("playlist", E) } j(); return this } })(jwplayer); (function (b) { b.html5.playlistitem = function (d) { var e = { author: "", date: "", description: "", image: "", link: "", mediaid: "", tags: "", title: "", provider: "", file: "", streamer: "", duration: -1, start: 0, currentLevel: -1, levels: [] }; var c = b.utils.extend({}, e, d); if (c.type) { c.provider = c.type; delete c.type } if (c.levels.length === 0) { c.levels[0] = new b.html5.playlistitemlevel(c) } if (!c.provider) { c.provider = a(c.levels[0]) } else { c.provider = c.provider.toLowerCase() } return c }; function a(e) { if (b.utils.isYouTube(e.file)) { return "youtube" } else { var f = b.utils.extension(e.file); var c; if (f && b.utils.extensionmap[f]) { if (f == "m3u8") { return "video" } c = b.utils.extensionmap[f].html5 } else { if (e.type) { c = e.type } } if (c) { var d = c.split("/")[0]; if (d == "audio") { return "sound" } else { if (d == "video") { return d } } } } return "" } })(jwplayer); (function (a) { a.html5.playlistitemlevel = function (b) { var d = { file: "", streamer: "", bitrate: 0, width: 0 }; for (var c in d) { if (a.utils.exists(b[c])) { d[c] = b[c] } } return d } })(jwplayer); (function (a) { a.html5.playlistloader = function () { var c = new a.html5.eventdispatcher(); a.utils.extend(this, c); this.load = function (e) { a.utils.ajax(e, d, b) }; function d(g) { var f = []; try { var f = a.utils.parsers.rssparser.parse(g.responseXML.firstChild); c.sendEvent(a.api.events.JWPLAYER_PLAYLIST_LOADED, { playlist: new a.html5.playlist({ playlist: f }) }) } catch (h) { b("Could not parse the playlist") } } function b(e) { c.sendEvent(a.api.events.JWPLAYER_ERROR, { message: e ? e : "Could not load playlist an unknown reason." }) } } })(jwplayer); (function (a) { a.html5.skin = function () { var b = {}; var c = false; this.load = function (d, e) { new a.html5.skinloader(d, function (f) { c = true; b = f; e() }, function () { new a.html5.skinloader("", function (f) { c = true; b = f; e() }) }) }; this.getSkinElement = function (d, e) { if (c) { try { return b[d].elements[e] } catch (f) { a.utils.log("No such skin component / element: ", [d, e]) } } return null }; this.getComponentSettings = function (d) { if (c && b && b[d]) { return b[d].settings } return null }; this.getComponentLayout = function (d) { if (c) { return b[d].layout } return null } } })(jwplayer); (function (a) { a.html5.skinloader = function (f, p, k) { var o = {}; var c = p; var l = k; var e = true; var j; var n = f; var s = false; function m() { if (typeof n != "string" || n === "") { d(a.html5.defaultSkin().xml) } else { a.utils.ajax(a.utils.getAbsolutePath(n), function (t) { try { if (a.utils.exists(t.responseXML)) { d(t.responseXML); return } } catch (u) { h() } d(a.html5.defaultSkin().xml) }, function (t) { d(a.html5.defaultSkin().xml) }) } } function d(y) { var E = y.getElementsByTagName("component"); if (E.length === 0) { return } for (var H = 0; H < E.length; H++) { var C = E[H].getAttribute("name"); var B = { settings: {}, elements: {}, layout: {} }; o[C] = B; var G = E[H].getElementsByTagName("elements")[0].getElementsByTagName("element"); for (var F = 0; F < G.length; F++) { b(G[F], C) } var z = E[H].getElementsByTagName("settings")[0]; if (z && z.childNodes.length > 0) { var K = z.getElementsByTagName("setting"); for (var P = 0; P < K.length; P++) { var Q = K[P].getAttribute("name"); var I = K[P].getAttribute("value"); var x = /color$/.test(Q) ? "color" : null; o[C].settings[Q] = a.utils.typechecker(I, x) } } var L = E[H].getElementsByTagName("layout")[0]; if (L && L.childNodes.length > 0) { var M = L.getElementsByTagName("group"); for (var w = 0; w < M.length; w++) { var A = M[w]; o[C].layout[A.getAttribute("position")] = { elements: [] }; for (var O = 0; O < A.attributes.length; O++) { var D = A.attributes[O]; o[C].layout[A.getAttribute("position")][D.name] = D.value } var N = A.getElementsByTagName("*"); for (var v = 0; v < N.length; v++) { var t = N[v]; o[C].layout[A.getAttribute("position")].elements.push({ type: t.tagName }); for (var u = 0; u < t.attributes.length; u++) { var J = t.attributes[u]; o[C].layout[A.getAttribute("position")].elements[v][J.name] = J.value } if (!a.utils.exists(o[C].layout[A.getAttribute("position")].elements[v].name)) { o[C].layout[A.getAttribute("position")].elements[v].name = t.tagName } } } } e = false; r() } } function r() { clearInterval(j); if (!s) { j = setInterval(function () { q() }, 100) } } function b(y, x) { var w = new Image(); var t = y.getAttribute("name"); var v = y.getAttribute("src"); var A; if (v.indexOf("data:image/png;base64,") === 0) { A = v } else { var u = a.utils.getAbsolutePath(n); var z = u.substr(0, u.lastIndexOf("/")); A = [z, x, v].join("/") } o[x].elements[t] = { height: 0, width: 0, src: "", ready: false, image: w }; w.onload = function (B) { g(w, t, x) }; w.onerror = function (B) { s = true; r(); l() }; w.src = A } function h() { for (var u in o) { var w = o[u]; for (var t in w.elements) { var x = w.elements[t]; var v = x.image; v.onload = null; v.onerror = null; delete x.image; delete w.elements[t] } delete o[u] } } function q() { for (var t in o) { if (t != "properties") { for (var u in o[t].elements) { if (!o[t].elements[u].ready) { return } } } } if (e === false) { clearInterval(j); c(o) } } function g(t, v, u) { if (o[u] && o[u].elements[v]) { o[u].elements[v].height = t.height; o[u].elements[v].width = t.width; o[u].elements[v].src = t.src; o[u].elements[v].ready = true; r() } else { a.utils.log("Loaded an image for a missing element: " + u + "." + v) } } m() } })(jwplayer); (function (a) { a.html5.api = function (c, p) { var n = {}; var g = document.createElement("div"); c.parentNode.replaceChild(g, c); g.id = c.id; n.version = a.version; n.id = g.id; var m = new a.html5.model(n, g, p); var k = new a.html5.view(n, g, m); var l = new a.html5.controller(n, g, m, k); n.skin = new a.html5.skin(); n.jwPlay = function (q) { if (typeof q == "undefined") { f() } else { if (q.toString().toLowerCase() == "true") { l.play() } else { l.pause() } } }; n.jwPause = function (q) { if (typeof q == "undefined") { f() } else { if (q.toString().toLowerCase() == "true") { l.pause() } else { l.play() } } }; function f() { if (m.state == a.api.events.state.PLAYING || m.state == a.api.events.state.BUFFERING) { l.pause() } else { l.play() } } n.jwStop = l.stop; n.jwSeek = l.seek; n.jwPlaylistItem = function (q) { if (d) { if (d.playlistClickable()) { d.jwInstreamDestroy(); return l.item(q) } } else { return l.item(q) } }; n.jwPlaylistNext = l.next; n.jwPlaylistPrev = l.prev; n.jwResize = l.resize; n.jwLoad = l.load; n.jwDetachMedia = l.detachMedia; n.jwAttachMedia = l.attachMedia; function j(q) { return function () { return m[q] } } function e(q, s, r) { return function () { var t = m.plugins.object[q]; if (t && t[s] && typeof t[s] == "function") { t[s].apply(t, r) } } } n.jwGetPlaylistIndex = j("item"); n.jwGetPosition = j("position"); n.jwGetDuration = j("duration"); n.jwGetBuffer = j("buffer"); n.jwGetWidth = j("width"); n.jwGetHeight = j("height"); n.jwGetFullscreen = j("fullscreen"); n.jwSetFullscreen = l.setFullscreen; n.jwGetVolume = j("volume"); n.jwSetVolume = l.setVolume; n.jwGetMute = j("mute"); n.jwSetMute = l.setMute; n.jwGetStretching = function () { return m.stretching.toUpperCase() }; n.jwGetState = j("state"); n.jwGetVersion = function () { return n.version }; n.jwGetPlaylist = function () { return m.playlist }; n.jwAddEventListener = l.addEventListener; n.jwRemoveEventListener = l.removeEventListener; n.jwSendEvent = l.sendEvent; n.jwDockSetButton = function (t, q, r, s) { if (m.plugins.object.dock && m.plugins.object.dock.setButton) { m.plugins.object.dock.setButton(t, q, r, s) } }; n.jwControlbarShow = e("controlbar", "show"); n.jwControlbarHide = e("controlbar", "hide"); n.jwDockShow = e("dock", "show"); n.jwDockHide = e("dock", "hide"); n.jwDisplayShow = e("display", "show"); n.jwDisplayHide = e("display", "hide"); var d; n.jwLoadInstream = function (r, q) { if (!d) { d = new a.html5.instream(n, m, k, l) } setTimeout(function () { d.load(r, q) }, 10) }; n.jwInstreamDestroy = function () { if (d) { d.jwInstreamDestroy() } }; n.jwInstreamAddEventListener = o("jwInstreamAddEventListener"); n.jwInstreamRemoveEventListener = o("jwInstreamRemoveEventListener"); n.jwInstreamGetState = o("jwInstreamGetState"); n.jwInstreamGetDuration = o("jwInstreamGetDuration"); n.jwInstreamGetPosition = o("jwInstreamGetPosition"); n.jwInstreamPlay = o("jwInstreamPlay"); n.jwInstreamPause = o("jwInstreamPause"); n.jwInstreamSeek = o("jwInstreamSeek"); function o(q) { return function () { if (d && typeof d[q] == "function") { return d[q].apply(this, arguments) } else { _utils.log("Could not call instream method - instream API not initialized") } } } n.jwGetLevel = function () { }; n.jwGetBandwidth = function () { }; n.jwGetLockState = function () { }; n.jwLock = function () { }; n.jwUnlock = function () { }; function b() { if (m.config.playlistfile) { m.addEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, h); m.loadPlaylist(m.config.playlistfile) } else { if (typeof m.config.playlist == "string") { m.addEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, h); m.loadPlaylist(m.config.playlist) } else { m.loadPlaylist(m.config); setTimeout(h, 25) } } } function h(q) { m.removeEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED, h); m.setupPlugins(); k.setup(); var q = { id: n.id, version: n.version }; l.playerReady(q) } if (m.config.chromeless && !a.utils.isIOS()) { b() } else { n.skin.load(m.config.skin, b) } return n } })(jwplayer) };

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    $("li.podcast_widget").each(function() {

        var pod = new PodCastWidget($(this));
        pod.setup();

    });

    //	Additional loop if we are using out different styling
    $("li.podcastContainer").each(function () {

        var pod = new PodCastWidget($(this));
        pod.setup();

    });

});



function PodCastWidget(WidgetContainer) {
    if ($(WidgetContainer).attr('id').length > 0) {
        this.Id = $(WidgetContainer).attr('id');
    }
    else {
        var id = $(WidgetContainer).attr('class').replace(' ', "_");
        this.Id = id;
    }
    //this.Id = $(WidgetContainer).attr('id');
    this.WidgetContainer = WidgetContainer;
    this.JWPlayer = jwplayer;  //CloneJWPlayer(jwplayer);
    this.audioIsCurrentlyPlaying = false;
    this.videoIsCurrentlyPlaying = false;
    var audioPlayerObj = WidgetContainer.find('#myFlash').attr('id', this.Id + 'myFlash');
    var mediaspaceObj = WidgetContainer.find('#mediaspace').attr('id', this.Id.replace(/ /g, '') + 'mediaspace');
};

function CloneJWPlayer(o) {
    return eval(uneval(o));
};


PodCastWidget.prototype.setup = function() {
    PodCastWidget.util.externalCategoryControls(this);

    var widget = this;
    var container = this.WidgetContainer;
    var podcastSection = container.find('div.podcastContainer');
    var tabLink = container.find('ul.podcastTabControls a');
    var playLink = container.find('a.playMedia');
    var nextAndPrevButtons = container.find('div.ContentFlow div.scrollbar div');

    //Transcript variables
    var transcripts = container.find('div.transcript');
    var transcriptContainer = container.find('div.transcriptContainer');
    var currentTranscriptContent = transcriptContainer.find('.transcriptContent');
    var viewCurrentTranscript = transcriptContainer.find('.transcriptContainer span.transcriptHeader');

    //Category variables
    var contentFlow = container.find('div.ContentFlow');
    var flowItem = contentFlow.find('a.item');
    var categoryItem = container.find('li.audioCategories');

    currentTranscriptContent.hide();
    transcriptContainer.find('span.transcriptHeader').remove();
    transcripts.hide();

    //if there's only 1 category. Hide the coverflow arrows
    if (categoryItem.length < 2) {
        podcastSection.find('div.ContentFlow .preButton').hide();
        podcastSection.find('div.ContentFlow .nextButton').hide();
    }

    playLink.unbind('click');
    playLink.removeClass("newWindow");

    playLink.click(function(e) {
        e.preventDefault();
        var shell = this;

        PodCastWidget.Transcript.reset(currentTranscriptContent); //resetToDefaults(currentTranscriptContent);
        PodCastWidget.Transcript.show(shell); //transcriptFunc(shell);
        PodCastWidget.util.whichSectionReact(widget, shell, playLink); //playStopFunc(shell);
        return false;
    });

    nextAndPrevButtons.click(function(e) {
        PodCastWidget.Transcript.reset(currentTranscriptContent);
    });

    //Tab Controls
    PodCastWidget.util.tabControls(this, tabLink, podcastSection, currentTranscriptContent, playLink); //tabShowHide(tabLink, podcastSection);

    //Category Controls
    tabFader(flowItem, categoryItem);
    flowItem.click(function(e) {
        e.preventDefault();
        currentTranscriptContent.slideUp();
        $('.audioTranscript span').slideUp();
    });
    PodCastWidget.Transcript.init(container);
    PodCastWidget.Flash.Video.init(this, false, false, null);
};

PodCastWidget.util = {
    //Workout which section we are in (audio or video) and react accordingly
    whichSectionReact: function(widget, context, playLink) {
        //var context = widget.WidgetContainer;
        if ($(context).parent().hasClass('cross')) {
            
            playLink.parent().removeClass('cross');
            var whichSection = $(context).parent().parent().parent().parent().parent().parent().attr('id');
            if (whichSection == 'audio') {
                PodCastWidget.Flash.Audio.stop(widget);
            } else {
                var jp = widget.JWPlayer;
                jp(widget.Id.replace(/ /g, '') + 'mediaspace').stop(); return false;
                //PodCastWidget.Flash.Video.stop();
            }
        } else {

            playLink.parent().removeClass('cross');
            $(context).parent().toggleClass('cross');
            var whichCrossSection = $(context).parent().parent().parent().parent().parent().parent().attr('id');
            if (whichCrossSection == 'audio') {
                PodCastWidget.Flash.Audio.play(widget, $(context).attr('href'));
            } else {
                PodCastWidget.Flash.Video.init(widget, $(context).attr('href'), PodCastWidget.Flash.Video.getPreviewPicturePath(context), true);
                widget.videoIsCurrentlyPlaying = true;
            }
        }
    },

    tabControls: function(widget) {


        var v = false, a = true;
        var container = widget.WidgetContainer;
        var tabTrigger = container.find('ul.podcastTabControls a');
        var playLink = container.find('a.playMedia');
        var tabSections = container.find('div.podcastContainer');
        var transcriptContainer = container.find('div.transcriptContainer');
        var content = transcriptContainer.find('.transcriptContent');

        tabSections.hide().filter(':first').show();
        tabTrigger.filter(':first').parent().addClass('active');

        tabTrigger.click(function(e) {
            e.preventDefault();
            var section = $(this).text();
            var shell = container.find(this.hash);
            //alert('section:' + section + '\nshell:' + shell + '\nhash:' + this.hash);
            if (section == "Video") {
                if (widget.audioIsCurrentlyPlaying == true) {
                    PodCastWidget.Flash.Audio.stop(widget);
                    a = widget.audioIsCurrentlyPlaying = false;
                }
                PodCastWidget.Flash.Video.init(widget, false, false, false);
                PodCastWidget.Transcript.reset(content);
                playLink.parent().removeClass('cross');
                v = widget.videoIsCurrentlyPlaying = true;

            } else if (section == "Audio") {
                if (widget.audioIsCurrentlyPlaying == true) {
                    widget.JWPlayer().stop();
                    v = widget.videoIsCurrentlyPlaying = false;
                }
                a = widget.audioIsCurrentlyPlaying = true;
            } else if (section == "External Media") {
                PodCastWidget.Flash.Video.init(widget, false, false, false);
                if (widget.audioIsCurrentlyPlaying == true) {
                    PodCastWidget.Flash.Audio.stop(widget);
                }
                else if (widget.audioIsCurrentlyPlaying == true) {
                    widget.JWPlayer().stop();
                    widget.videoIsCurrentlyPlaying == false;
                }
            }

            tabTrigger.parent().removeClass('active');
            $(this).parent().addClass('active');

            tabSections.hide();
            shell.show();

            return false;
        });
    },

    //Artificially create pagination
    paginationInit: function(widget) {
        var paginateContainers = widget.WidgetContainer.find('.paginateThis');
        $.each(paginateContainers, function(index, value) {
            this.paginate(widget, value, 10);
        });
    },

    //pass in container and how many items per page you wish to show at anyone time
    paginate: function(widget, container, itemsPerPage) {
        //var container = widget.WidgetContainer;
        var shell = $(container);
        var rowsPerPage = itemsPerPage;
        var rowsPerPageIndex = itemsPerPage - 1;
        var rows = shell.find('ul.pages li');
        var totalNumRows = rows.length;
        var totalPages = Math.ceil(totalNumRows / rowsPerPage); //always round up

        //if there's more than 1 page
        if (totalNumRows > rowsPerPage) {
            //hide all apart from the first set.
            rows.filter(':gt(' + rowsPerPageIndex + ')').hide();

            //add a list of pagination controls "1, 2, 3"
            var pagControls = "<ul class='podcastPagination fc pagControls'></ul>";
            shell.append(pagControls);

            //store the controls container in memory
            var pagControlsShell = shell.find('ul.pagControls');

            //for each number of pages, add an li and the number
            for (var i = 1; i <= totalPages; i++) {
                if (i == 1)
                    var thisListItem = "<li class='active'>" + i + "</li>";
                else
                    var thisListItem = "<li>" + i + "</li>";
                pagControlsShell.append(thisListItem);
            }

            var controlItem = pagControlsShell.find('li');

            controlItem.click(function() {
                var thus = $(this);
                var thisIndex = thus.text(); //1
                var end = thisIndex * rowsPerPage; //1 * 2 = 2
                var start = end - rowsPerPage; //2 - 2 = 0

                thus.parent().children().removeClass("active");
                thus.addClass("active");

                rows.hide();
                rows.slice(start, end).show();
            });
        }
    },

    //make an array based on category length, keep track of current position and hide and show when clicked
    externalCategoryControls: function(widget) {
        var cfItems = widget.WidgetContainer.find('div.ContentFlow a.item');
        var items = jQuery.makeArray(cfItems);
        var currentPosition = 1;
        var context = widget.WidgetContainer;
        var previous = context.find('div.scrollbar div.preButton');
        var next = context.find('div.scrollbar div.nextButton');

        previous.click(function() {
            if (currentPosition <= 1) {
                currentPosition = items.length;
            } else {
                currentPosition = --currentPosition;
            }
            //PodCastWidget.util.showCurrentPodcastCat(widget, currentPosition)
            var thisCat = '#audioCategory' + currentPosition;
            var podcastCats = widget.WidgetContainer.find('ul.audioLinks li.audioCategories').hide();
            $(widget.WidgetContainer.find(thisCat)).show()
        });

        next.click(function() {
            if (currentPosition >= items.length) {
                currentPosition = 1;
            } else {
                currentPosition = ++currentPosition;
            }
            //PodCastWidget.util.showCurrentPodcastCat(widget, currentPosition)
            var thisCat = '#audioCategory' + currentPosition;
            var podcastCats = widget.WidgetContainer.find('ul.audioLinks li.audioCategories').hide();
            $(widget.WidgetContainer.find(thisCat)).show()
        });
    },

    //hide and show category based on what int is fed in
    showCurrentPodcastCat: function(widget, catIndex) {
        var thisCat = '#audioCategory' + catIndex;
        var podcastCats = widget.WidgetContainer.find('ul.audioLinks li.audioCategories').hide();
        $(widget.WidgetContainer.find(thisCat)).show()
    },

    intNegToPos: function(n) {
        if (n < 0) {
            return n * -1;
        } else {
            return n;
        }
    },

    intPosToNeg: function(n) {
        if (n > 0) {
            return n * -1;
        } else {
            return n;
        }
    }
};

PodCastWidget.Flash = {

    Audio: {
        play: function(widget, file) {

            document.getElementById(widget.Id + "myFlash").SetVariable("player:jsUrl", file);
            document.getElementById(widget.Id + "myFlash").SetVariable("player:jsPlay", "");
            widget.audioIsCurrentlyPlaying = true;

        },
        stop: function(widget) {
            var myFlash = document.getElementById(widget.Id + "myFlash");
            myFlash.SetVariable("player:jsStop", "");
            widget.audioIsCurrentlyPlaying = false;
        }
    },

    Video: {
        init: function(widget, videoFile, newPreviewImage, play) {
            var previewImage, mediaspace, mediaHeight, mediaWidth, firstFile;
            var container = widget.WidgetContainer;
            widget.videoIsCurrentlyPlaying = true;

            mediaspace = container.find('.podcastTabControls');
            mediaWidth = mediaspace.width();
            mediaHeight = parseInt(mediaWidth) / 2


            if (container.find('div#videoPlayer').length) {

                if (!videoFile) { firstFile = container.find('.videoLinks a.playMedia').attr('href'); } else { firstFile = videoFile; }
                if (!newPreviewImage) { previewImage = container.find('.videoLinks span.hide:first').text(); } else { previewImage = newPreviewImage; }
                var jp = widget.JWPlayer;
                jp(widget.Id.replace(/ /g, '') + 'mediaspace').setup({
                    flashplayer: "/WidgetResources/portal/video/player.swf",
                    file: firstFile,
                    height: mediaHeight,
                    width: mediaWidth,
                    image: previewImage,
                    autostart: play,
                    controlbar: "bottom"
                });

            }
        },
        stop: function(widget) {
            var jp = widget.JWPlayer;
            jp(this.Id.replace(/ /g, '')).stop();
            widget.videoIsCurrentlyPlaying = false;
        },
        getPreviewPicturePath: function(that) {
            var imagePath, paramArr, image;
            return imagePath = $(that).parent().find('.hide').text();
        }
    }

};

PodCastWidget.Transcript = {
    init: function(context) {
        var thisContainer = context.find('.audioTranscript');
        var thisContent = context.find('.transcriptContent');
        var firstTranscript = context.find('ul.audioLinks li#audioCategory1 ul.pages li div.transcript:first').text();
        var firstTranscriptHead = context.find('ul.audioLinks li#audioCategory1 h5 span.fl:first').text();
        var tempTrigger;

        if (!firstTranscriptHead) {
            thisContainer = context.find('.videoTranscript');
            firstTranscriptHead = context.find('ul.videoLinks span.titleHeader:first').text();
            firstTranscript = context.find('ul.videoLinks div.transcript:first').text();
        }

        tempTrigger = '<span class="transcriptHeader">View <strong>' + firstTranscriptHead + '</strong> transcript</span>';

        thisContainer.prepend(tempTrigger);
        thisContent.empty().append(firstTranscript);

        thisContainer.find('.transcriptHeader').click(function() {
            var that = $(this);
            that.toggleClass('active');
            that.next('div').slideToggle();
        });
    },

    reset: function(content) {
        content.filter(':visible').slideUp().empty();
        $('.transcriptContainer span.transcriptHeader').remove();
    },

    show: function(context) {
        var thisContainer = $(context).closest('.podcastContainer').find('.transcriptContainer');
        var thisContent = thisContainer.find('.transcriptContent');

        var transcriptHeader = $(context).html();
        //the line below throws an error in all IE's when using .trim()

        var tempTranscript = $(context).closest('li').find('.transcript').html();

        if (tempTranscript !== "") {
            var tempTrigger = '<span class="transcriptHeader">View <strong>' + transcriptHeader + '</strong> transcript</span>';

            thisContainer.prepend(tempTrigger);
            thisContent.empty().append(tempTranscript);
        }

        $('.transcriptContainer span.transcriptHeader').click(function() {
            var that = $(this);
            that.toggleClass('active');
            that.next('div').slideToggle();
        });
    }
};

$(function() {
    //contentPathwaysWidget();
    initContentPathwaysWidget();
    showHideAtoZ();
    showAll();
});

function initContentPathwaysWidget() {
    $("li.pathways_widget").each(function() {
        contentPathwaysWidget($(this));
    });
}

function contentPathwaysWidget(bpw) {
    var pathwaysTriggers = bpw.find('.pathwaysTriggers a');
    var pathwaysContent = bpw.find('.pathwaysContent');
    pathwaysSwitcher(pathwaysTriggers, pathwaysContent);
}

//Global Tab functionality - using fading
function pathwaysSwitcher(tabTrigger, tabSetions) {
    tabSetions.hide().filter(':first').show();
    tabTrigger.filter(':first').parent().addClass('active');

    tabTrigger.click(function() {
        var them = $(this.hash);

        tabTrigger.parent().removeClass('active');
        $(this).parent().addClass('active');

        tabSetions.filter(':visible').hide();
        them.show();

        return false
    });
}

function showHideAtoZ() {

    $('ul .atozList a').click(function() {
        $('#atozTitles div').each(function(index) {
            $(this).hide();
        });

        var letter = $(this).attr('href');
        $(letter).show();
    });
}

function showAll() {

    $('ul .atozList a').click(function() {

        var letter = $(this).attr('href');

        if (letter == "#all") {
            $('#atozTitles div').each(function(index) {
                $(this).show();
            });
        }
    });
}

$(document).ready(function () {
    $('ul.feature-carousel').each(function () {
        var panelPager = new PanelPager($(this));
    });

});

function PanelPager(featurePager) {
    var _panels = {}; // Private variable to store our panels
    var _visiblePanels = 3;
    var _containerwidth = featurePager.width();
    var _panelPager = this;
    var _panelWidth; // Private variable to store the width of our panels

    if (_containerwidth == 662) {
        _panelWidth = 197;
    } else {
        _panelWidth = 218;
    }

    this.init = function () {
        //var _featurePager = function () { return $('ul#feature-carousel') } (); // Parent element allowing one hit to the DOM

        _panels = featurePager.children('li:gt(1)'); // Store our panels gt(1) misses out actions

        if (_panels.length > _visiblePanels) {
            featurePager.removeClass("no-pager");
            _panels.css('position', 'absolute');

            /* Do not set the panel width based on the first <li>
            This is how it used to work but it's broken, hence the change to it being explicitly set */

            //_panelWidth = _panels[0].clientWidth; // Set our panel width to be the first panel (assumption all panels are the same width)

            var _leftPosition = featurePager.children('li').first().width(); // Set the initial position

            // Iterate our panels and set the left value, would've shortend this ('left','+=') but I didn't want to increment on the first itme
            _panels.each(function (i) {
                $(this).css('left', _leftPosition);
                $(this).css('width', _panelWidth);
                _leftPosition = _leftPosition + _panelWidth;
            });

            // Setup pager actions

            featurePager.find('li.action').css('display', 'block')
                .find('a.pager-prev')
                .bind('click', function (e) {
                    _panelPager.moveRight();
                    e.preventDefault();
                })
                .end()
                .find('a.pager-next')
                .bind('click', function (e) {
                    _panelPager.moveLeft();
                    e.preventDefault();
                });
        }
        else {
            featurePager.find('li.action').remove();
            featurePager.width('auto');
            var availableWidth = featurePager.width() - 4;
            _panelWidth = Math.floor(availableWidth / _visiblePanels);
            _panels.width(_panelWidth);
        }

    } ();

        this.currentStartIndex = 0;

        this.currentEndIndex = 4;

        if (_containerwidth == 620)
            this.currentEndIndex = 3;
        if (_containerwidth == 960)
            this.currentEndIndex = 4;
       

        this.moving= false;
        this.display= function (displayType) {
            var display = displayType || "absolute";

            _panels.css({ "position": display });
        };
        this.moveLeft = function () {
            if (!this.moving) {
                this.moving = true;
                // This used to compare against _panels.length - 1 so it was
                // broken. It now compares against _panels.length and works.
                if (this.currentEndIndex <= (_panels.length)) {
                    this.currentStartIndex = this.currentStartIndex + 1;
                    this.currentEndIndex = this.currentEndIndex + 1;

                    _panels.animate({ 'left': '-=' + _panelWidth }, function () { _panelPager.moving = false; });
                }
                else {
                    _panels.animate({ 'left': '-=30' }, 100, function () { $(this).animate({ 'left': '+=30' }); _panelPager.moving = false; });
                }
            }
        };
        this.moveRight = function () {
            if (!this.moving) {
                this.moving = true;
                if (this.currentStartIndex !== 0) {
                    this.currentStartIndex = this.currentStartIndex - 1;
                    this.currentEndIndex = this.currentEndIndex - 1;

                    _panels.animate({ 'left': '+=' + _panelWidth }, function () { _panelPager.moving = false; });
                }
                else {
                    _panels.animate({ 'left': '+=30' }, 100, function () { $(this).animate({ 'left': '-=30' }); _panelPager.moving = false; });
                }
            }

        };

};

$(document).ready(function() {
    //
    $('.CBTwidget').each(function() {
        var widget = $(this);
        var options = {
            pageSize: widget.find('.genericeCBTPagesize').val(),
            currentPage: 1,
            holder: null,
            pagerLocation: 'after'
        };
        widget.find('ul.topicLinkList').cbtPager(options);

        widget.find('div.pager ul li a').live('click', function() {
            widget.find('div.wlLoading').show();
            var url = $(this).attr('href');
            $.post(url, function(data) {
                widget.find('.boxInner').remove();
                widget.find('.OuterContent').append($(data).find('.boxInner'));

                //This function is written in the portal itself and not in widget library.
                if (typeof appendNewWindowSpan == 'function') {
                    appendNewWindowSpan(widget.find('a:not(div.pager a)'));
                }
            });
            widget.find('div.wlLoading').hide();
            return false;
        });
    });



});

(function($) {

    $.fn.cbtPager = function(options) {

        var defaults = {
            pageSize: 10,
            currentPage: 1,
            holder: null,
            pagerLocation: "after"
        };

        var options = $.extend(defaults, options);

        //options.pageSize = $(".cbtPagerContainer + input.genericeCBTPagesize").val();
        
        return this.each(function() {


            var selector = $(this);
            var pageCounter = 1;

            selector.wrap("<div class='cbtPagerContainer'></div>");

            selector.parents(".cbtPagerContainer").find("ul.cbtPagerNav").remove();
           
            
            selector.children().each(function(i) {

                if (i < pageCounter * options.pageSize && i >= (pageCounter - 1) * options.pageSize) {
                    $(this).addClass("cbtPagerPage" + pageCounter);
                }
                else {
                    $(this).addClass("cbtPagerPage" + (pageCounter + 1));
                    pageCounter++;
                }

            });

            // show/hide the appropriate regions 
            selector.children().hide();
            selector.children(".cbtPagerPage" + options.currentPage).show();

            if (pageCounter <= 1) {
                return;
            }

            //Build pager navigation
            var pageNav = "<ul class='cbtPagerNav'>";
            for (i = 1; i <= pageCounter; i++) {
                if (i == options.currentPage) {
                    pageNav += "<li class='currentPage cbtPageNav" + i + "'><a rel='" + i + "' href='#'>" + i + "</a></li>";
                }
                else {
                    pageNav += "<li class='cbtPageNav" + i + "'><a rel='" + i + "' href='#'>" + i + "</a></li>";
                }
            }
            pageNav += "</ul>";

            if (!options.holder) {
                switch (options.pagerLocation) {
                    case "before":
                        selector.before(pageNav);
                        break;
                    case "both":
                        selector.before(pageNav);
                        selector.after(pageNav);
                        break;
                    default:
                        selector.after(pageNav);
                }
            }
            else {
                $(options.holder).append(pageNav);
            }

            //pager navigation behaviour
            selector.parent().find(".cbtPagerNav a").click(function() {

                //grab the REL attribute 
                var clickedLink = $(this).attr("rel");
                options.currentPage = clickedLink;

                if (options.holder) {
                    $(this).parent("li").parent("ul").parent(options.holder).find("li.currentPage").removeClass("currentPage");
                    $(this).parent("li").parent("ul").parent(options.holder).find("a[rel='" + clickedLink + "']").parent("li").addClass("currentPage");
                }
                else {
                    //remove current current (!) page
                    $(this).parent("li").parent("ul").parent(".cbtPagerContainer").find("li.currentPage").removeClass("currentPage");
                    //Add current page highlighting
                    $(this).parent("li").parent("ul").parent(".cbtPagerContainer").find("a[rel='" + clickedLink + "']").parent("li").addClass("currentPage");
                }

                //hide and show relevant links
                selector.children().hide();
                selector.find(".cbtPagerPage" + clickedLink).show();

                return false;
            });

            $(".cbtPagerContainer + div.pager").hide();
        });
    }

})(jQuery);


$(document).ready(function() {

    $('.ow').each(function() {
        $(this).find('ul.owitems').quickPager({ pageSize: 1 });
        owMoreInfo(this);
    });
});



function owMoreInfo(obj) {
    //$('<a class="owMoreinfolink" href="#">More</a>').insertAfter($(obj).find('.owMoreinfo'));
    $(obj).find('.owMoreinfo').hide();
    
    $(obj).find('.owMoreinfolink').live('click', function() {
        var ml = $(this).prev();
        var ow = $(this).parent()
        //$(ml).css("background-color", "red");
        if ($(ml).is(':visible')) {
            $(ow).find('.owMoreinfolink').html('More');
            $(ow).find('.owMoreinfolink').removeClass('owMoreinfolinkUp');
        }
        else {
            $(ow).find('.owMoreinfolink').html('Less');
            $(ow).find('.owMoreinfolink').addClass('owMoreinfolinkUp');
        }
        $(ow).find('.owMoreinfo').toggle();
        return false;
    });
}


(function($) {

    $.fn.quickPager = function(options) {

        var defaults = {
            pageSize: 10,
            currentPage: 1,
            holder: null,
            pagerLocation: "after"
        };

        var options = $.extend(defaults, options);


        return this.each(function() {


            var selector = $(this);
            var pageCounter = 1;

            selector.wrap("<div class='simplePagerContainer'></div>");

            selector.children().each(function(i) {

                if (i < pageCounter * options.pageSize && i >= (pageCounter - 1) * options.pageSize) {
                    $(this).addClass("simplePagerPage" + pageCounter);
                }
                else {
                    $(this).addClass("simplePagerPage" + (pageCounter + 1));
                    pageCounter++;
                }

            });

            // show/hide the appropriate regions 
            selector.children().hide();
            selector.children(".simplePagerPage" + options.currentPage).show();

            if (pageCounter <= 1) {
                return;
            }

            //Build pager navigation
            var pageNav = "<ul class='simplePagerNav'>";
            for (i = 1; i <= pageCounter; i++) {
                if (i == options.currentPage) {
                    pageNav += "<li class='currentPage simplePageNav" + i + "'><a rel='" + i + "' href='#'><span class='text'>" + i + "</span><span class='image'></span></a></li>";
                }
                else {
                    pageNav += "<li class='simplePageNav" + i + "'><a rel='" + i + "' href='#'><span class='text'>" + i + "</span><span class='image'></span></a></li>";
                }
            }
            pageNav += "</ul>";
            pageNav += "<ul class='NextNav'>";
            pageNav += "<li class='simplePageNavPrev'><a rel='prev' href='#'><span class='text'>&lt;&lt;&nbsp;Previous</span><span class='image'></span></a></li>";
            pageNav += "<li class='simplePageNavNext'><a rel='next' href='#'><span class='text'>Next&nbsp;&gt;&gt;</span><span class='image'></span></a></li>";
            pageNav += "</ul>";

            if (!options.holder) {
                switch (options.pagerLocation) {
                    case "before":
                        selector.before(pageNav);
                        break;
                    case "both":
                        selector.before(pageNav);
                        selector.after(pageNav);
                        break;
                    default:
                        selector.after(pageNav);
                }
            }
            else {
                $(options.holder).append(pageNav);
            }

            //pager navigation behaviour
            selector.parent().find(".simplePagerNav a").click(function() {

                //grab the REL attribute
                var clickedLink = $(this).attr("rel");

                if (clickedLink == 1) {
                    selector.parent().find('.simplePageNavPrev').hide();
                }
                else {
                    selector.parent().find('.simplePageNavPrev').show();
                }
                if (clickedLink == pageCounter) {
                    selector.parent().find('.simplePageNavNext').hide();
                }
                else {
                    selector.parent().find('.simplePageNavNext').show();
                }
                options.currentPage = clickedLink;

                if (options.holder) {
                    $(this).parent("li").parent("ul").parent(options.holder).find("li.currentPage").removeClass("currentPage");
                    $(this).parent("li").parent("ul").parent(options.holder).find("a[rel='" + clickedLink + "']").parent("li").addClass("currentPage");
                }
                else {
                    //remove current current (!) page
                    $(this).parent("li").parent("ul").parent(".simplePagerContainer").find("li.currentPage").removeClass("currentPage");
                    //Add current page highlighting
                    $(this).parent("li").parent("ul").parent(".simplePagerContainer").find("a[rel='" + clickedLink + "']").parent("li").addClass("currentPage");
                }

                //hide and show relevant links
                selector.children().hide();
                selector.find(".simplePagerPage" + clickedLink).show();

                return false;
            });

            selector.parent().find(".simplePageNavPrev a").click(function() {
                var clickedLink = parseFloat(selector.parent().find('.currentPage a').attr("rel"));
                if (clickedLink > 1) {
                    clickedLink = clickedLink - 1;
                }
                selector.parent().find('.simplePageNav' + clickedLink + ' a').trigger('click');
                return false;
            });


            selector.parent().find(".simplePageNavNext a").click(function() {
                var clickedLink = parseFloat(selector.parent().find('.currentPage a').attr("rel"));
                clickedLink = clickedLink + 1;
                selector.parent().find('.simplePageNav' + clickedLink + ' a').trigger('click');
                return false;
            });

        });
    }


})(jQuery);


jQuery.hookUpRecentActivityWidgetOverview = function(maxItems) {
    $(document).ready(function() {

        $('.owitem .RecentActivity  div.boxContent div.boxInner').each(function() {
            var RecentActivityWidget = $(this);
            if ($(RecentActivityWidget).find('.ActivityList').size() > 1) {
                $(RecentActivityWidget).find('.ActivityList:first').remove();
            }

            var html = '<ul class="ActivityMenu fc">' +
                    '<li class="first selected"><a href="#AllList">All</a></li>';

            $(RecentActivityWidget).find('div.ActivityList h3').each(function() {
                var list = $(this).next('ul');
                html += '<li><a href="#' + list.attr('class') + '">' + $(this).text() + '</a></li>';
            });

            html += '</ul>';

            $(RecentActivityWidget).find('ul, h3').css('display', 'none');

            $(RecentActivityWidget).prepend(html);

            $(RecentActivityWidget).find('ul.ActivityMenu li a').click(function() {
                $(this).parents('ul.ActivityMenu').find('li').removeClass('selected');
                $(this).parents('li').addClass('selected');

                $(RecentActivityWidget).find('ul:not(.ActivityMenu), h3').css('display', 'none');

                var indexOfHash = $(this).attr('href').indexOf('#');
                var className = $(this).attr('href').substring(indexOfHash + 1);
                $(RecentActivityWidget).find('ul.' + className).css('display', 'block');

                return false;
            });

            var allItemClasses = new Array();

            $(RecentActivityWidget).find('.ActivityList > ul > li').each(function() {
                allItemClasses.push($(this).attr('class').replace(' alt', ''));
            });

            allItemClasses.sort();
            allItemClasses.reverse();

            if ($(RecentActivityWidget).find('.ActivityList ul.AllList').length == 0) {
                var allItemsHtml = '<ul class="AllList">';

                var itemLength = allItemClasses.length < maxItems ? allItemClasses.length : maxItems;

                var altRow = false;
                for (var i = 0; i < itemLength; i++) {
                    var element = RecentActivityWidget.find('.ActivityList ul li.' + allItemClasses[i]);
                    allItemsHtml += '<li' + (altRow ? ' class="alt"' : '') + '>' + element.html() + '</li>';

                    altRow = !altRow;
                }

                allItemsHtml += '</ul>';

                $(RecentActivityWidget).find('.ActivityList').append(allItemsHtml);
            }
            else {
                $(RecentActivityWidget).find('.ActivityList ul.AllList').show();
            }

        });

    });
};

$(document).ready(function() {
    moduleLinksInit();
});

function moduleLinksInit() {
    var container = $('.learningmodule_widget');
    $.each(container, function(index, value) {

        var currentContainer = $(value);

        var defaultValue = currentContainer.find('p.defaultSize').html();
        currentContainer.find('p.defaultSize').hide();
        moduleSetup(value, defaultValue);
    });
}

function moduleSetup(container, noOfRows) {
    if ($('.learningmodule_widget').length) {
        if (noOfRows > 0) {
            var noOfRowsVisible = noOfRows - 1;
            var newContainer = $(container); //$('.learningmodule_widget');
            var listItems = newContainer.find('ul.modules > li');
            var moreLink = newContainer.find('.more');
            var moreLinkSpan = moreLink.find('span');

            listItems.filter(':gt(' + noOfRowsVisible + ')').hide();

            moreLink.click(function(e) {
                var shell = $(this);
                if (shell.parent().find('ul li:hidden').length) {
                    shell.parent().find('ul li:hidden').slideDown();
                    moreLinkSpan.text('Hide');
                    $(this).addClass('expanded');
                    return false;
                } else {
                    listItems.filter(':gt(' + noOfRowsVisible + ')').slideUp();
                    moreLinkSpan.text('More');
                    $(this).removeClass('expanded');
                    return false;
                }
                e.preventDefault();
            });
        }
    }
}


$(function () {
    if($('.faq_widget').length) {
        WILIB.FAQ.init();
    }
});

var WILIB = WILIB || {};

WILIB.FAQ = {

    init: function() {
        $('li.faq_widget').each(function() {
            WILIB.FAQ.setup($(this));
        });
    },

    setup: function(wfaq) {
        var faqSections = wfaq.find('.faqList li:not(.alwaysExpanded)');

        var sectionTitle = faqSections.children("h3");
        var faqQuestions = wfaq.find('.faqQuestions li');
        var faqQuestion = faqQuestions.children("h4");

        faqSections.find('.wrapper').hide();

        sectionTitle.click(function (event) {
            event.stopPropagation();

            var status = $(this).parent();

            if (status.hasClass("selected")) {
                WILIB.FAQ.hide($(this));
            } else {
                WILIB.FAQ.show($(this));
            }
        });

        faqQuestion.click(function (event) {
            event.stopPropagation();

            var status = $(this).parent();

            if (status.hasClass("selected")) {
                WILIB.FAQ.hide($(this));
            } else {
                WILIB.FAQ.show($(this));
            }
        });
    },

    show: function(current) {
        current.parent().parent().children('.selected:not(.alwaysExpanded)').children('div.wrapper').slideUp();
        current.parent().parent().children('.selected:not(.alwaysExpanded)').removeClass('selected');
        current.parent().addClass("selected");
        current.parent().children('div.wrapper').slideDown();
    },

    hide: function(current) {
        current.parent().parent().children('.selected:not(.alwaysExpanded)').children('div.wrapper').slideUp();
        current.parent().parent().children('.selected:not(.alwaysExpanded)').removeClass('selected');
    }
};

function FeatureWidget(fwt) {
    var featureWidget = this;

    // Start Timer
    function StartTimer() {
        fwt.everyTime(8000, "featureTimer", function(i) {
            featureWidget.show();
        }, 0);
    }

    StartTimer();
    
    // Private var holding the widget tab links, chained to add the click events
    var widgetTabs = fwt.find(".featureTabs li:not(.last) a")
                        .click(function(e) {
                            e.preventDefault();
                            fwt.stopTime("featureTimer");
                            var index = $.inArray($(this).context, widgetTabs);
                            featureWidget.show(index);
                            StartTimer();
                        });/*.mouseout(function() {
                            featureWidget.show();
                            StartTimer();
                        });*/

    widgetTabs.filter(':first').parent().addClass('active').show();
    
    // Private var holding the widget tab content areas
    var tabContents = fwt.find('.featureContainer');
    tabContents.hide().filter(':first').show()
    
    this.index = 0;
    this.animating = false;
    this.show = function(index) {
        if (!this.animating) {
            var previousIndex = this.index; // Save off current index

            // Increment index unless one has been provided
            if (index > -1) {
                this.index = index;
            }
            else {
                this.index = this.index + 1;
            }

            if ((this.index) === widgetTabs.length) {
                // Ensure it returns to 0 on the last item
                this.index = 0;
            }

            widgetTabs.eq(previousIndex).parent().removeClass("active");
            widgetTabs.eq(this.index).parent().attr("class", "active");
            //this.animating = true;
            tabContents.eq(previousIndex).fadeOut(1000, function() {
                tabContents.eq(featureWidget.index).fadeIn(1500);
                featureWidget.animating = false;
            });
        }
    }
    
}

$(document).ready(function() {
    initFeaturesWidgets();
});

function initFeaturesWidgets() {

    $("li.featuresWidget").each(function() {
        FeatureWidget($(this));
    });

}



/**
* jQuery.timers - Timer abstractions for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/10/16
*
* @author Blair Mitchelmore
* @version 1.2
*
**/

jQuery.fn.extend({
    everyTime: function(interval, label, fn, times) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times);
        });
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function(element, interval, label, fn, times) {
            var counter = 0;

            if (jQuery.isFunction(label)) {
                if (!times)
                    times = fn;
                fn = label;
                label = interval;
            }

            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval < 0)
                return;

            if (typeof times != 'number' || isNaN(times) || times < 0)
                times = 0;

            times = times || 0;

            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

            if (!timers[label])
                timers[label] = {};

            fn.timerID = fn.timerID || this.guid++;

            var handler = function() {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
            };

            handler.timerID = fn.timerID;

            if (!timers[label][fn.timerID])
                timers[label][fn.timerID] = window.setInterval(handler, interval);

            this.global.push(element);

        },
        remove: function(element, label, fn) {
            var timers = jQuery.data(element, this.dataKey), ret;

            if (timers) {

                if (!label) {
                    for (label in timers)
                        this.remove(element, label, fn);
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.timerID) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID];
                        }
                    } else {
                        for (var fn in timers[label]) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }

                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label];
                    }
                }

                for (ret in timers) break;
                if (!ret)
                    jQuery.removeData(element, this.dataKey);
            }
        }
    }
});

jQuery(window).bind("unload", function() {
    jQuery.each(jQuery.timer.global, function(index, item) {
        jQuery.timer.remove(item);
    });
});

//----- Images Widget Functionality -----//
jQuery.hookUpImageWidget = function () {
    $(document).ready(function () {
        var IMAGE_TRANSITION_TIME = 5000;
        var AUTO_TRANSITION_SPEED = 500;
        var MANUAL_TRANSITION_SPEED = 150;

        $('div.ImageWidget').each(function () {
            var currentTransitionSpeed = AUTO_TRANSITION_SPEED;
            var imageChangeTimer;
            var currentImage;
            var transitionInProgress = false;

            var totalImages = $(this).find('ul > li').length;

            if (totalImages > 1) {
                currentImage = $(this).find('ul > li:visible');

                imageChangeTimer = setTimeout(function () {
                    changeImage(true);
                }, IMAGE_TRANSITION_TIME);

                $(this).find('.PagingLinks a').click(function (e) {
                    e.preventDefault();

                    clearTimeout(imageChangeTimer);
                    currentTransitionSpeed = MANUAL_TRANSITION_SPEED;

                    if ($(this).parent().hasClass('Previous')) {
                        changeImage(false);
                    }
                    else {
                        changeImage(true);
                    }
                });
            }

            function changeImage(isForward) {
                if (!transitionInProgress) {
                    transitionInProgress = true;

                    var nextImage = isForward ? currentImage.next() : currentImage.prev();

                    if (nextImage.length == 0) {
                        nextImage = isForward ? currentImage.parent().find('li:first') : currentImage.parent().find('li:last');
                    }

                    var nextElementHeight = nextImage.height();
                    var currentElementHeight = currentImage.height();

                    if (nextElementHeight > currentElementHeight) {
                        //currentImage.parent().parent().height(nextElementHeight);
                    }

                    currentImage.find('a img').fadeOut(currentTransitionSpeed, function () {
                        currentImage.hide();
                        nextImage.find('a img').hide();
                        nextImage.show();

                        nextImage.find('a img').fadeIn(currentTransitionSpeed, function () {
                            //currentImage.parent().parent().height(nextElementHeight);

                            currentImage = nextImage;

                            transitionInProgress = false;
                            currentTransitionSpeed = AUTO_TRANSITION_SPEED;

                            imageChangeTimer = setTimeout(function () {
                                changeImage(true);
                            }, IMAGE_TRANSITION_TIME);
                        });
                    });
                }
            }
        });

    });
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$(document).ready(function() {
	initInformationLiteracyWidgets();
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function initInformationLiteracyWidgets() {

	$("li.cycle_widget").each(function() {
		initInformationLiteracyWidget($(this));
	});

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function initInformationLiteracyWidget(ilw) {

	var steps = ilw.find("div.steps");
	var hotspots = ilw.find(".ilCycle a");

	steps.hide().filter(":first").fadeIn("slow");
	hotspots.filter(":first").parent().addClass("active");

	var ilwConfig = {
		sensitivity: 3,
		interval: 200,
		over: informationLiteracyWidgetHoverIntentOver,
		timeout: 500,
		out: informationLiteracyWidgetHoverIntentOut
	};

	hotspots.hoverIntent(ilwConfig);

}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function informationLiteracyWidgetHoverIntentOver() {

	var shell = $(this.hash);

	$(this).parent().parent().children().removeClass('active');
	$(this).parent().addClass('active');

	var cs = $('.steps', '.cycle_widget');

	cs.filter(':visible').fadeOut("slow", function() {
		shell.fadeIn("slow");
	});
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function informationLiteracyWidgetHoverIntentOut() {
	// we want to do nothing
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

$(document).ready(function()
{
    $('.multiColumnTab').each(function()
    {
        var widget = $(this);

        var tabTriggers = widget.find('.tabTriggers > li');
        var tabs = widget.find('.tabContent');

        tabs.hide().eq(0).show();
        tabTriggers.eq(0).addClass('active');

        tabTriggers.click(function(e)
        {
            e.preventDefault();

            var index = $(this).index();

            tabTriggers.removeClass('active').eq(index).addClass('active');
            tabs.hide().eq(index).show();
        });
    });
});

$(function() {
    if($('.nhsmap_widget').length) {
        WILIB.NHSMAP.init();
    }
});

var WILIB = WILIB || {};

WILIB.NHSMAP = {
    init : function () {
        $('li.nhsmap_widget').each(function() {
            WILIB.NHSMAP.setup($(this));
        });
    },

    setup : function (nhsmap) {
        var area = nhsmap.find('ul.nhsmap li a');
        area.mouseover(function(e) {
            e.preventDefault();
            var el = $(this);
            var elText = el.text();
            
            WILIB.NHSMAP.showTooltip(el, elText);
        });

        area.mouseout(function(e) {
            e.preventDefault();
            var el = $(this);
            var elText = el.text();
            WILIB.NHSMAP.removeTooltip(el, elText);
        });
    },

    showTooltip : function (element, elementText) {
        var tempHTML = '<span class="mapTooltip">' + elementText +'<span class="mapTooltipTail"></span></span>';
        element.empty().append(tempHTML);
        element.addClass('tooltipContainer');
        var xPos = (element.width() / 2 - 10);
        $('.mapTooltip').css('left', xPos);
    },

    removeTooltip : function (element, elementText) {
        element.empty().append(elementText);
        element.removeClass('tooltipContainer');
    }
};

$(document).ready(function() {
    initEmptyBoardSelect();
});

function initEmptyBoardSelect() {
    $('input.submit').click(function() {
        var parent = $(this).parents('div.jsFormRow');
        if (parent.find('select').val() == '') {
            parent.append('<span class="error">Please select a Board</span>');
            return false;
        }
    });
}


$(document).ready(function() {
    qualityStrategyWidget();
});

function qualityStrategyWidget() {
    var cycleSections = $('.qualitystrategy_widget .steps', '.cycle-widget');
    var cycleTrigger = $('.qualitystrategy_widget .ilCycle a', '.cycle_widget');

    cycleSections.hide().filter(':first').show();
    cycleTrigger.filter(':first').parent().addClass('active');

    cycleTrigger.mouseover(function() {
        var shell = $(this.hash);

        cycleTrigger.parent().removeClass('active');
        $(this).parent().addClass('active');

        cycleSections.filter(':visible').fadeOut("slow", function() {
            shell.fadeIn("slow");
        });

        return false
    });
}

$(document).ready(function() {
    quickLinksInit();
});

function quickLinksInit() {
    var container = $('.quicklinks_widget');
    $.each(container, function(index, value) {
        var showCount = $(value).find('.defaultSize').html(); //$(container).find('.defaultSize').html();
        quickLinksSetup(value, showCount);
    });
}

function quickLinksSetup(container, noOfRows) {
    if ($('.quicklinks_widget').length && noOfRows) {
        var noOfRowsVisible = noOfRows - 1;
        var newContainer = $(container); //$('.quicklinks_widget');
        var listItems = newContainer.find('ul.quickLinksItems li');
        var moreLink = newContainer.find('.more');
        var moreLinkSpan = moreLink.find('span');

        if (noOfRows > 0) {
            listItems.filter(':gt(' + noOfRowsVisible + ')').hide();
        }

        moreLink.click(function() {
            var shell = $(this);
            if (shell.parent().find('ul.quickLinksItems li:hidden').length) {
                shell.parent().find('ul.quickLinksItems li:hidden').slideDown();
                moreLinkSpan.text('Hide');
                moreLink.addClass('fullList');
                return false;
            } else {
                listItems.filter(':gt(' + noOfRowsVisible + ')').slideUp();
                moreLinkSpan.text('More');
                moreLink.removeClass('fullList');
                return false;
            }
        });
    }
}

function RevolverWidget(fwt) {
    var revolverWidget = this;

    // Start Timer
    function StartTimer() {
        fwt.everyTime(8000, "revolverTimer", function (i) {
            revolverWidget.show();
        }, 0);
    }

    StartTimer();

    // Private var holding the widget tab links, chained to add the click events
    var widgetTabs = fwt.find(".revolverTabs li:not(.last) a")
                        .click(function (e) {
                            e.preventDefault();
                            fwt.stopTime("revolverTimer");
                            var index = $.inArray($(this).context, widgetTabs);
                            revolverWidget.show(index);
                            StartTimer();
                        });

    widgetTabs.filter(':first').parent().addClass('active').show();

    // Private var holding the widget tab content areas
    var tabContents = fwt.find('.revolverContainer');
    tabContents.hide().filter(':first').show()

    this.index = 0;
    this.animating = false;
    this.show = function (index) {
        if (!this.animating) {
            var previousIndex = this.index; // Save off current index

            // Increment index unless one has been provided
            if (index > -1) {
                this.index = index;
            }
            else {
                this.index = this.index + 1;
            }

            if ((this.index) === widgetTabs.length) {
                // Ensure it returns to 0 on the last item
                this.index = 0;
            }

            widgetTabs.eq(previousIndex).parent().removeClass("active");
            widgetTabs.eq(this.index).parent().attr("class", "active");
            //this.animating = true;
            tabContents.eq(previousIndex).fadeOut(1000, function () {
                tabContents.eq(revolverWidget.index).fadeIn(1500);
                revolverWidget.animating = false;
            });
        }
    }

}

$(document).ready(function () {
    initRevolverWidgets();
});

function initRevolverWidgets() {

    $("li.revolverWidget").each(function () {
        RevolverWidget($(this));
    });

}



/**
* jQuery.timers - Timer abstractions for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/10/16
*
* @author Blair Mitchelmore
* @version 1.2
*
**/

jQuery.fn.extend({
    everyTime: function (interval, label, fn, times) {
        return this.each(function () {
            jQuery.timer.add(this, interval, label, fn, times);
        });
    },
    oneTime: function (interval, label, fn) {
        return this.each(function () {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function (label, fn) {
        return this.each(function () {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function (value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function (element, interval, label, fn, times) {
            var counter = 0;

            if (jQuery.isFunction(label)) {
                if (!times)
                    times = fn;
                fn = label;
                label = interval;
            }

            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval < 0)
                return;

            if (typeof times != 'number' || isNaN(times) || times < 0)
                times = 0;

            times = times || 0;

            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

            if (!timers[label])
                timers[label] = {};

            fn.timerID = fn.timerID || this.guid++;

            var handler = function () {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
            };

            handler.timerID = fn.timerID;

            if (!timers[label][fn.timerID])
                timers[label][fn.timerID] = window.setInterval(handler, interval);

            this.global.push(element);

        },
        remove: function (element, label, fn) {
            var timers = jQuery.data(element, this.dataKey), ret;

            if (timers) {

                if (!label) {
                    for (label in timers)
                        this.remove(element, label, fn);
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.timerID) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID];
                        }
                    } else {
                        for (var fn in timers[label]) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }

                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label];
                    }
                }

                for (ret in timers) break;
                if (!ret)
                    jQuery.removeData(element, this.dataKey);
            }
        }
    }
});

jQuery(window).bind("unload", function () {
    jQuery.each(jQuery.timer.global, function (index, item) {
        jQuery.timer.remove(item);
    });
});

$(document).ready(function() {

var defaultValue = $("p.defaultFeedsDisplay").html();
    $("p.defaultFeedsDisplay").hide();
    newsFeedsInit(defaultValue);

});

function newsFeedsInit(noOfFeeds) {
    var container = $('.newsfeeds_widget');
    $.each(container, function(index, value) {
        newsFeedsSetup(value, noOfFeeds);
    });
}

function newsFeedsSetup(c, num) {
    // assumption, the number of h4's = the number of ul's

    var numVisible = num - 1;

    var lists = $(c).find('ul.news');
    var headings = $(c).find('h4.listHeader');

    var moreLink = $(c).find('.more');
    var moreLinkSpan = moreLink.find('span');

    if (numVisible > 0) {
        lists.filter(':gt(' + numVisible + ')').hide();
        headings.filter(':gt(' + numVisible + ')').hide();
    }

    moreLink.click(function() {
        if (lists.filter('ul:hidden').length > 0) {
            lists.filter('ul:hidden').slideDown();
            headings.filter('h4:hidden').slideDown();
            moreLinkSpan.text('Hide');
        } else {
            headings.filter(':gt(' + numVisible + ')').slideUp();
            lists.filter(':gt(' + numVisible + ')').slideUp();
            moreLinkSpan.text('More RSS newsfeeds');
        }
        return false;
    });
}


$(document).ready(function () {
    $('.saveAndShare').each(function () {
        var saveShareWidget = $(this);

        saveShareWidget.find('.tagging .addTags input[type=text]').autocomplete('/umbraco/WidgetLibrary/WidgetAjaxHandler.aspx?t=NES.WidgetLibrary.WidgetTypes.TKN.SaveShare.SaveShareWidgetType&action=searchTags',
        {
            delay: 400,
            minChars: 1,
            matchSubset: 1,
            matchContains: 1,
            cacheLength: 10,
            formatItem: function (row) { return row[0]; },
            autoFill: false,
            max: 10
        });

        saveShareWidget.find('.ssEmail fieldset, .ssEmail p.emailAllLogin').hide();

        var emailButton = saveShareWidget.find('.ssEmail > strong');

        emailButton.css('cursor', 'pointer');

        emailButton.click(function () {
            var form = $(this).parent().find('fieldset, p.emailAllLogin');

            if (form.css('display') == 'none') {
                form.show(400);
            }
            else {
                form.hide(400);
            }
        });

        saveShareWidget.find('.ssEmail .formButtons input[type=submit]').click(function () {
            var form = $(this).parent().parent();

            form.find('p.error').remove();

            var recipients = $.trim(form.find('.email input[type=text]').val());
            var subject = $.trim(form.find('.subject input[type=text]').val());

            var formErrorFound = false;

            if (recipients.length === 0) {
                form.find('.email input[type=text]').after('<p class="error">Required</p>');
                formErrorFound = true;
            }

            var emails = recipients.split(';');

            var emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

            for (var i in emails) {
                var email = $.trim(emails[i]);

                if (email.length > 0 && !emailRegex.test(email)) {
                    form.find('.email input[type=text]').after('<p class="error">Invalid email address(es)</p>');
                    formErrorFound = true;
                    break;
                }
            }

            if (subject.length === 0) {
                form.find('.subject input[type=text]').after('<p class="error">Required</p>');
                formErrorFound = true;
            }

            return !formErrorFound;
        });

        var clearingAllProgress = false;
        saveShareWidget.find('li.ssClear input[type=submit]').click(function () {
            if (!clearingAllProgress) {
                clearingAllProgress = true;

                var button = saveShareWidget.find('.jqTopRecords input.button');
                var uiControls = saveShareWidget.find('.uiControls');
                var promotedMarks = $(document).find('li.promotedRecord.fc.result-item ul.noList.searchResultFunctions a.mark.selected');

                $.post('/umbraco/WidgetLibrary/WidgetAjaxHandler.aspx?t=NES.WidgetLibrary.WidgetTypes.TKN.SaveShare.SaveShareWidgetType&action=clearAll', function (data) {
                    if (button.hasClass('unmark')) { button.removeClass('unmark'); }
                    if (!button.hasClass('mark')) { button.addClass('mark'); }

                    for (var i = 0; i < promotedMarks.length; i++) {
                        promotedMarks[i].className = "mark";
                        promotedMarks[i].innerHTML = "Mark Record";
                    }

                    button.val(button.val().replace('Unmark', 'Mark'));

                    saveShareWidget.find('.recordList ul.selectedRecords li').remove();

                    if (uiControls.css('display') != 'none') {
                        uiControls.hide(1000);
                    }

                    if (typeof saveShare_unmarkAllRecords == 'function') {
                        saveShare_unmarkAllRecords();
                    }
                });

                clearingAllProgress = false;
                return false;
            }
        });

        var printButton = saveShareWidget.find('.ssPrint a');

        printButton.attr('href', '');

        printButton.click(function () {
            var frame = $(this).parent().find('iframe');

            if (frame.length === 0) {
                var style = 'width: 0; height: 0; border: none;';
                $(this).parent().append('<iframe border="0" width="0" height="0" style="' + style + '" src=""></iframe>');

                frame = $(this).parent().find('iframe');
            }

            var printTitle = $(this).attr('data-title');

            frame.attr('src', '/umbraco/WidgetLibrary/WidgetAjaxHandler.aspx?t=NES.WidgetLibrary.WidgetTypes.TKN.SaveShare.SaveShareWidgetType&action=iframe&title=' + printTitle);

            return false;
        });

        var markingProgress = false;

        saveShareWidget.find('.jqTopRecords input.button').click(function () {
            if (!markingProgress) {
                markingProgress = true;

                var button = $(this);

                $.post('/umbraco/WidgetLibrary/WidgetAjaxHandler.aspx?t=NES.WidgetLibrary.WidgetTypes.TKN.SaveShare.SaveShareWidgetType&action=markRecords', function (data) {
                    var uiControls = saveShareWidget.find('.uiControls');

                    if (button.hasClass('mark')) {
                        button.removeClass('mark');
                        button.addClass('unmark');

                        button.val(button.val().replace('Mark', 'Unmark'));

                        var recordsList = saveShareWidget.find('.recordList ul.selectedRecords');
                        recordsList.find('li').remove();

                        for (var i = 0; i < data.length; i++) {
                            recordsList.append('<li' + (i % 2 != 0 ? ' class="even" ' : '') + '>' +
                            data[i].Name + '<input type="hidden" value="" /></li>');

                            recordsList.find('li').last().find('input[type=hidden]').val(data[i].Id);
                        }

                        if (uiControls.css('display') == 'none') {
                            uiControls.show(1000);
                        }

                        if (typeof saveShare_markAllRecords == 'function') {
                            saveShare_markAllRecords();
                        }
                    }
                    else {
                        button.removeClass('unmark');
                        button.addClass('mark');

                        button.val(button.val().replace('Unmark', 'Mark'));

                        saveShareWidget.find('.recordList ul.selectedRecords li').remove();

                        if (uiControls.css('display') != 'none') {
                            uiControls.hide(1000);
                        }

                        if (typeof saveShare_unmarkAllRecords == 'function') {
                            saveShare_unmarkAllRecords();
                        }
                    }

                    markingProgress = false;
                });
            }

            return false;
        });
    });
});

function saveShare_AddResource(id, name, url, type, source, pubDate, mkn)
{
    var found = $('.saveAndShare .recordList ul.selectedRecords li input[type=hidden][value=\'' + id.replace('\'', '\\\'') + '\']').length > 0;
    if(!found)
    {
        $.post('/umbraco/WidgetLibrary/WidgetAjaxHandler.aspx?t=NES.WidgetLibrary.WidgetTypes.TKN.SaveShare.SaveShareWidgetType',
        {
            action: 'addResource',
            id: id,
            name: name,
            url: url,
            type: type,
            source: source,
            pubDate: pubDate,
            mkn: mkn
        },
        function(data)
        {
            if (data == 'success')
            {
                var selectedRecords = $('.saveAndShare .recordList ul.selectedRecords');
                var recordCount = selectedRecords.find('li').length;

                selectedRecords.append('<li' + (recordCount % 2 != 0 ? ' class="even" ' : '') + '>' +
                    name + '<input type="hidden" value="" /></li>');

                var insertedItem = selectedRecords.find('li').last();
                insertedItem.find('input[type=hidden]').val(id);

                if ($('.saveAndShare .uiControls').css('display') == 'none')
                {
                    $('.saveAndShare .uiControls').show(1000);
                }
            }
        });
    }
}

function saveShare_RemoveResource(id)
{
    var record = $('.saveAndShare .recordList ul.selectedRecords li input[type=hidden][value=\'' + id.replace('\'', '\\\'') + '\']').parent();
    if (record.length > 0)
    {
        $.post('/umbraco/WidgetLibrary/WidgetAjaxHandler.aspx?t=NES.WidgetLibrary.WidgetTypes.TKN.SaveShare.SaveShareWidgetType', { action: 'removeResource', id: id }, function(data)
        {
            if (data == 'success')
            {
                var selectedRecords = record.parent();

                record.remove();

                var increment = 1;
                selectedRecords.find('li').each(function()
                {
                    if (increment % 2 == 0)
                    {
                        $(this).addClass('even');
                    }
                    else
                    {
                        $(this).removeClass('even');
                    }

                    increment++;
                });

                var recordCount = $('.saveAndShare .recordList ul.selectedRecords li').length;

                if (recordCount == 0)
                {
                    $('.saveAndShare .uiControls').hide(1000);
                }
            }
        });
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// frontEndScript.js - BEGIN
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

$(function() {

    initContentTabbedWidgets();
    overiderDefaultTab();
    initLinkTriggers();
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function initLinkTriggers() {
    $('.tabTriggers').each(function() {

        var tabTrigger = $(this);
        var tabHeadingLinks = tabTrigger.children("li").children("a");
        var tabTriggerContentSiblings = tabTrigger.siblings('div[class~="tabContent"]')

        tabHeadingLinks.each(function() {
            var tabHeadingLink = $(this);
            var tabContentLinks = tabTriggerContentSiblings.find('a[href=' + tabHeadingLink.attr("href") + ']');

            tabContentLinks.click(function() {
                tabHeadingLink.click();
                return false;
            });
        });
    });
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function overiderDefaultTab() {

    if (location.href.indexOf("#") != -1)
    {
        var substr = location.href.split('#');
        var tab = substr[1];

        if (tab.length > 0) {
            switchTab(tab);
        }
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function switchTab(tab) {
    var targetTabTriggers = $('.tabTriggers').find('a[href*=' + tab + ']').parent().parent();

    targetTabTriggers.children('.active').removeClass('active');
    targetTabTriggers.find('a[href*=' + tab + ']').parent().addClass('active');

    var shell = $('#' + tab);

    //$('.tabContent').hide();
    targetTabTriggers.parent().find('.tabContent').hide();
    shell.show();

    return false
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function initContentTabbedWidgets() {

    $("li.qit_widget").each(function() {
        initContentTabbedWidget($(this));
    });

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function initContentTabbedWidget(ctw) {

    var tTriggers = ctw.find('.tabTriggers a');
    var tContent = ctw.find('.tabContent');
    tabFader(tTriggers, tContent);

}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function tabFader(tabTrigger, tabSections) {

    tabSections.hide().filter(':first').show();
    tabTrigger.filter(':first').parent().addClass('active');

    tabTrigger.click(function() {

        tabTrigger.parent().removeClass('active');
        $(this).parent().addClass('active');
        tabSections.hide().filter(this.hash).show();
        return false

    });

}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// frontEndScript.js - END
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

$(document).ready(function()
{
    $('.elibrary ul.menu li a').click(function()
    {
        var name = $(this).attr('class');

        var item = $(this).parent();
        var menu = item.parent();
        menu.find('li').removeClass('selected');
        item.addClass('selected');

        $('.elibrary div.panel').hide();
        $('.elibrary div.' + name).show();

        return false;
    });

    $('.elibrary .journals form').submit(function()
    {
        var text = $.trim($(this).find('input[type=text]').val());

        if (text.length < 3)
        {
            if ($(this).find('.error').length == 0)
            {
                $(this).find('input[type=text]').after('<p class="error">Please enter a search term (minimum 3 characters)</p>');
            }
            return false;
        }
    });

    $('.elibrary .articles form').submit(function()
    {
        var title = $.trim($(this).find('input[name=Title]').val());
        var author = $.trim($(this).find('input[name=Author]').val());
        var journalTitle = $.trim($(this).find('input[name=JournalTitle]').val());
        var keyword = $.trim($(this).find('input[name=Keyword]').val());
        var issn = $.trim($(this).find('input[name=ISSN]').val());
        var volume = $.trim($(this).find('input[name=Volume]').val());
        var issue = $.trim($(this).find('input[name=Issue]').val());
        var startPage = $.trim($(this).find('input[name=StartPage]').val());
        var publishedYear = $.trim($(this).find('input[name=PublishedYear]').val());

        if (title == '' && author == '' && journalTitle == '' && keyword == '' && issn == '' &&
            volume == '' && issue == '' && startPage == '' && publishedYear == '')
        {
            if ($(this).find('.error').length == 0)
            {
                $(this).find('.right').after('<p class="error">Please enter at least one search term.</p>');
            }

            return false;
        }
    });

    $('.elibrary .books form').submit(function()
    {
        var title = $.trim($(this).find('input[name=Title]').val());
        var author = $.trim($(this).find('input[name=Author]').val());
        var keyword = $.trim($(this).find('input[name=Keyword]').val());

        if (title == '' && author == '' && keyword == '')
        {
            if ($(this).find('.error').length == 0)
            {
                $(this).find('.fullTextOptions').after('<p class="error">Please enter at least one search term.</p>');
            }

            return false;
        }
    });

    $('.elibrary .libraries form').submit(function()
    {
        var location = $.trim($(this).find('input[name=Keyword]').val());

        if (location == '')
        {
            if ($(this).find('.error').length == 0)
            {
                $(this).find('.buttonBox').after('<p class="error">Please enter a search term (minimum 3 characters).</p>');
            }

            return false;
        }
    });

    $('form#form-search').submit(function () {
        var text = $.trim($(this).find('input[type=text]').val());

        if (text.length < 3) {
            if ($(this).find('.error').length == 0) {
                $(this).find('input[type=text]').after('<p class="error">Please enter a search term (minimum 3 characters)</p>');
            }
            return false;
        }
    });

    $('form.feedlibrarysearchformwidget').submit(function () {
        var text = $.trim($(this).find('input[type=text]').val());

        if (text.length < 3) {
            if ($(this).find('.error').length == 0) {
                $(this).find('input[type=text]').after('<p class="error">Please enter a search term (minimum 3 characters)</p>');
            }
            return false;
        }
    });


});




$(document).ready(function()
{
    TKN_ResourcesWidget_ProgressiveEnhancement();
});

function TKN_ResourcesWidget_ProgressiveEnhancement()
{
    $('.tknResources').each(function()
    {
        var headings = $(this).find('.resourceGroupList > li > h3');

        headings.css('cursor', 'pointer');

        headings.click(function()
        {
            var index = $(this).parent().parent().children('li').index($(this).parent());

            var container = $(this).siblings('div.resourcesList');
            var height = container.attr('data-height');
            if (height)
            {
                container.css('height', height + 'px');
            }

            if (container.css('display') == 'none')
            {
                $('ul.resourceGroupList li.selected div.resourcesList').slideUp(500, function()
                {
                    $(this).parent().removeClass('selected');
                });

                $(this).parent().addClass('selected');
                container.slideDown(500);
            }
            else
            {
                container.slideUp(500, function()
                {
                    $(this).parent().removeClass('selected');
                });
            }
        });

        var firstContainer = $(this).find('.resourceGroupList > li > div.resourcesList:first');
        if (firstContainer.length > 0)
        {
            var height = firstContainer.attr('data-height');
            if (height)
            {
                firstContainer.css('height', height + 'px');
            }
            firstContainer.parent().addClass('selected');
            firstContainer.show();
        }
    });
}

$(document).ready(function() {
    searchProvidersInit();
});

function searchProvidersInit() {
    $('.searchProviders').show();
}


