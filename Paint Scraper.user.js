// ==UserScript==
// @name           Paint Scraper
// @description    Scrapes colour info from Valspar
// @include        https://www.askval.com/ColorGroup?grp=*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant          GM_setValue
// @grant          GM_getValue
// @version        1.0
// ==/UserScript==
var clrCollection = $('h2').text();
var clrRetailer = window.location.search.split('ret=')[1];
var giantList = [];
var test = localStorage.getItem('master');
$(".content-list li.nav-item").each(function(i) {
	var clrName = $(this).find('.color-name').text();
	var clrRgb = $(this).find('.color-block').attr('style').split(': ')[1].replace(';','');
	var clrNum = $(this).find('.color-number').text().split(' |')[0];
	giantList[i] = {
		name: clrName,
		number: clrNum,
		collection: clrCollection,
		retailer: clrRetailer,
		code: clrRgb
	}
});

if (test) {
	test = JSON.parse(test);
} else {
	test = [];
}
test.push(giantList);
localStorage.setItem('master', JSON.stringify(test));
console.log(test);