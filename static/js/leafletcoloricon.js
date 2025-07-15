//USED
function getIcon(path) {
	return new L.icon({
		iconUrl: mapIconPath + path,
		iconSize: [36, 36],
		iconAnchor: [12, 41],
		popupAnchor: [-1, 34],
		shadowSize: [41, 41]
	});

}


var greenIcon = getIcon('marker-icon-2x-Green.png');
var orangeIcon = getIcon('marker-icon-2x-Orange.png');
var brownIcon = getIcon('marker-icon-2x-Brown.png');
var limeIcon = getIcon('marker-icon-2x-Lime.png');
var yellowIcon = getIcon('marker-icon-2x-gold.png');
var redIcon = getIcon('marker-icon-2x-Red.png');
var purpleIcon = getIcon('marker-icon-2x-Purple.png');
var greyIcon = getIcon('red-meter.png');
var blueIcon = getIcon('marker-icon-2x-blue.png');
var tank = getIcon('water_tank.png');
var waterMeter = getIcon('water-meter-new.png');
var shenitech = getIcon('sheni-new.png');
var borewell = getIcon('borewell.png')
var nottank = getIcon('not_watertank.png');
var notwaterMeter = getIcon('not-water-meter-new.png');
var notshenitech = getIcon('not-sheni-new.png');
var notborewell = getIcon('not_borewell.png')