$(document).ready(function () {
    setupNewWindowLinks();
    if ($('.tooltip').length) {
        $('.tooltip').wTooltip();
    }
    EIP.UTIL.removePaddedBlock();
    EIP.UTIL.labelApplyOver();

    if ($('#homeSlideContainer').length) {
        /*EIP.UTIL.initHomeSlide();*/
        initFeaturesWidgets();
    }

    if ($('.CaseStudyTabs').length) {
        EIP.CASESTUDY.initTabs();
        EIP.CASESTUDY.initAccor();
    }

    if ($('ul.zebrafy').length) {
        EIP.UTIL.applyZebraToList($('ul.zebrafy'));
    }

    if ($('dl.zebrafy').length) {
        EIP.UTIL.applyZebraToDList($('dl.zebrafy'));
    }

    if ($('.ac_results').length) {
        $('.ac_results').hide();
        EIP.AJAXSEARCH.init("/umbraco/FastInstantSearch.aspx");
    }

    EIP.UTIL.removeEmptyElement("subNavigation", "msie", "7.");

});

// Allow access to the query string - needed for defaulting tab selections...
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//SETTING GLOBAL NAMESPACE FOR EIP
var EIP = EIP || {};

//UTILITIES NAMESPACE FOR GENERAL TOOLS USED THROUGHOUT EIP
EIP.UTIL = {

    removePaddedBlock: function () {
        var podcastWidget = $('.podcast_widget');
        if (podcastWidget.length) {
            podcastWidget.removeClass('padded-block');
        }
    },
    labelApplyOver: function () {
        $('label.apply-over').labelOver("over");
    },
    applyZebraToList: function (currentList) {
        var list = currentList;
        list.find('li:even').addClass('even');
    },
    applyZebraToDList: function (currentList) {
        var dlist = currentList;
        dlist.find('dt:even').addClass('even');
        dlist.find('dd:even').addClass('even');
    },
    removeEmptyElement: function (elementCssClass, browserName, browserVersionNumber) {
        var selectorRule = ".".concat(elementCssClass);
        if ($.browser.hasOwnProperty(browserName) == true
                && $.browser[browserName] == true
                && $.browser.version.substr(0, 2) == browserVersionNumber 
                && $(selectorRule.concat(" > *")).length == 0) {
            $(selectorRule).remove();
        }
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
    var widgetTabs = fwt.find(".homeSlideTabs li img")
                        .click(function(e) {
                            e.preventDefault();
                            fwt.stopTime("featureTimer");
                            var index = $.inArray($(this).context, widgetTabs);
                            featureWidget.show(index);
                            StartTimer();
                        });


    widgetTabs.filter(':first').parent().addClass('active').show();
	widgetTabs.css({opacity: 0.5}).filter(':first').css({opacity: 1});
    
    // Private var holding the widget tab content areas
    var tabContents = fwt.find('.homeSlide');
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
			
			
            widgetTabs.eq(previousIndex).parent().removeClass("active").find('img').fadeTo(1000, 0.5);
            widgetTabs.eq(this.index).parent().attr("class", "active");
            
            tabContents.eq(previousIndex).fadeOut(1000, function() {
                tabContents.eq(featureWidget.index).fadeIn(1500);
                featureWidget.animating = false;
				$('.homeSlideTabs li.active img').fadeTo(1000, 1);
            });
        }
    }
    
}

function initFeaturesWidgets() {

    $("#homeSlideContainer").each(function() {
        FeatureWidget($(this));
    });

}



//This function need to be called by widgetlibrary ajax function. t must have the same name.
function setupNewWindowLinks() {
    var domain = document.domain;
	// Complex selector but really just says get all links in footer or content which contain http and aren't in the EIP domain
    appendNewWindowSpan("#footer a[href*=http]:not([href*=" + domain + "]),#content a[class!='mark'][href*=http]:not([href*=" + domain + "]):not(ul.qualitystrategyLogo a):not(ul.searchProviders a):not(a.externalImage)");
	//.append('<span class="newWindow" title="Opens in a new window">&nbsp;</span>')
      //  .attr("target", "_blank");
	$('.externalImage').attr("target", "_blank");
}

function appendNewWindowSpan(selector) {
    $(selector).append('<span class="newWindow" title="Opens in a new window">&nbsp;</span>')
        .attr("target", "_blank");
}

//Global Tab functionality - using fading
function tabFader(tabTrigger, tabSetions) {
	tabSetions.hide().filter(':first').show();
	tabTrigger.filter(':first').parent().addClass('active');
	
	tabTrigger.click(function()
	{
		var them = $(this.hash);		
		
		tabTrigger.parent().removeClass('active');
		$(this).parent().addClass('active');
		
		tabSetions.filter(':visible').fadeOut("slow", function() {
			them.fadeIn("slow");
		});
		
		return false
	});
}




//Global Tab functionality - using show/hide
function tabShowHide(tabTrigger, tabSetions) {
	tabSetions.hide().filter(':first').show();
	tabTrigger.filter(':first').parent().addClass('active');
	
	tabTrigger.click(function()
	{
		var them = $(this.hash);
		
		tabTrigger.parent().removeClass('active');
		$(this).parent().addClass('active');
		
		tabSetions.hide();
		them.show();
		
		return false
	});
}




//Global Tab functionality - using sliding
function tabSlider(tabTrigger, tabSetions) {
	tabSetions.hide().filter(':first').show();
	tabTrigger.filter(':first').parent().addClass('active');
	
	tabTrigger.click(function()
	{
		var them = $(this.hash);
		
		tabTrigger.parent().removeClass('active');
		$(this).parent().addClass('active');
		
		tabSetions.filter(':visible').slideUp("slow", function() {
			them.slideDown("slow");
		});
		
		return false
	});
}



//----- Recent Activity Widget Functionality -----//
jQuery.hookUpRecentActivityWidget = function(maxItems) {
    $(document).ready(function() {
        var recentActivityWidget = $('div.RecentActivity div.boxContent div.boxInner');

        if ($('.ActivityList').size() > 1) {
            $('.ActivityList:first').remove();
        }

        var html = '<ul class="ActivityMenu fc">' +
                    '<li class="first selected"><a href="#AllList">All</a></li>';

        recentActivityWidget.find('div.ActivityList h3').each(function() {
            var list = $(this).next('ul');
            html += '<li><a href="#' + list.attr('class') + '">' + $(this).text() + '</a></li>';
        });

        html += '</ul>';

        recentActivityWidget.find('ul, h3').css('display', 'none');

        recentActivityWidget.prepend(html);

        recentActivityWidget.find('ul.ActivityMenu li a').click(function() {
            $(this).parents('ul.ActivityMenu').find('li').removeClass('selected');
            $(this).parents('li').addClass('selected');

            recentActivityWidget.find('ul:not(.ActivityMenu), h3').css('display', 'none');

            var indexOfHash = $(this).attr('href').indexOf('#');
            var className = $(this).attr('href').substring(indexOfHash + 1);
            recentActivityWidget.find('ul.' + className).css('display', 'block');

            return false;
        });

        var allItemClasses = new Array();

        recentActivityWidget.find('.ActivityList > ul > li').each(function() {
            allItemClasses.push($(this).attr('class').replace(' alt', ''));
        });

        allItemClasses.sort();
        allItemClasses.reverse();

        var allItemsHtml = '<ul class="AllList">';

        var itemLength = allItemClasses.length < maxItems ? allItemClasses.length : maxItems;

        var altRow = false;
        for (var i = 0; i < itemLength; i++) {
            var element = recentActivityWidget.find('.ActivityList ul li.' + allItemClasses[i]);
            allItemsHtml += '<li' + (altRow ? ' class="alt"' : '') + '>' + element.html() + '</li>';

            altRow = !altRow;
        }

        allItemsHtml += '</ul>';

        recentActivityWidget.find('.ActivityList').append(allItemsHtml);

    });
};

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

/*CASE STUDY*/

EIP.CASESTUDY = {

    initTabs : function () {
		var container, tabs, tabContent;
		container = $('#caseStudies');
		tabs = container.find('.CaseStudyTabs a');
		tabContent = container.find('.CaseStudyContent');
		tabContent.hide().filter(':first').show();

		// Based on the query string, show or hide the appropriate tab - needed because
		// this tabbing approach doesn't easily allow for tabs to be selected by default based on
		// hyperlinks to this page - slight hack to make this work...

		var tab = getParameterByName('tab');

		if (tab == '1') {
		    var searchLink = $('a[href$="#caseStudyBrowse"]')
		    EIP.CASESTUDY.tabControl(searchLink, tabs);
			EIP.CASESTUDY.tabContentControl('#caseStudyBrowse', tabContent);
		}
		
		tabs.click(function() {
			var contentId = $(this).attr("href");
			EIP.CASESTUDY.tabControl($(this), tabs);
			EIP.CASESTUDY.tabContentControl(contentId, tabContent);
			return false;
		});

	},
	
	tabControl : function (currentTab, tabs) {
		var thisTab, allTabs;
		thisTab = currentTab;
		allTabs = tabs;
		
		tabs.parent().removeClass('active');
		thisTab.parent().addClass('active');
	},
	
	tabContentControl : function (contentId, tabContent) {
		var thisContent, allContent;
		thisContent = contentId;
		allContent = tabContent;
		
		allContent.hide();
		$(thisContent).show();
	},
	
	initAccor : function () {
		var container, accorTrigger, accorContent;
		container = $('#caseStudies');
		accorTrigger = $('h3.accorHeader');
		accorContent = $('.accorContent');
		accorContent.hide();
		$('.accorHeaderActive').next('.accorContent').show();
		
		accorTrigger.click(function() {
			EIP.CASESTUDY.accorHeaderControl($(this));
			EIP.CASESTUDY.accorContentControl($(this));
		});
	},
	
	accorHeaderControl : function (currentHeader) {
		var thisHeader = currentHeader;
		
		thisHeader.toggleClass('accorHeaderActive');
	},
	
	accorContentControl : function (currentHeader) {
		var thisHeader = currentHeader;
		thisHeader.next('.accorContent').slideToggle();
	}
	
};



/**** AUTOCOMPLETE ****/
EIP.AJAXSEARCH = {
    init: function (dataURL) {

        var results = $('.ac_results').hide();
        var searchBox = $('.instantSearch');
        searchBox.attr("value", "");

        searchBox.keyup(function (e) {
            var crit = searchBox.val();
            //console.log(e.keyCode + " - " + crit.length);

            if (crit.length > 2) {

                if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 9 || e.keyCode === 13) {

                } else {
                    results.hide().empty();
                    searchBox.addClass("loading");
                    EIP.AJAXSEARCH.getData(dataURL + "?q=" + crit, crit);
                }
            } else {
                EIP.AJAXSEARCH.reset();
            }
        });
    },
    getData: function (dataURL, crit) {
        EIP.AJAXSEARCH.reset();
        $.ajax({
            type: "GET",
            url: dataURL,
            dataType: "json",
            success: function (data) {
                EIP.AJAXSEARCH.hideFlash();
                $('.ac_results').hide().empty();
                EIP.AJAXSEARCH.dataToDom(data, crit);
                $('.instantSearch').removeClass("loading");
                EIP.AJAXSEARCH.clickReset();
            }
        });
    },
    template: function (data, crit, category, classname) {
        var markup = "", items = "", flag = false;
        if (data.length) {
            $.each(data, function (i, n) {
                if (n["Category"] == category) {
                    if (flag === false) {
                        items = "<h2>" + category + "</h2><ul class='" + classname + "'>";
                        flag = true;
                    }
                    items += '<li><a href="' + n["Url"] + '">' + n["Title"] + '</a></li>';
                }
            });
            items += "</ul>";

            if ($(items).length) {
                markup += items;
            }
        }
        return markup;
    },
    dataToDom: function (data, crit) {
        var items = "", results = $('.ac_results');
        //Would like to change into the module pattern
        items += this.template(data, crit, "Resources", "resources");
        items += this.template(data, crit, "Person Profile", "people");
        items += this.template(data, crit, "Blogs", "blogs");
        items += this.template(data, crit, "Discussions", "discussions");
        items += this.template(data, crit, "Video", "audiovisual");
        items += this.template(data, crit, "Pages", "pages");
        items += this.template(data, crit, "Wikis", "wiki");

        //BUILD IT ALL!!!
        //var searchURL = '/Search-Results.aspx?tab=basic&q=(string("' + crit + '"%2c+mode%3d"and"))&pm=fql&searchTerm1=' + crit + '&target=eip';
        var resultsPageID = $('.resultsPageId').val(),
            searchTarget = $('.searchTarget').val();

        var searchURL = '/Pages/SearchRedirector.aspx?';
        searchURL += "searchTerm=" + crit;
        searchURL += "&resultsPageId=" + resultsPageID;
        searchURL += "&target=" + searchTarget;

        if (items.length < 1) {
            results.append('<p class="noResults">Your search did not match any documents. Please check all words are spelled correctly, or try different keywords.</p>');
            results.show();
        } else {
            items += "<p><a href='" + searchURL + "'>See More Results for <strong>&ldquo;" + crit + "&rdquo;</strong></a></p>";
            results.append(items);
            results.show();
        }

    },
    reset: function () {
        var results = $('.ac_results').hide().empty();
        EIP.AJAXSEARCH.showFlash();
    },
    clickReset: function () {
        $('html').click(function (e) {
            if ($(e.target).closest("#exploreQIC").length) {

            } else {
                EIP.AJAXSEARCH.reset();
            }
        });
    },
    hideFlash: function () {
        return $("object").css("visibility", "hidden");
    },
    showFlash: function () {
        return $("object").css("visibility", "visible")
    }
};
