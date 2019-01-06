// SW JSON thanks to codepen.io/banik/pen/PyQdVj
// Valspar JSON scraped from askval.com/Colors by me
// 5,124 total colours indexed

// define spectrum color picker
$("#custom").spectrum({
	flat: true,
	showInput: true,
	showAlpha: false,
	preferredFormat: "rgb",
	color: "rgb(255, 255, 255)",
	chooseText: "Convert",
	cancelText: "Clear"
});
// spectrum button submit
$(".sp-cancel").on("click", function() {
	$("#results, iframe").css("display", "none");
	$("h1").text("Enter Your Colour");
});
// spectrum cancel
$(".sp-choose").on("click", function() {
	var t = $("#custom").spectrum("get");
	checkSources(t);
});
// spectrum text submit
$(".sp-input").keypress(function(e) {
	if (e.keyCode == 13 || e.which == 13) {
		var t = $("#custom").spectrum("get");
		checkSources(t);
		e.preventDefault();
	}
});
// check all sources for matches
var valExMatch = {};
var swExMatch = {};
function checkSources(t) {
	if (searchValspar(t)) {
		exactMatch(valExMatch);
	} else if (searchSw(t)) {
		exactMatch(swExMatch);
	} else {
		fuzzyMatch(t);
	}
}
// search "valObj" in external javascript file
function searchValspar(t) {
	var query = t.toString();
	var inObj = valObj[0];
	var colls = Object.keys(inObj).length;
	for (var i = 0; i < colls; i++) {
		var colours = Object.keys(inObj[i]).length;
		for (var j = 0; j < colours; j++) {
			var currCode = inObj[i][j].code;
			if (currCode === query) {
				valExMatch = inObj[i][j];
				return true;
			}
		}
	}
}
// search "valObj" in external javascript file
function searchSw(t) {
	var query = t.toHexString().split("#")[1];
	var inObj = swObj[0];
	var colls = Object.keys(inObj).length;
	for (var i = 0; i < colls; i++) {
		var currCode = inObj[i].code;
		if (currCode === query) {
			swExMatch = inObj[i];
			return true;
		}
	}
}
// convert rgb string to valspar url format
function fuzzyMatch(t) {
	var text = t.toString();
	var output = text;
	// capture everything but bare rgb values
	var matches = /(rgb\()\d{1,3}(, )\d{1,3}(, )\d{1,3}(\))/g.exec(text);
	// url params, plus empty string to replace the closing ")"
	var convert = ["r=", "&g=", "&b=", ""];
	// replace match groups with url params
	for (i = 1; i < matches.length; i++) {
		output = output.replace(matches[i], convert[i - 1]);
	}
	if ($("#results").length) {
		$("#results").css("display", "none");
	}
	if ($(".funFact").length) {
		$(".funFact").hide();
	}
	// add iframe on first submit, else replace src
	if ($("iframe").length === 0) {
		$("h1").text("Here It Is!");
		$("body").append(
			'<iframe src="https://www.askval.com/ColorDetail?' + output + '"></iframe>'
		);
	} else {
		$("iframe").prop("src", "https://www.askval.com/ColorDetail?" + output);
	}
}
// show exact match data
function exactMatch(e, recall) {
	var exString = JSON.stringify(e);
	var exName = e.name;
	var exCode = e.code;
	var exRetailer = e.retailer;
	var exNumber = e.number;
	var exDupe = e.dupe;
	if (exCode.indexOf("rgb")) {
		exCode = "#" + exCode;
	}
	$("h1").text("Exact Match!");
	$(".funFact").show();
	if (!recall) {
		if ($("card")) {
			$("card").remove();
		}
	}
	$("#results")
		.css("display", "block")
		.append(
		"<card><colour style='background-color:"+exCode+"'></colour><ul style='border-color:"+exCode+"'><li class='exNumber'>" +
		exNumber +
		"</li><li class='exName'>" +
		exName +
		"</li><li class='exRetailer'>" +
		checkRetailer(exRetailer) +
		"</li></ul></card>"
	);
	function checkRetailer(r) {
		if (r === "Sherwin Williams") {
			return "From " + r;
		} else {
			return "From Valspar, via " + r;
		}
	}
	// $("card colour").css("background-color", exCode);
	// $("card ul").css("border-color", exCode);
	if ($("iframe").length) {
		$("iframe").remove();
	}
	if (exDupe) {
		console.log(exDupe);
		if (Array.isArray(exDupe)) {
			exactDupe(exDupe);
		} else {
			exactDupe([exDupe]);
		}
	}
}
function exactDupe(d) {
	d.forEach(function(query) {
		var inObj = valObj[0];
		var colls = Object.keys(inObj).length;
		for (var i = 0; i < colls; i++) {
			var colours = Object.keys(inObj[i]).length;
			for (var j = 0; j < colours; j++) {
				var currNumber = inObj[i][j].number;
				if (currNumber === query) {
					valExMatch = inObj[i][j];
					exactMatch(valExMatch, 1);
				}
			}
		}
	});
}