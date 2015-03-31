var today = new Date();
var active_date = new Date("January 28, 2015");
var inactive_date = new Date("January 31, 2015");
var theDate = today.getDate();
var month = today.getMonth() + 1; // adds one to month because js starts at 0
var year = today.getFullYear();
var expDate = theDate + 1; // sets expDate to today +1 
var writtenDate = month + "/" + expDate + "/" + year; // rewrites expDate to form usable for js processing
var expiration_date = new Date(writtenDate);
expiration_dateStr = expiration_date.toUTCString();
/* alert("theDate: " + theDate + ", expDate: " + expDate + ", writtenDate: " + writtenDate + ", expiration_date: " + expiration_date); */


//here
function setCookie(cookieName, cookieValue, cookieExpires, cookiePath, cookieDomain)  
{
	cookieValue = escape(cookieValue);
	document.cookie = cookieName + "=" + cookieValue + "; expires=" + cookieExpires + "; path=" + cookiePath + "; domain=" + cookieDomain;
}
// here


function getCookie(name)
{ 
	var cookieString = document.cookie;
	var index = cookieString.indexOf(name + "=");

	if (index == -1)
		{ return null; }

	index = cookieString.indexOf("=", index) + 1;
	var endstr = cookieString.indexOf(";", index);

	if (endstr == -1) 
		{ endstr = cookieString.length; }

	return unescape(cookieString.substring(index, endstr));
}


function specialMessage()
{ 
	
		var pagesviewed = getCookie('SpecialMessage');
        if (today >= active_date && today <= inactive_date) { // only shows if between active and inactive dates
			if (pagesviewed != 'shown') // if the user has seen the popup do not show it again - within expiration window.
				{ 
					window.open("/outage-message.html","survey","menubar=no,width=515,height=225,toolbar=no");
					document.cookie = 'SpecialMessage=shown;expires=' + expiration_dateStr + ';path=/;domain=asq.org';
				}
		}
}