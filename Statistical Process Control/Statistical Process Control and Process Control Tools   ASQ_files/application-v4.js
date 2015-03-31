if (!window.console) {
    window.console = {
        log: function (obj) { /* define own logging function here, or leave empty */ }
    };
}

var uxl={};uxl.events={};jQuery(document).ready(function(){jQuery(uxl.events).trigger("pageLoad");console.log("[uxl.events] pageLoad()");jQuery(uxl.events).trigger("contentLoad");console.log("[uxl.events] contentLoad()");window.scrollTo(0,1)});uxl.chat={loadContent:function(){jQuery.getScript(document.location.protocol+"//cbi.boldchat.com/aid/1445670547303712682/bc.cbhs",function(){uxl.chat.available=bt_chatAvailable;if(uxl.chat.available){jQuery("#navEyebrow").append("<li><b id='boldChatButton'></b></li>");jQuery("<A>").click(function(a){uxl.notifier.create("boldChat","Chat with ASQ","<iframe src='http://livechat.boldchat.com/aid/1445670547303712682/bc.chat'></iframe>",[{label:"Close Window",action:function(){uxl.notifier.close("boldChat")}}]);uxl.notifier.show("boldChat");a.preventDefault()}).text("Live Chat").attr("href","http://livechat.boldchat.com/aid/1445670547303712682/bc.chat").appendTo("#boldChatButton")}})}};jQuery(uxl.events).bind("pageLoad",uxl.chat.loadContent);
/*
 * $ BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/$-bbq-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,v){var k,r=Array.prototype.slice,x=decodeURIComponent,a=$.param,c,o,B,b=$.bbq=$.bbq||{},w,A,l,e=$.event.special,d="hashchange",G="querystring",J="fragment",E="elemUrlAttr",h="location",m="href",z="src",D=/^.*\?|#.*$/g,C=/^.*\#/,j,I={};function K(L){return typeof L==="string"}function H(M){var L=r.call(arguments,1);return function(){return M.apply(this,L.concat(r.call(arguments)))}}function s(L){return L.replace(/^[^#]*#?(.*)$/,"$1")}function u(L){return L.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function g(N,S,L,O,M){var U,R,Q,T,P;if(O!==k){Q=L.match(N?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);P=Q[3]||"";if(M===2&&K(O)){R=O.replace(N?C:D,"")}else{T=o(Q[2]);O=K(O)?o[N?J:G](O):O;R=M===2?O:M===1?$.extend({},O,T):$.extend({},T,O);R=a(R);if(N){R=R.replace(j,x)}}U=Q[1]+(N?"#":R||!Q[1]?"?":"")+R+P}else{U=S(L!==k?L:v[h][m])}return U}a[G]=H(g,0,u);a[J]=c=H(g,1,s);c.noEscape=function(M){M=M||"";var L=$.map(M.split(""),encodeURIComponent);j=new RegExp(L.join("|"),"g")};c.noEscape(",/");$.deparam=o=function(O,L){var N={},M={"true":!0,"false":!1,"null":null};$.each(O.replace(/\+/g," ").split("&"),function(R,W){var Q=W.split("="),V=x(Q[0]),P,U=N,S=0,X=V.split("]["),T=X.length-1;if(/\[/.test(X[0])&&/\]$/.test(X[T])){X[T]=X[T].replace(/\]$/,"");X=X.shift().split("[").concat(X);T=X.length-1}else{T=0}if(Q.length===2){P=x(Q[1]);if(L){P=P&&!isNaN(P)?+P:P==="undefined"?k:M[P]!==k?M[P]:P}if(T){for(;S<=T;S++){V=X[S]===""?U.length:X[S];U=U[V]=S<T?U[V]||(X[S+1]&&isNaN(X[S+1])?{}:[]):P}}else{if($.isArray(N[V])){N[V].push(P)}else{if(N[V]!==k){N[V]=[N[V],P]}else{N[V]=P}}}}else{if(V){N[V]=L?k:""}}});return N};function F(N,L,M){if(L===k||typeof L==="boolean"){M=L;L=a[N?J:G]()}else{L=K(L)?L.replace(N?C:D,""):L}return o(L,M)}o[G]=H(F,0);o[J]=B=H(F,1);$[E]||($[E]=function(L){return $.extend(I,L)})({a:m,base:m,iframe:z,img:z,input:z,form:"action",link:m,script:z});l=$[E];function y(O,M,N,L){if(!K(N)&&typeof N!=="object"){L=N;N=M;M=k}return this.each(function(){var R=$(this),P=M||l()[(this.nodeName||"").toLowerCase()]||"",Q=P&&R.attr(P)||"";R.attr(P,a[O](Q,N,L))})}$.fn[G]=H(y,G);$.fn[J]=H(y,J);b.pushState=w=function(O,L){if(K(O)&&/^#/.test(O)&&L===k){L=2}var N=O!==k,M=c(v[h][m],N?O:{},N?L:2);v[h][m]=M+(/#/.test(M)?"":"#")};b.getState=A=function(L,M){return L===k||typeof L==="boolean"?B(L):B(M)[L]};b.removeState=function(L){var M={};if(L!==k){M=A();$.each($.isArray(L)?L:arguments,function(O,N){delete M[N]})}w(M,2)};e[d]=$.extend(e[d],{add:function(L){var N;function M(P){var O=P[J]=c();P.getState=function(Q,R){return Q===k||typeof Q==="boolean"?o(O,Q):o(O,R)[Q]};N.apply(this,arguments)}if($.isFunction(L)){N=L;return M}else{N=L.handler;L.handler=M}}})})($,this);
/*
 * $ hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/$-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

/* REMOVED OLD ANALYTICS TRACKING BCM 27 JUNE 2014 */


/* Copyright (c) Peter-Paul Kochs (http://www.quirksmode.org/js/cookies.html) */
uxl.cookies={write:function(c,d,e){if(e){var b=new Date();b.setTime(b.getTime()+(e*24*60*60*1000));var a="; expires="+b.toGMTString()}else{var a=""}document.cookie=c+"="+d+a+"; path=/"},read:function(b){var e=b+"=";var a=document.cookie.split(";");for(var d=0;d<a.length;d++){var g=a[d];while(g.charAt(0)==" "){g=g.substring(1,g.length)}if(g.indexOf(e)==0){return g.substring(e.length,g.length)}}return null},erase:function(a){uxl.cookies.write(a,"",-1)}};(function($){$.extend({tablesorter:new function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:"/.|,/g",onRenderHeader:null,selectorHeaders:"thead th",debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms")}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s)}else{alert(s)}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug=""}if(table.tBodies.length==0){return}var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter)}else{if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter)}}if(!p){p=detectParserForColumn(table,rows,-1,i)}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n"}list.push(p)}}if(table.config.debug){log(parsersDebug)}return list}function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==""&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log("Checking if value was empty on row:"+rowIndex)}}else{keepLooking=false}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i]}}return parsers[0]}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex]}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node))}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i]}}return false}function buildCache(table){if(table.config.debug){var cacheTime=new Date()}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]))}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null}if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime)}return cache}function getElementText(config,node){var text="";if(!node){return""}if(!config.supportsTextContent){config.supportsTextContent=node.textContent||false}if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML}else{text=node.innerHTML}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node)}else{text=$(node).text()}}return text}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j])}}}if(table.config.appender){table.config.appender(table,rows)}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime)}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd")},0)}function buildHeaders(table){if(table.config.debug){var time=new Date()}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index)){this.sortDisabled=true}if(checkHeaderOptionsSortingLocked(table,index)){this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index)}if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader){table.config.onRenderHeader.apply($th)}}table.config.headerList[index]=this});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders)}return $tableHeaders}function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName("THEAD")[0];var trs=thead.getElementsByTagName("TR");for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1;var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[]}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[]}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x"}}}}return lookup}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++))}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell)}}}return arr}function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true}return false}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true}return false}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder)){return table.config.headers[i].lockedOrder}return false}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table)}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i]}}}function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0}else{return(v==1)?1:0}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true}}return false}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this)}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]])}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$("<colgroup>");$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($("<col>").css("width",$(this).width()))});$(table).prepend(colgroup)}}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date()}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { "}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; "}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date())}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime)}return cache}function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=="text"&&direction=="asc"){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));"}else{if(type=="text"&&direction=="desc"){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));"}else{if(type=="numeric"&&direction=="asc"){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));"}else{if(type=="numeric"&&direction=="desc"){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));"}}}}}function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));"}function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));"}function makeSortNumeric(i){return"a["+i+"]-b["+i+"];"}function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];"}function sortText(a,b){if(table.config.sortLocaleCompare){return a.localeCompare(b)}return((a<b)?-1:((a>b)?1:0))}function sortTextDesc(a,b){if(table.config.sortLocaleCompare){return b.localeCompare(a)}return((b<a)?-1:((b>a)?1:0))}function sortNumeric(a,b){return a-b}function sortNumericDesc(a,b){return b-a}function getCachedSortType(parsers,i){return parsers[i].type}this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies){return}var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder){this.order=this.lockedOrder}if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j])}}}config.sortList.push([i,this.order])}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2}}}else{config.sortList.push([i,this.order])}}setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache))},1);return false}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me)},1)}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell)}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache))}).bind("appendCache",function(){appendToTable(this,cache)}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this)}).bind("applyWidgets",function(){applyWidget(this)});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList])}applyWidget(this)})};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false}}if(a){parsers.push(parser)}};this.addWidget=function(widget){widgets.push(widget)};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,"")))};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild){this.removeChild(this.firstChild)}}empty.apply(table.tBodies[0])}else{table.tBodies[0].innerHTML=""}}}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true},format:function(s){return $.trim(s.toLocaleLowerCase())},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c)},format:function(s){return $.tablesorter.formatFloat(s)},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[Â£$â‚¬?.]/.test(s)},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[Â£$â‚¬]/g),""))},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s)},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item}else{r+=item}}return $.tablesorter.formatFloat(r)},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s)},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),""))},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s)},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0")},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s))},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""))},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/))},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime())},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s)},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2")}else{if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1")}else{if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3")}}}return $.tablesorter.formatFloat(new Date(s).getTime())},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s)},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime())},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?"sortValue":c.parserMetadataName;return $(cell).metadata()[p]},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date()}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow)){row++}odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time)}}})})(jQuery);jQuery(".uxlIsSortable").tablesorter({cssHeader:"uxlTableSortHeading",cssAsc:"uxlTableSortHeadingAsc",cssDesc:"uxlTableSortHeadingDesc"});jQuery(document).ready(function(){jQuery("#mobNavSkip a").addClass("isClosed").each(function(a,b){console.log("Adding class to "+jQuery(b).attr("href"));jQuery(jQuery(b).attr("href")).addClass("isClosed")})});jQuery("#mobNavSkip a, a.mobileAction").click(function(){console.log(jQuery(this).attr("href")+" Clicked.");jQuery(jQuery(this).attr("href")).toggleClass("isOpen isClosed");jQuery("#mobNavSkip a").not(this).each(function(a,b){console.log("Closing "+jQuery(b).attr("href"));jQuery(jQuery(b).attr("href")).removeClass("isOpen").addClass("isClosed");jQuery(this).removeClass("isOpen").addClass("isClosed")});jQuery(this).toggleClass("isOpen isClosed");return false});jQuery;jQuery(".toolColumn").click(function(){console.log("[.toolColumn Click]");console.log(jQuery(this).width());console.log(jQuery(this).hasClass("isOpen"));if(jQuery(this).width()==44){jQuery(this).addClass("isOpen")}else{if(jQuery(this).hasClass("isOpen")){jQuery(this).removeClass("isOpen")}}});uxl.notifier={create:function(e,d,c,b){var a=jQuery("<DIV>").addClass("uxlNotifierContainer").html(c).prepend(jQuery("<H2>").text(d)).attr("id",e);for(i=0;i<b.length;i++){jQuery(a).append(jQuery("<A>").addClass("fakeBtn").text(b[i].label).click(b[i].action))}uxl.notifier.popups[e]=a},show:function(a){if(jQuery("#uxlNotifier").length==0){jQuery("<DIV>").attr({id:"uxlNotifier","class":"uxlNotifier"}).hide().appendTo("body")}jQuery("#uxlNotifier").fadeIn();if(typeof(uxl.notifier.popups[a])!="object"){return false}if(uxl.notifier.popups[a].showing){return false}uxl.notifier.opened++;if(jQuery("#"+a).css("display")==undefined){jQuery(uxl.notifier.popups[a]).hide().appendTo("#uxlNotifier")}jQuery(uxl.notifier.popups[a]).fadeIn()},opened:0,close:function(a){jQuery("#"+a).fadeOut(function(){jQuery(this).remove()});uxl.notifier.opened--;if(uxl.notifier.opened==0){jQuery("#uxlNotifier").fadeOut(function(){jQuery(this).remove()})}},level:20,popups:{},loadPage:function(){jQuery("<DIV>").attr({id:"uxlNotifier","class":"uxlNotifier"}).hide().appendTo("body")}};jQuery(uxl.events).bind("pageLoad",uxl.notifier.loadPage);uxl.tests={tests:{TangoInclusionBase:{test:Math.random()<0.05,restrict:/.*/,initial:function(){window.location.reload()},load:function(){}},TangoInclusionHeat:{test:Math.random()<0.05,restrict:/.*/,initial:function(){window.location.reload()},load:function(){jQuery.getScript("https://dnn506yrbagrg.cloudfront.net/pages/scripts/0011/6864.js")}}},check:function(){if(uxl.cookies.read("asqUxTest")==null){for(testKey in uxl.tests.tests){if(document.location.toString().match(uxl.tests.tests[testKey].restrict)){if(uxl.tests.tests[testKey].test){uxl.cookies.write("asqUxTest",testKey,180);if(typeof(uxl.tests.tests[testKey].initial)=="function"){uxl.tests.tests[testKey].initial()}}}}}},execute:function(){if(uxl.cookies.read("asqUxTest")==null){uxl.cookies.write("asqUxTest","NoTest")}else{if(uxl.cookies.read("asqUxTest")!="NoTest"&&typeof(uxl.tests.tests[uxl.cookies.read("asqUxTest")].load)=="function"){uxl.tests.tests[uxl.cookies.read("asqUxTest")].load()}}}};jQuery(uxl.events).bind("contentLoad",uxl.tests.execute);jQuery(uxl.events).bind("pageLoad",uxl.tests.check);uxl.forms={feedbackControl:function(d,a,b){if(b==undefined){b="&bull;"}var c=jQuery("#"+d).parent(".formElement");if(jQuery(".formElementFeedback",c).length==0){jQuery("<DIV>").addClass("formElementFeedback").appendTo(c)}jQuery(".formElementFeedback",c).removeClass("feedbackPositive feedbackNeutral feedbackNegative").html(b);switch(a){case"positive":jQuery(".formElementFeedback",c).addClass("feedbackPositive");break;case"negative":jQuery(".formElementFeedback",c).addClass("feedbackNegative");break;default:jQuery(".formElementFeedback",c).addClass("feedbackNeutral");break}},loadContent:function(){jQuery(".formGroupCollapsable legend").click(function(){var a=jQuery(this).parent("fieldset");jQuery(".formElement",a).slideToggle();jQuery("hr",a).slideToggle()})},changeAll:function(){},depends:function(){}};jQuery(uxl.events).bind("contentLoad",uxl.forms.loader);uxl.typography={minFontSize:10,shrinkCopy:function(){console.log("[uxl.typography.shrinkCopy]");jQuery(".uxlTypographyTextFit").each(function(){var b=parseInt(jQuery(this).css("font-size").replace(/[^\d]/gi,""));var d=jQuery(this).css("font-size").replace(/[\s\d]/gi,"");var c=jQuery(this).height();var a=jQuery(this).css("height","auto").innerHeight();console.log("[uxl.typography.shrinkCopy]","Base",a,"Fin",c);while(c<a){b--;console.log("[uxl.typography.shrinkCopy]","Shrinking to",b,d);jQuery(this).css("font-size",b+d);a=jQuery(this).height();console.log("[uxl.typography.shrinkCopy]","Base",a,"Fin",c)}jQuery(this).css("height","")})},loadContent:function(){uxl.typography.shrinkCopy()}};jQuery(uxl.events).bind("contentLoad",uxl.typography.loadContent);var uxl=uxl||{};var console=console||{log:function(){}};uxl.carousel={defaults:{"transition-speed":1000,"time-to-transition":9000,"package-location":"/content/carousel-tiles/"},per:{},applyInteractions:function(){console.log("[uxl.carousel.applyInteractions]","Finding carousel widgets");$(".uxlCarousel").each(function(a,c){console.log("[uxl.carousel.applyInteractions]","Updating carousel",a,"defaults.");lastChange=new Date();$(c).attr({"data-transition-speed":$(c).attr("transition-speed")|uxl.carousel.defaults["transition-speed"],"data-time-to-transition":$(c).attr("time-to-transition")|uxl.carousel.defaults["time-to-transition"],"data-carousel-id":a,"data-carousel-current":Math.floor($("li",c).length*Math.random()),"data-last-change":lastChange.getTime()-10000}).mouseenter(function(){$(c).attr("data-action-suspended","true")}).mouseleave(function(){$(c).attr("data-action-suspended","false")}).wrap("<DIV class='uxlCarouselWrap'>");console.log("[uxl.carousel.applyInteractions]","Creating tile flicker modules");var b=$("<UL>").addClass("uxlCarouselFlicker");for(a=0;a<$("li",c).length;a++){uxlCarouselFlickerElem=$("<LI>").text(a+1).click(function(){var e=(parseInt($(this).text())-1);var d=$(this).parent().parent().children(".uxlCarousel");$(d).attr({"data-carousel-current":e});uxl.carousel.updateCarousel(d)});$(b).append(uxlCarouselFlickerElem)}$(c).parent().append(b)});if($(".uxlCarousel").length>0){console.log("[uxl.carousel.applyInteractions]","uxlCarousel Modules found, setting timer");uxl.carousel.checkStatus();uxl.carousel.timer=setInterval(uxl.carousel.checkStatus,1000)}console.log("[uxl.carousel.applyInteractions]","Updating <LI>");$(".uxlCarousel a").addClass("uxlCarouselTileBasic")},checkStatus:function(){console.log("[uxl.carousel.checkStatus]");var a=new Date();$(".uxlCarousel").each(function(b,e){console.log("[uxl.carousel.checkStatus]","Checking carousel",b);if($(e).attr("data-action-suspended")=="true"){console.log("[uxl.carousel.checkStatus]","Carousel",b,"is being interacted with. Skipping.");return true}if(a.getTime()-parseInt($(e).attr("data-last-change"))<parseInt($(e).attr("data-time-to-transition"))){console.log("[uxl.carousel.checkStatus]","Carousel",b,"has time left on show schedule. Skipping.");return true}var c=parseInt($(e).attr("data-carousel-current"))+1;if(c>$(e).children().length-1){c=0}$(e).attr("data-carousel-current",c);console.log("[uxl.carousel.checkStatus]","Updating carousel",b,"to tile",c);uxl.carousel.updateCarousel(e)})},updateCarousel:function(e){console.log("[uxl.carousel.updateCarousel]");var c=parseInt($(e).attr("data-carousel-current"));var a=$("li:eq("+c+")");console.log("[uxl.carousel.checkStatus]","tileIndex",c);$(".uxlCarouselFlicker li").removeClass("uxlCarouselFlickerActive");$(".uxlCarouselFlicker li").eq(c).addClass("uxlCarouselFlickerActive");if($(a).attr("data-is-loaded")=="true"){console.log("[uxl.carousel.checkStatus]","data-is-loaded == true");var b=$(e).attr("data-transition-speed");$("li:eq("+c+")",e).css({display:"block"}).animate({opacity:1},b,"linear");console.log($("li:eq("+c+")",e).css("display"));$("li:gt("+c+")",e).animate({opacity:0},b,"linear",function(){$(this).css("display","none")});$("li:lt("+c+")",e).animate({opacity:0},b,"linear",function(){$(this).css("display","none")});lastChange=new Date();$(e).attr({"data-last-change":lastChange.getTime()});$(e).parent().find(".uxlCarouselFlicker li").removeClass("uxlCarouselFlickerActive").eq(c).addClass("uxlCarouselFlickerActive")}else{console.log("[uxl.carousel.checkStatus]","data-is-loaded != true");$("li",e).animate({opacity:0},b,"linear");uxl.carousel.getAdvancedTile(a)}},getAdvancedTile:function(b){console.log("[uxl.carousel.getAdvancedTile]");var c=$("a",b).attr("href");if(c.indexOf("#")>-1){c=c.match(/#(.*?)$/)[1]}console.log("[uxl.carousel.getAdvancedTile]",c);var a=$("<IFRAME>").attr({src:uxl.carousel.defaults["package-location"]+c+"/index.aspx",width:"100%",height:"100%",frameborder:0,scrolling:"no"}).load(function(){$(this).parent().attr("data-is-loaded","true");uxl.carousel.updateCarousel($(b).parent())});$(b).html(a);console.log("[uxl.carousel.getAdvancedTile]","Success")}};$(uxl.events).bind("contentLoad",uxl.carousel.applyInteractions);uxl.tabs={contentLoad:function(){jQuery(".uxlTabs").addClass("uxlTabsRendered");var a=jQuery(".uxlTabs > li").contents().filter(function(){return this.nodeType==3});jQuery(a).each(function(b,c){if(jQuery.trim(jQuery(c).text())!=""){t=jQuery.trim(jQuery(c).text()).toLowerCase().replace(/[^\w]+/g,"-");q=jQuery("<A>").text(jQuery(c).text()).addClass("uxlTabsTab").attr("href","#"+t);jQuery(c).replaceWith(q)}});jQuery(".uxlTabs > li > a").addClass("uxlTabsTab");jQuery(".uxlTabsRendered").each(function(b,c){jQuery(this).attr("data-tab-only-height",jQuery(c).height());jQuery(".uxlTabsBody",c).css("top",jQuery(c).height())});jQuery(".uxlTabs > li > a").click(function(d,b){var g=jQuery(this).parent();if(jQuery(".uxlTabsBody",g).length==0&&this.pathname!=location.pathname){p=jQuery("<div>").addClass("uxlTabsBody").html("<p>One moment please&#8230;</p>").css("top",jQuery(g).parent().attr("data-tab-only-height")).appendTo(g);jQuery.ajax({context:p,success:function(e){var j=jQuery("body",e);jQuery(this).html(j);uxl.tabs.openTab(jQuery(p).parent())},error:function(h,e,j){jQuery(this).html("<p>There was an error loading this tab. The data is available on <a href='"+jQuery(this).parent().find(".uxlTabsTab").attr("href")+"'>this page</a>.</p>")},url:this.pathname})}if(jQuery(g).hasClass("isOpen")){return false}var c=jQuery(g).parent();uxl.tabs.closeTab(jQuery(".isOpen",c));uxl.tabs.openTab(g,b);d.preventDefault()});jQuery(".uxlTabs").each(function(b,c){if(jQuery(".toOpen",c).length==0){jQuery("li:first-child a",c).trigger("click","auto")}else{jQuery(".toOpen a",c).trigger("click","auto")}});if($(".uxlGroup").length>0){$(".uxlGroup li").each(function(g,m){var e=$("h2:first-child",m).text();var j="#"+jQuery.trim(e).toLowerCase().replace(/[^\w]+/g,"-");var k=$(m).parent().attr("for");$(m).parent().addClass("uxlGroupRendered").attr("data-tab-only-height",0);if($("#"+k+" ul").length<1){$("#"+k).append("<ul>")}var c=$("<A>").text(e).attr("href",j).click(function(){uxl.tabs.openPanel($(this).attr("href").replace("#",""));$(this).parent().addClass("isOpen").siblings().removeClass("isOpen")});var b=$("<LI>").append(c);$("#"+k+" ul").append(b);$(m).attr({"data-height":$(m).height(),id:j.replace("#","")}).hide()}).addClass("uxlTabsBody");$(".uxlGroup").each(function(b,c){if(!$(c).hasClass("uxlGroupNoDefault")){b=$(c).children(":first-child").attr("id");$("[href='#"+b+"']").trigger("click")}})}},openPanel:function(d){var c=$("#"+d).parent();var b=$("#"+d).siblings();var a=parseInt($("#"+d).attr("data-height"));uxl.tabs.closePanel($("#"+d).siblings(".isOpen").attr("id"));$("#"+d).fadeIn().addClass("isOpen");$(c).animate({height:a})},closePanel:function(a){$("#"+a).removeClass("isOpen");jQuery("#"+a).fadeOut(500,function(){jQuery(this).hide()})},closeTab:function(a){jQuery(a).removeClass("isOpen");jQuery(".uxlTabsBody",a).fadeOut(500,function(){jQuery(this).hide()})},openTab:function(c,e){jQuery(c).addClass("isOpen");var g=parseInt(jQuery(c).parent().attr("data-tab-only-height"));var d=parseInt(jQuery(".uxlTabsBody",c).height());jQuery(c).parent().animate({height:(g+d)},500);jQuery(".uxlTabsBody",c).fadeIn();var a=jQuery(window).scrollTop()+jQuery(window).height();var j=jQuery(c).offset().top+g+d+20;if(j>a&&e==undefined){var b=(j-jQuery(window).height());if(b>jQuery(c).offset().top){b=jQuery(c).offset().top-20}jQuery("body").animate({scrollTop:b})}}};jQuery(uxl.events).bind("contentLoad",uxl.tabs.contentLoad);uxl.facet={facetLimit:3,facetData:{},toggleMenu:function(){var a=jQuery(this).parent().parent().parent();if(jQuery(a).hasClass("isClosed")){jQuery(".uxlFacetHideWhenCol",a).each(function(b,e){var c=jQuery(e).css("height","auto").height();jQuery(e).height(0);jQuery(e).animate({height:c,opacity:1},500)});jQuery(a).addClass("isOpen").removeClass("isClosed");jQuery(this).text("Fewer").attr("href",jQuery(this).attr("href").replace("fewer","more"))}else{jQuery(".uxlFacetHideWhenCol",a).animate({height:0,opacity:0},500);jQuery(a).addClass("isClosed").removeClass("isOpen");jQuery(this).text("More").attr("href",jQuery(this).attr("href").replace("more","fewer"))}},getFacetNodeData:function(){jQuery(".uxlFacets > ul > li").each(function(a,c){var b=jQuery(c).attr("id")?jQuery(c).attr("id"):"uxlTabsNode"+a;jQuery(c).attr("id",b);uxl.facet.facetData[b]={nodes:jQuery("ul li",c),title:jQuery.trim(jQuery(c).contents().filter(function(){return this.nodeType==3}).text()),limit:jQuery(c).attr("data-facet-limit")?parseInt(jQuery(c).attr("data-facet-limit")):uxl.facet.facetLimit};uxl.facet.facetData[b].link=uxl.facet.facetData[b].title.toLowerCase().replace(/[^\w]+/g,"-");uxl.facet.renderFacet(b)})},renderFacet:function(e){var c=uxl.facet.facetData[e];var h,g=0,d;h=c.limit-jQuery(c.nodes).filter(".uxlFacetNodeShow").length;var a=jQuery('<div class="uxlFacetWrapper">');var b="<div class='uxlFacetTitle'>"+c.title+"</div>"||"";for(i=0;i<c.nodes.length;i++){if(jQuery(c.nodes[i]).hasClass("uxlFacetNodeShow")||g<h){nodeTypeShouldBe="uxlFacetShowWhenCol";if(!jQuery(c.nodes[i]).hasClass("uxlFacetNodeShow")){g++}}else{nodeTypeShouldBe="uxlFacetHideWhenCol"}if(nodeTypeShouldBe!=d){jQuery(a).append(b);b=jQuery("<ul>").addClass(nodeTypeShouldBe);d=nodeTypeShouldBe}jQuery(b).append(jQuery(c.nodes[i]))}jQuery(a).append(b);jQuery("#"+e).html(a);if(jQuery(".uxlFacetHideWhenCol",a).length>0){jQuery("<a>").text("More").click(uxl.facet.toggleMenu).attr("href","#more-"+c.link).appendTo(a).wrap("<li class='uxlFacetControl'>");jQuery(a).parent().addClass("isClosed");jQuery(".uxlFacetHideWhenCol",a).css("opacity",0)}}};jQuery(uxl.events).bind("contentLoad",uxl.facet.getFacetNodeData);uxl.menus={apply:function(){$(".uxlMenuIconToggleOff a, .uxlMenuIconToggleOn a").click(function(a){$(this).parent().toggleClass("uxlMenuIconToggleOff uxlMenuIconToggleOn");if(f=$(this).parent().attr("data-toggle")){if($(this).parent().hasClass("uxlMenuIconToggleOff")){$(f).hide()}else{$(f).show()}}a.preventDefault()})}};jQuery(uxl.events).bind("contentLoad",uxl.menus.apply);uxl.silverpop={hideField:function(a){$(a).parents("div[id^='container_']").hide()},setField:function(c,b){var a=$.deparam.querystring();if(a[b]){$(c).val(a[b])}else{$(c).val(b)}},clean:function(){$("input").filter("[value='Null']").val("");$("select").each(function(){if($(this).val()=="-"){$(this).val("")}});$("option[value='-']").remove()}};

function openNewWindow(theURL, winName, features) {
	window.open(theURL, winName, features);
}
/* from module-search */
    $("a[data-result-type]").click(function (e) {
        var query = $("meta[name = 'WT.oss']").attr("content");
        var kind = $(this).attr("data-result-type");
        _gaq.push(['_trackEvent', 'Search', 'Kind: ' + kind, query, 0, true]);
        dcsMultiTrack('WT.result_type', kind);
    });
    $("a[data-result-page]").click(function (e) {
        var pgNm = $(this).attr("data-result-page");
        var query = $("meta[name = 'WT.oss']").attr("content");
        dcsMultiTrack('WT.result_page', pgNm);
        _gaq.push(['_trackEvent', 'Search', 'Page Number', query, pgNm, true]);
    });
    $("a[data-result-position]").click(function (e) {
        var pgNm = $(this).attr("data-result-page");
        var query = $("meta[name = 'WT.oss']").attr("content");
        var pgPos = $(this).attr("data-result-position");
        var ovPos = parseInt(pgPos) + ((parseInt(pgNm) - 1) * 10);
        _gaq.push(['_trackEvent', 'Search', 'Position: Page', query, pgPos, true]);
        _gaq.push(['_trackEvent', 'Search', 'Position: Results', query, ovPos, true]);
        dcsMultiTrack('WT.result_position', pgPos);
    });
    $("a[data-result-success]").click(function (e) {
        var query = $("meta[name = 'WT.oss']").attr("content");
        dcsMultiTrack('WT.result_success', $(this).attr("data-result-success"));
        _gaq.push(['_trackEvent', 'Search', 'Click', query, 1, true]);
    });

    var query = $("meta[name = 'WT.oss']").attr("content");
    var results = $("meta[name = 'WT.oss_r']").attr("content");
    if (query != undefined) {
        _gaq.push(['_trackEvent', 'Search', 'Count', query, parseInt(results), true]);
    }

/*  ### from scripts.js
    survey pop-up ### */

    var nowDate = new Date();
    nowDate.setMonth(nowDate.getMonth() + 6);
    dontExpire = nowDate.toGMTString();


function getCookie(name) {
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

function checkSurvey() {

        var pagesviewed = getCookie('ASQClickSurvey01');
        if (pagesviewed == null) pagesviewed = '';

        if (window.location.href.indexOf("/learn-about-quality/") > -1) { /* checks if on LAQ page */

            /* started with duplicate of all survey code, just with LAQ popup, no page check to determine which survey*/
            /* then reduced number of clicks to 3 */

            // if the user has seen the popup do not show it again.  
            if (pagesviewed.indexOf('taken') == -1) {
                //alert("JR2"); 

                parseInt(pagesviewed);
                /* reduced number of clicks to 3 */
                if (pagesviewed >= 3) {


                    var firstHit = getCookie('firstHit');
                    if (firstHit == null) firstHit = '';
                    if (firstHit.indexOf("/qualityprogress/") > -1 || firstHit.indexOf("/quality-progress/") > -1) firstHit = 'QP';
                    else (firstHit = 'ASQ');

                    //alert(firstHit + "  " + firstHit.indexOf('/qualityprogress') ) ;
                    //alert(firstHit + "  " + firstHit.indexOf('/government') ) ;
                    //alert("firstHit");

                   
                    // entering through ASQ or KC triggers ASQ survey, unless it's LAQ - ADDED LAQ EXCEPTION 1/29/2013 BCM
                    
                        document.cookie = 'ASQClickSurvey01=takenLAQ;expires=' + dontExpire + ';path=/;domain=asq.org';
                        window.open("/includes/surveys/click-LAQsurvey-intro.html", "survey", "menubar=no,width=500,height=300,toolbar=no");
                    
                }


                else {
                    //alert("JR3");
                    parseInt(pagesviewed);
                    pagesviewed++;
                    document.cookie = 'ASQClickSurvey01=' + pagesviewed + ';path=/;domain=asq.org';
                    //alert("JR4 cookie: " + document.cookie);
                }

            }
        } else {

            /* alert("JR1a pageviewed: " + pagesviewed  ); */

            /* alert("pagesviewed = " + pagesviewed +
            "; location.href = " + location.href +
            "; indexOf / = " + location.href.indexOf("/")); */

            // if the user has seen the popup do not show it again.  
            if (pagesviewed.indexOf('taken') == -1) {
                //alert("JR2"); 

                parseInt(pagesviewed);
                //if (pagesviewed > 5) {
                // request id 37192 - changing the page views from 5 to 3.
                if (pagesviewed >= 3) {


                    var firstHit = getCookie('firstHit');
                    if (firstHit == null) firstHit = '';
                    if (firstHit.indexOf("/qualityprogress/") > -1 || firstHit.indexOf("/quality-progress/") > -1) firstHit = 'QP';
                    else (firstHit = 'ASQ');

                    //alert(firstHit + "  " + firstHit.indexOf('/qualityprogress') ) ;
                    //alert(firstHit + "  " + firstHit.indexOf('/government') ) ;
                    //alert("firstHit");

                    // entering through QP triggers QP survey
                    if (firstHit == 'QP') {
                        document.cookie = 'ASQClickSurvey01=takenQP;expires=' + dontExpire + ';path=/;domain=asq.org';
                        window.open("/includes/surveys/click-QPsurvey-intro.html", "survey", "menubar=no,width=500,height=280,toolbar=no");
                    }
                    // entering through ASQ or KC triggers ASQ survey, unless it's LAQ - ADDED LAQ EXCEPTION 1/29/2013 BCM
                    else if (window.location.href.indexOf("/learn-about-quality/") > -1) {
                        document.cookie = 'ASQClickSurvey01=takenLAQ;expires=' + dontExpire + ';path=/;domain=asq.org';
                        window.open("/includes/surveys/click-LAQsurvey-intro.html", "survey", "menubar=no,width=500,height=300,toolbar=no");
                    }
                    else {
                        document.cookie = 'ASQClickSurvey01=takenASQ;expires=' + dontExpire + ';path=/;domain=asq.org';
                        window.open("/includes/surveys/click-survey-intro.html", "survey", "menubar=no,width=500,height=300,toolbar=no");
                    }
                }


                else {
                    //alert("JR3");
                    parseInt(pagesviewed);
                    pagesviewed++;
                    document.cookie = 'ASQClickSurvey01=' + pagesviewed + ';path=/;domain=asq.org';
                    //alert("JR4 cookie: " + document.cookie);
                }

            }
        }
    }
jQuery(document).ready(function () {
    checkSurvey();
    console.log("survey check!");
}
    );

/*
### jQuery Star Rating Plugin v3.14 - 2012-01-26 ###
* Home: http://www.fyneworks.com/jquery/star-rating/
* Code: http://code.google.com/p/jquery-star-rating-plugin/
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
###
*/

/*# AVOID COLLISIONS #*/
; if (window.jQuery) (function ($) {
    /*# AVOID COLLISIONS #*/

    // IE6 Background Image Fix
    if ($.browser.msie) try { document.execCommand("BackgroundImageCache", false, true) } catch (e) { };
    // Thanks to http://www.visualjquery.com/rating/rating_redux.html

    // plugin initialization
    $.fn.rating = function (options) {
        if (this.length == 0) return this; // quick fail

        // Handle API methods
        if (typeof arguments[0] == 'string') {
            // Perform API methods on individual elements
            if (this.length > 1) {
                var args = arguments;
                return this.each(function () {
                    $.fn.rating.apply($(this), args);
                });
            };
            // Invoke API method handler
            $.fn.rating[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
            // Quick exit...
            return this;
        };

        // Initialize options for this call
        var options = $.extend(
			{}/* new object */,
			$.fn.rating.options/* default options */,
			options || {} /* just-in-time options */
		);

        // Allow multiple controls with the same name by making each call unique
        $.fn.rating.calls++;

        // loop through each matched element
        this
		 .not('.star-rating-applied')
			.addClass('star-rating-applied')
		.each(function () {

		    // Load control parameters / find context / etc
		    var control, input = $(this);
		    var eid = (this.name || 'unnamed-rating').replace(/\[|\]/g, '_').replace(/^\_+|\_+$/g, '');
		    var context = $(this.form || document.body);

		    // FIX: http://code.google.com/p/jquery-star-rating-plugin/issues/detail?id=23
		    var raters = context.data('rating');
		    if (!raters || raters.call != $.fn.rating.calls) raters = { count: 0, call: $.fn.rating.calls };
		    var rater = raters[eid];

		    // if rater is available, verify that the control still exists
		    if (rater) control = rater.data('rating');

		    if (rater && control)//{// save a byte!
		    // add star to control if rater is available and the same control still exists
		        control.count++;

		    //}// save a byte!
		    else {
		        // create new control if first star or control element was removed/replaced

		        // Initialize options for this rater
		        control = $.extend(
					{}/* new object */,
					options || {} /* current call options */,
					($.metadata ? input.metadata() : ($.meta ? input.data() : null)) || {}, /* metadata options */
					{count: 0, stars: [], inputs: [] }
				);

		        // increment number of rating controls
		        control.serial = raters.count++;

		        // create rating element
		        rater = $('<span class="star-rating-control"/>');
		        input.before(rater);

		        // Mark element for initialization (once all stars are ready)
		        rater.addClass('rating-to-be-drawn');

		        // Accept readOnly setting from 'disabled' property
		        if (input.attr('disabled') || input.hasClass('disabled')) control.readOnly = true;

		        // Accept required setting from class property (class='required')
		        if (input.hasClass('required')) control.required = true;

		        // Create 'cancel' button
		        rater.append(
					control.cancel = $('<div class="rating-cancel"><a title="' + control.cancel + '">' + control.cancelValue + '</a></div>')
					.mouseover(function () {
					    $(this).rating('drain');
					    $(this).addClass('star-rating-hover');
					    //$(this).rating('focus');
					})
					.mouseout(function () {
					    $(this).rating('draw');
					    $(this).removeClass('star-rating-hover');
					    //$(this).rating('blur');
					})
					.click(function () {
					    $(this).rating('select');
					})
					.data('rating', control)
				);

		    }; // first element of group

		    // insert rating star
		    var star = $('<div class="star-rating rater-' + control.serial + '"><a title="' + (this.title || this.value) + '">' + this.value + '</a></div>');
		    rater.append(star);

		    // inherit attributes from input element
		    if (this.id) star.attr('id', this.id);
		    if (this.className) star.addClass(this.className);

		    // Half-stars?
		    if (control.half) control.split = 2;

		    // Prepare division control
		    if (typeof control.split == 'number' && control.split > 0) {
		        var stw = ($.fn.width ? star.width() : 0) || control.starWidth;
		        var spi = (control.count % control.split), spw = Math.floor(stw / control.split);
		        star
		        // restrict star's width and hide overflow (already in CSS)
				.width(spw)
		        // move the star left by using a negative margin
		        // this is work-around to IE's stupid box model (position:relative doesn't work)
				.find('a').css({ 'margin-left': '-' + (spi * spw) + 'px' })
		    };

		    // readOnly?
		    if (control.readOnly)//{ //save a byte!
		    // Mark star as readOnly so user can customize display
		        star.addClass('star-rating-readonly');
		    //}  //save a byte!
		    else//{ //save a byte!
		    // Enable hover css effects
		        star.addClass('star-rating-live')
		    // Attach mouse events
					.mouseover(function () {
					    $(this).rating('fill');
					    $(this).rating('focus');
					})
					.mouseout(function () {
					    $(this).rating('draw');
					    $(this).rating('blur');
					})
					.click(function () {
					    $(this).rating('select');
					})
				;
		    //}; //save a byte!

		    // set current selection
		    if (this.checked) control.current = star;

		    // set current select for links
		    if (this.nodeName == "A") {
		        if ($(this).hasClass('selected'))
		            control.current = star;
		    };

		    // hide input element
		    input.hide();

		    // backward compatibility, form element to plugin
		    input.change(function () {
		        $(this).rating('select');
		    });

		    // attach reference to star to input element and vice-versa
		    star.data('rating.input', input.data('rating.star', star));

		    // store control information in form (or body when form not available)
		    control.stars[control.stars.length] = star[0];
		    control.inputs[control.inputs.length] = input[0];
		    control.rater = raters[eid] = rater;
		    control.context = context;

		    input.data('rating', control);
		    rater.data('rating', control);
		    star.data('rating', control);
		    context.data('rating', raters);
		}); // each element

        // Initialize ratings (first draw)
        $('.rating-to-be-drawn').rating('draw').removeClass('rating-to-be-drawn');

        return this; // don't break the chain...
    };

    /*--------------------------------------------------------*/

    /*
    ### Core functionality and API ###
    */
    $.extend($.fn.rating, {
        // Used to append a unique serial number to internal control ID
        // each time the plugin is invoked so same name controls can co-exist
        calls: 0,

        focus: function () {
            var control = this.data('rating'); if (!control) return this;
            if (!control.focus) return this; // quick fail if not required
            // find data for event
            var input = $(this).data('rating.input') || $(this.tagName == 'INPUT' ? this : null);
            // focus handler, as requested by focusdigital.co.uk
            if (control.focus) control.focus.apply(input[0], [input.val(), $('a', input.data('rating.star'))[0]]);
        }, // $.fn.rating.focus

        blur: function () {
            var control = this.data('rating'); if (!control) return this;
            if (!control.blur) return this; // quick fail if not required
            // find data for event
            var input = $(this).data('rating.input') || $(this.tagName == 'INPUT' ? this : null);
            // blur handler, as requested by focusdigital.co.uk
            if (control.blur) control.blur.apply(input[0], [input.val(), $('a', input.data('rating.star'))[0]]);
        }, // $.fn.rating.blur

        fill: function () { // fill to the current mouse position.
            var control = this.data('rating'); if (!control) return this;
            // do not execute when control is in read-only mode
            if (control.readOnly) return;
            // Reset all stars and highlight them up to this element
            this.rating('drain');
            this.prevAll().andSelf().filter('.rater-' + control.serial).addClass('star-rating-hover');
        }, // $.fn.rating.fill

        drain: function () { // drain all the stars.
            var control = this.data('rating'); if (!control) return this;
            // do not execute when control is in read-only mode
            if (control.readOnly) return;
            // Reset all stars
            control.rater.children().filter('.rater-' + control.serial).removeClass('star-rating-on').removeClass('star-rating-hover');
        }, // $.fn.rating.drain

        draw: function () { // set value and stars to reflect current selection
            var control = this.data('rating'); if (!control) return this;
            // Clear all stars
            this.rating('drain');
            // Set control value
            if (control.current) {
                control.current.data('rating.input').attr('checked', 'checked');
                control.current.prevAll().andSelf().filter('.rater-' + control.serial).addClass('star-rating-on');
            }
            else
                $(control.inputs).removeAttr('checked');
            // Show/hide 'cancel' button
            control.cancel[control.readOnly || control.required ? 'hide' : 'show']();
            // Add/remove read-only classes to remove hand pointer
            this.siblings()[control.readOnly ? 'addClass' : 'removeClass']('star-rating-readonly');
        }, // $.fn.rating.draw





        select: function (value, wantCallBack) { // select a value

            // ***** MODIFICATION *****
            // Thanks to faivre.thomas - http://code.google.com/p/jquery-star-rating-plugin/issues/detail?id=27
            //
            // ***** LIST OF MODIFICATION *****
            // ***** added Parameter wantCallBack : false if you don't want a callback. true or undefined if you want postback to be performed at the end of this method'
            // ***** recursive calls to this method were like : ... .rating('select') it's now like .rating('select',undefined,wantCallBack); (parameters are set.)
            // ***** line which is calling callback
            // ***** /LIST OF MODIFICATION *****

            var control = this.data('rating'); if (!control) return this;
            // do not execute when control is in read-only mode
            if (control.readOnly) return;
            // clear selection
            control.current = null;
            // programmatically (based on user input)
            if (typeof value != 'undefined') {
                // select by index (0 based)
                if (typeof value == 'number')
                    return $(control.stars[value]).rating('select', undefined, wantCallBack);
                // select by literal value (must be passed as a string
                if (typeof value == 'string')
                //return
                    $.each(control.stars, function () {
                        if ($(this).data('rating.input').val() == value) $(this).rating('select', undefined, wantCallBack);
                    });
            }
            else
                control.current = this[0].tagName == 'INPUT' ?
				 this.data('rating.star') :
					(this.is('.rater-' + control.serial) ? this : null);

            // Update rating control state
            this.data('rating', control);
            // Update display
            this.rating('draw');
            // find data for event
            var input = $(control.current ? control.current.data('rating.input') : null);
            // click callback, as requested here: http://plugins.jquery.com/node/1655

            // **** MODIFICATION *****
            // Thanks to faivre.thomas - http://code.google.com/p/jquery-star-rating-plugin/issues/detail?id=27
            //
            //old line doing the callback :
            //if(control.callback) control.callback.apply(input[0], [input.val(), $('a', control.current)[0]]);// callback event
            //
            //new line doing the callback (if i want :)
            if ((wantCallBack || wantCallBack == undefined) && control.callback) control.callback.apply(input[0], [input.val(), $('a', control.current)[0]]); // callback event
            //to ensure retro-compatibility, wantCallBack must be considered as true by default
            // **** /MODIFICATION *****

        }, // $.fn.rating.select





        readOnly: function (toggle, disable) { // make the control read-only (still submits value)
            var control = this.data('rating'); if (!control) return this;
            // setread-only status
            control.readOnly = toggle || toggle == undefined ? true : false;
            // enable/disable control value submission
            if (disable) $(control.inputs).attr("disabled", "disabled");
            else $(control.inputs).removeAttr("disabled");
            // Update rating control state
            this.data('rating', control);
            // Update display
            this.rating('draw');
        }, // $.fn.rating.readOnly

        disable: function () { // make read-only and never submit value
            this.rating('readOnly', true, true);
        }, // $.fn.rating.disable

        enable: function () { // make read/write and submit value
            this.rating('readOnly', false, false);
        } // $.fn.rating.select

    });

    /*--------------------------------------------------------*/

    /*
    ### Default Settings ###
    eg.: You can override default control like this:
    $.fn.rating.options.cancel = 'Clear';
    */
    $.fn.rating.options = { //$.extend($.fn.rating, { options: {
        cancel: 'Cancel Rating',   // advisory title for the 'cancel' link
        cancelValue: '',           // value to submit when user click the 'cancel' link
        split: 0,                  // split the star into how many parts?

        // Width of star image in case the plugin can't work it out. This can happen if
        // the jQuery.dimensions plugin is not available OR the image is hidden at installation
        starWidth: 16//,

        //NB.: These don't need to be pre-defined (can be undefined/null) so let's save some code!
        //half:     false,         // just a shortcut to control.split = 2
        //required: false,         // disables the 'cancel' button so user can only select one of the specified values
        //readOnly: false,         // disable rating plugin interaction/ values cannot be changed
        //focus:    function(){},  // executed when stars are focused
        //blur:     function(){},  // executed when stars are focused
        //callback: function(){},  // executed when a star is clicked
    }; //} });

    /*--------------------------------------------------------*/

    /*
    ### Default implementation ###
    The plugin will attach itself to file inputs
    with the class 'multi' when the page loads
    */
    $(function () {
        $('input[type=radio].star').rating();
    });



    /*# AVOID COLLISIONS #*/
})(jQuery);
/*# AVOID COLLISIONS #*/


/* ----- ARW 11-13-2012 Script for adding tweets ----- */


(function ($) {

    $.fn.tweet = function (o) {
        var s = {
            username: ["seaofclouds"],              // [string]   required, unless you want to display our tweets. :) it can be an array, just do ["username1","username2","etc"]
            list: null,                              //[string]   optional name of list belonging to username
            avatar_size: null,                      // [integer]  height and width of avatar if displayed (48px max)
            count: 3,                               // [integer]  how many tweets to display?
            intro_text: null,                       // [string]   do you want text BEFORE your your tweets?
            outro_text: null,                       // [string]   do you want text AFTER your tweets?
            join_text: null,                       // [string]   optional text in between date and tweet, try setting to "auto"
            auto_join_text_default: "i said,",      // [string]   auto text for non verb: "i said" bullocks
            auto_join_text_ed: "i",                 // [string]   auto text for past tense: "i" surfed
            auto_join_text_ing: "i am",             // [string]   auto tense for present tense: "i was" surfing
            auto_join_text_reply: "i replied to",   // [string]   auto tense for replies: "i replied to" @someone "with"
            auto_join_text_url: "i was looking at", // [string]   auto tense for urls: "i was looking at" http:...
            loading_text: null,                     // [string]   optional loading text, displayed while tweets load
            query: null                             // [string]   optional search query
        };

        if (o) $.extend(s, o);

        $.fn.extend({
            linkUrl: function () {
                var returning = [];
                var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
                this.each(function () {
                    returning.push(this.replace(regexp, "<a href=\"$1\">$1</a>"));
                });
                return $(returning);
            },
            linkUser: function () {
                var returning = [];
                var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
                this.each(function () {
                    returning.push(this.replace(regexp, "<a href=\"http://twitter.com/$1\">@$1</a>"));
                });
                return $(returning);
            },
            linkHash: function () {
                var returning = [];
                var regexp = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
                this.each(function () {
                    returning.push(this.replace(regexp, ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all&from=' + s.username.join("%2BOR%2B") + '">#$1</a>'));
                });
                return $(returning);
            },
            capAwesome: function () {
                var returning = [];
                this.each(function () {
                    returning.push(this.replace(/\b(awesome)\b/gi, '<span class="awesome">$1</span>'));
                });
                return $(returning);
            },
            capEpic: function () {
                var returning = [];
                this.each(function () {
                    returning.push(this.replace(/\b(epic)\b/gi, '<span class="epic">$1</span>'));
                });
                return $(returning);
            },
            makeHeart: function () {
                var returning = [];
                this.each(function () {
                    returning.push(this.replace(/(&lt;)+[3]/gi, "<tt class='heart'>&#x2665;</tt>"));
                });
                return $(returning);
            }
        });

        function parse_date(date_str) {
            // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
            // cannot handle in IE. We therefore perform the following transformation:
            // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
            return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
        }

        function relative_time(time_value) {
            var parsed_date = parse_date(time_value);
            var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
            var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
            var pluralize = function (singular, n) {
                return '' + n + ' ' + singular + (n == 1 ? '' : 's');
            };
            if (delta < 60) {
                return 'less than a minute ago';
            } else if (delta < (60 * 60)) {
                return 'about ' + pluralize("minute", parseInt(delta / 60)) + ' ago';
            } else if (delta < (24 * 60 * 60)) {
                return 'about ' + pluralize("hour", parseInt(delta / 3600)) + ' ago';
            } else {
                return 'about ' + pluralize("day", parseInt(delta / 86400)) + ' ago';
            }
        }

        function build_url() {
            var proto = ('https:' == document.location.protocol ? 'https:' : 'http:');
            if (s.list) {
                return proto + "//api.twitter.com/1/" + s.username[0] + "/lists/" + s.list + "/statuses.json?per_page=" + s.count + "&callback=?";
            } else if (s.query == null && s.username.length == 1) {
                return proto + '//api.twitter.com/1/statuses/user_timeline.json?screen_name=' + s.username[0] + '&count=' + s.count + '&callback=?';
            } else {
                var query = (s.query || 'from:' + s.username.join(' OR from:'));
                return proto + '//search.twitter.com/search.json?&q=' + escape(query) + '&rpp=' + s.count + '&callback=?';
            }
        }

        return this.each(function (i, widget) {
            var list = $('<ul class="tweet_list">').appendTo(widget);
            var intro = '<p class="tweet_intro">' + s.intro_text + '</p>';
            var outro = '<p class="tweet_outro">' + s.outro_text + '</p>';
            var loading = $('<p class="loading">' + s.loading_text + '</p>');

            if (typeof (s.username) == "string") {
                s.username = [s.username];
            }

            if (s.loading_text) $(widget).append(loading);
            $.getJSON(build_url(), function (data) {
                if (s.loading_text) loading.remove();
                if (s.intro_text) list.before(intro);
                var tweets = (data.results || data);
                $.each(tweets, function (i, item) {
                    // auto join text based on verb tense and content
                    if (s.join_text == "auto") {
                        if (item.text.match(/^(@([A-Za-z0-9-_]+)) .*/i)) {
                            var join_text = s.auto_join_text_reply;
                        } else if (item.text.match(/(^\w+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+) .*/i)) {
                            var join_text = s.auto_join_text_url;
                        } else if (item.text.match(/^((\w+ed)|just) .*/im)) {
                            var join_text = s.auto_join_text_ed;
                        } else if (item.text.match(/^(\w*ing) .*/i)) {
                            var join_text = s.auto_join_text_ing;
                        } else {
                            var join_text = s.auto_join_text_default;
                        }
                    } else {
                        var join_text = s.join_text;
                    };

                    var from_user = item.from_user || item.user.screen_name;
                    var profile_image_url = item.profile_image_url || item.user.profile_image_url;
                    var join_template = '<span class="tweet_join"> ' + join_text + ' </span>';
                    var join = ((s.join_text) ? join_template : ' ');
                    var avatar_template = '<a class="tweet_avatar" href="http://twitter.com/' + from_user + '"><img src="' + profile_image_url + '" height="' + s.avatar_size + '" width="' + s.avatar_size + '" alt="' + from_user + '\'s avatar" title="' + from_user + '\'s avatar" border="0"/></a>';
                    var avatar = (s.avatar_size ? avatar_template : '');
                    var date = '<span class="tweet_time"><a href="http://twitter.com/' + from_user + '/statuses/' + item.id + '" title="view tweet on twitter">' + relative_time(item.created_at) + '</a></span>';
                    var text = '<span class="tweet_text">' + $([item.text]).linkUrl().linkUser().linkHash().makeHeart().capAwesome().capEpic()[0] + '</span>';

                    // until we create a template option, arrange the items below to alter a tweet's display.
                    list.append('<li>' + avatar + date + join + text + '</li>');

                    list.children('li:first').addClass('tweet_first');
                    list.children('li:odd').addClass('tweet_even');
                    list.children('li:even').addClass('tweet_odd');
                });
                if (s.outro_text) list.after(outro);
                $(widget).trigger("loaded").trigger((tweets.length == 0 ? "empty" : "full"));
            });

        });
    };
})(jQuery);

// REMOVED CLICKTALE BCM 27 JUN 2014