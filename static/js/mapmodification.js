//USED
var map;
var m_water = []; // Data for Prawah/Shenitech Water Meters
var datawater10 = latestdatawater;

var datatank5 = latest_tankdata;
var m_tank = [];
var databorewell5 = latest_borewelldata;
var m_borewell = []


// Groups for markers
var Tank_layer = L.layerGroup();
var Borewell_layer = L.layerGroup();
var Sump_layer = L.layerGroup();
var Meters_Analog_layer = L.layerGroup();
var Meters_Digital_layer = L.layerGroup();


// Render variables
const map_nodes = {
	All_nodes: "All_nodes",
	Tank_nodes: "Tank_nodes",
	Borewell_nodes: "Borewell_nodes",
	Sump_nodes: "Sump_nodes",
	Meters_Analog_nodes: "Meters_Analog_nodes",
	Meters_Digital_nodes: "Meters_Digital_nodes",
	Pipelines: "Pipelines",
}

var Render_nodes = map_nodes.All_nodes;
var Render_Index = "Show";
var legend1 = null;


// Custon Icons for markers
L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

// Creates a black marker with the meter icon
var blackMarker = L.AwesomeMarkers.icon({
	icon: 'home',
	markerColor: 'red'
});


// Build the Index/Map Legend 
function legendinitiate(map) {
	if (legend1 != null) {
		return;
	}

	legend1 = L.control({
		position: "bottomleft"
	});
	// console.log(legend1.getContainer());

	legend1.onAdd = function (map) {
		var outerDiv = L.DomUtil.create("div", "legend");
		var div = L.DomUtil.create("div", "inner-legend1");

		var indexHTML = `
			<div id='IDIV' onmousedown='return false;' onselectstart='return false;'>
				<button id='btn' onclick='myFunction();'><b>index</b></button>
			</div>
			<div id='myDIV' onmousedown='return false;' onselectstart='return false;'>
				<div id='inDIV'>
					<table>
						<tbody>
							<br>
							<tr>
								<th colspan='2'>
									<div id='xdiv' onmousedown='return false;' onselectstart='return false;'>
										<h4>INDEX
											<button onclick='hideFunction()' style='float:right; border:none; background-color: transparent;'>
												<i class='fa-sharp fa-solid fa-xmark' style='color:#141415;'></i>
											</button>
										</h4>
									</div>
								</th>
							</tr>
							<tr align='center'>
								<td>
									<img src='static/js/img-ap/water_tank.png' height='50' width='50'>
									<label for='Tank_check'>
										<input type='checkbox' id='Tank_check' class='myCheckbox1' onclick='tanknodes()'>
									</label>
								</td>
								<td>
									<img src='static/js/img-ap/water-meter-new.png' height='50' width='50'>
									<label for='Analog_check'>
										<input type='checkbox' id='Analog_check' class='myCheckbox1' onclick='analognodes()'>
									</label>
								</td>
							</tr>
							<tr align='center'>
								<td>Water Tank</td>
								<td>Prawah</td>
							</tr>
							<tr align='center'>
								<td>
									<img src='static/js/img-ap/sheni-new.png' height='50' width='50'>
									<label for='Digital_check'>
										<input type='checkbox' id='Digital_check' class='myCheckbox1' onclick='digitalnodes()'>
									</label>
								</td>
								<td>
									<img src='static/js/img-ap/sump.png' height='50' width='50'>
									<label for='Sump_check'>
										<input type='checkbox' id='Sump_check' class='myCheckbox1' onclick='sumpnodes()'>
									</label>
								</td>
							</tr>
							<tr align='center'>
								<td>Shenitech Water Meter</td>
								<td>Sump</td>
							</tr>
							<tr align='center'>
								<td>
									<img src='static/js/img-ap/borewell.png' height='50' width='50'>
									<label for='Borewell_check'>
										<input type='checkbox' id='Borewell_check' class='myCheckbox1' onclick='borewellnodes()'>
									</label>
								</td>
								<td>
									<img src='static/js/img-ap/pipeline(1).png' height='10' width='25'>
									<label for='Pipe_check'>
										<input type='checkbox' id='Pipe_check' class='myCheckbox1' onclick='pipelines()'>
									</label>
								</td>
							</tr>
							<tr align='center'>
								<td>Bore Well</td>
								<td>Pipe Line</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>`;

		div.innerHTML += indexHTML;
		outerDiv.appendChild(div);
		return outerDiv;
	};

	legend1.addTo(map);
	return legend1;
}


function marker(map, m) {
	for (var elem in m) {
		m[elem].marker.bindTooltip(m[elem].name).addTo(map);
	}
}


////////////////////////////////////
function assignvalue_water(json) {
	datawater10 = json
}

function assignvalue_tank(json) {
	datatank5 = json
}
function assignvalue_borewell(json) {
	databorewell5 = json
}
////////////////////////////////////


///////////////////////////////////
function datamin() {
	$.ajax({
		url: water_url_data_10minutes,
		dataType: 'json',
		success: function (res) {
			assignvalue_water(res);
		}
	})
}

function tankmin() {
	$.ajax({
		url: tank_url_data,
		dataType: 'json',
		success: function (res) {
			assignvalue_tank(res);
		}
	})
}
function borewellmin() {
	$.ajax({
		url: borewell_url_data,
		dataType: 'json',
		success: function (res) {
			assignvalue_borewell(res);
		}
	})
}
///////////////////////////////////


////////////////////////////////////
function initiate() {
	setContent(param, latestdatawater, m_water);
}

function initiatank() {
	setContent(param, latest_tankdata, m_tank);
}
function initiateborewell() {
	setContent(param, latest_borewelldata, m_borewell);
}
////////////////////////////////////


async function update(parameter, map) {
	let promise_10mins = new Promise((resolve, reject) => {
		datamin();

		tankmin();
		borewellmin();

		setTimeout(function () {
			resolve("Success")
		}, 250)
	})
	promise_10mins.then((successMessage) => { }).then(() => {
		if (nodetype == 1) {
			setContent(parameter, datawater10, m_water);

			setContent(parameter, datatank5, m_tank);
			setContent(parameter, databorewell5, m_borewell);
		}
	});

}


// Marker Testing
function add_markers(data) {
	for (var elem in data) {
		var name = data[elem].name
		cood = {
			lat: data[elem].coordinates[0],
			lon: data[elem].coordinates[1]
		}

		let si = latestdatawater[name]?.created_at;
		let timeDifferenceInHours = 10;
		if (si) {
			var parts = si.split(' ');
			var dateParts = parts[0].split('-');
			var timeParts = parts[1].split(':');
			var day = parseInt(dateParts[0], 10);
			var month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
			var year = parseInt(dateParts[2], 10);
			var hour = parseInt(timeParts[0], 10);
			var minute = parseInt(timeParts[1], 10);
			var second = parseInt(timeParts[2], 10);
			var lastDataTime = new Date(year, month, day, hour, minute, second);
			// const lastDataTime = new Date(si);
			const presentTime = new Date();
			// lastDataTime.setFullYear(presentTime.getFullYear());
			const lastDataTimes = new Date(lastDataTime);
			const timeDifferenceInSeconds = Math.floor((presentTime.getTime() - lastDataTimes.getTime()) / 1000);
			// const timeDifference = presentTime - lastDataTime;
			timeDifferenceInHours = timeDifferenceInSeconds / (60 * 60);
		}

		if (timeDifferenceInHours <= 3 && (data[elem].parameters.includes('isanalog') && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Analog_nodes))) {
			temp = {
				marker: L.marker(cood, {
					icon: waterMeter // test marker

				}).addTo(Meters_Analog_layer),
				name: name,
				layer: Meters_Analog_layer
			}
			m_water.push(temp);
			//console.log("Analog meter added",name);
		}
		else if (timeDifferenceInHours > 3 && (data[elem].parameters.includes('isanalog') && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Analog_nodes))) {
			temp = {
				marker: L.marker(cood, {
					icon: notwaterMeter // test marker

				}).addTo(Meters_Analog_layer),
				name: name,
				layer: Meters_Analog_layer
			}
			m_water.push(temp);
			//console.log("Analog meter added",name);
		}
		else if (timeDifferenceInHours <= 3 && (!data[elem].parameters.includes('isanalog') && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Digital_nodes))) {
			var temp = {
				marker: L.marker(cood, {
					icon: shenitech
				}).addTo(Meters_Digital_layer),
				name: name,
				layer: Meters_Digital_layer
			}
			m_water.push(temp);
			//console.log("Digital meter added",name);
		}
		else if (timeDifferenceInHours > 3 && (!data[elem].parameters.includes('isanalog') && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Digital_nodes))) {
			var temp = {
				marker: L.marker(cood, {
					icon: notshenitech
				}).addTo(Meters_Digital_layer),
				name: name,
				layer: Meters_Digital_layer
			}
			m_water.push(temp);
			//console.log("Digital meter added",name);
		}
	}
}


function add_markers_tank(data) {
	for (var elem in data) {
		var name = data[elem].name
		cood = {
			lat: data[elem].coordinates[0],
			lon: data[elem].coordinates[1]
		}

		let si = latest_tankdata[name]?.created_at;
		// let last = datagraphtank[name].tooltiplabel[si-1];
		let timeDifferenceInHours = 10;
		if (si) {
			var parts = si.split(' ');
			var dateParts = parts[0].split('-');
			var timeParts = parts[1].split(':');
			var day = parseInt(dateParts[0], 10);
			var month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
			var year = parseInt(dateParts[2], 10);
			var hour = parseInt(timeParts[0], 10);
			var minute = parseInt(timeParts[1], 10);
			var second = parseInt(timeParts[2], 10);
			var lastDataTime = new Date(year, month, day, hour, minute, second);
			// const lastDataTime = new Date(last);
			const presentTime = new Date();
			lastDataTime.setFullYear(presentTime.getFullYear());
			const lastDataTimes = new Date(lastDataTime);
			const timeDifferenceInSeconds = Math.floor((presentTime.getTime() - lastDataTimes.getTime()) / 1000);
			// const timeDifference = presentTime - lastDataTime;
			timeDifferenceInHours = timeDifferenceInSeconds / (60 * 60);
		}

		if ((timeDifferenceInHours > 3 || timeDifferenceInHours < 0) && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Tank_nodes)) {
			temp = {
				marker: L.marker(cood, {
					icon: nottank // test marker
				}).addTo(Tank_layer),
				name: name,
				layer: Tank_layer
			}
			m_tank.push(temp);
		}
		else if (timeDifferenceInHours <= 3 && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Tank_nodes)) {
			temp = {
				marker: L.marker(cood, {
					icon: tank // test marker
				}).addTo(Tank_layer),
				name: name,
				layer: Tank_layer
			}
			m_tank.push(temp);
			//console.log("Analog meter added",name);
		}
		// else if (Render_nodes==map_nodes.All_nodes || Render_nodes==map_nodes.Meters_Digital_nodes){
		// 	var temp = {
		// 		marker: L.marker(cood, {
		// 			icon: shenitech
		// 		}).addTo(Meters_Digital_layer),
		// 		name: name,
		// 		layer: Meters_Digital_layer
		// 	}
		// 	m_water.push(temp);
		// 	//console.log("Digital meter added",name);
		// }
	}
}


function add_markers_borewell(data) {
	for (var elem in data) {
		var name = data[elem].name
		cood = {
			lat: data[elem].coordinates[0],
			lon: data[elem].coordinates[1]
		}

		let si = latest_borewelldata[name]?.created_at;
		// let last = datagraphtank[name].tooltiplabel[si-1];
		let timeDifferenceInHours = 10;
		if (si) {
			var parts = si.split(' ');
			var dateParts = parts[0].split('-');
			var timeParts = parts[1].split(':');
			var day = parseInt(dateParts[0], 10);
			var month = parseInt(dateParts[1], 10) - 1; // Month is zero-based (0-11)
			var year = parseInt(dateParts[2], 10);
			var hour = parseInt(timeParts[0], 10);
			var minute = parseInt(timeParts[1], 10);
			var second = parseInt(timeParts[2], 10);
			var lastDataTime = new Date(year, month, day, hour, minute, second);
			const presentTime = new Date();
			lastDataTime.setFullYear(presentTime.getFullYear());
			const lastDataTimes = new Date(lastDataTime);
			const timeDifferenceInSeconds = Math.floor((presentTime.getTime() - lastDataTimes.getTime()) / 1000);
			// const timeDifference = presentTime - lastDataTime;
			timeDifferenceInHours = timeDifferenceInSeconds / (60 * 60);
		}

		if (((timeDifferenceInHours <= 3 && timeDifferenceInHours > 0) && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Borewell_nodes))) {
			temp = {
				marker: L.marker(cood, {
					icon: borewell // test marker
				}).addTo(Borewell_layer),
				name: name,
				layer: Borewell_layer
			}
			m_borewell.push(temp);
			//console.log("Analog meter added",name);
		}
		else if ((timeDifferenceInHours > 3) && (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Borewell_nodes)) {
			temp = {
				marker: L.marker(cood, {
					icon: notborewell // test marker
				}).addTo(Borewell_layer),
				name: name,
				layer: Borewell_layer
			}
			m_borewell.push(temp);
			//console.log("Analog meter added",name);
		}
		// else if (Render_nodes==map_nodes.All_nodes || Render_nodes==map_nodes.Meters_Digital_nodes){
		// 	var temp = {
		// 		marker: L.marker(cood, {
		// 			icon: shenitech
		// 		}).addTo(Meters_Digital_layer),
		// 		name: name,
		// 		layer: Meters_Digital_layer
		// 	}
		// 	m_water.push(temp);
		// 	//console.log("Digital meter added",name);
		// }
	}
}


function add_marker_tooltip(map, m) {
	for (let elem in m) {
		if (Render_nodes != map_nodes.All_nodes &&
			((m[elem].layer == Meters_Analog_layer && Render_nodes != map_nodes.Meters_Analog_nodes) || (m[elem].layer == Meters_Digital_layer && Render_nodes != map_nodes.Meters_Digital_nodes)))
			continue;

		let temp_name = "Not working";
		let node_name = m[elem].name;

		if ((typeof latestdatawater != 'undefined') && node_name in latestdatawater) {
			var created_at = latestdatawater[node_name].created_at;
			var dateTime = created_at.split(" ");
			var date = dateTime[0];
			var time = dateTime[1];
			var timeWithoutSeconds = time.split(":").slice(0, -1).join(":");
			var formattedDate = date + " " + timeWithoutSeconds;
			temp_name = String("<b><em>" + node_name + "</em></b>" + "<br>" + "Total Flow:&nbsp" + latestdatawater[node_name].totalflow +
				"<br>" + "Flow Rate:&nbsp" + latestdatawater[node_name].flowrate + "<br>" + "Updated:&nbsp" + formattedDate);
		}

		m[elem].marker.bindTooltip(temp_name, {
			interactive: true,
			direction: "bottom"
		}).addTo(m[elem].layer);

		m[elem].marker._icon.id = node_name + "marker";
		document.getElementById(node_name + "marker").onclick = function () {
			$('#GraphModal').modal('toggle');
			document.getElementById("myModalLabel").innerHTML = node_name;

			if ((typeof datagraphwater != 'undefined') && node_name in datagraphwater) {
				graphData = datagraphwater[node_name];
			}
		};
	}
}


function add_marker_tooltip_tank(map, m) {

	for (let elem in m) {
		if (Render_nodes != map_nodes.All_nodes &&
			((m[elem].layer == Tank_layer && Render_nodes != map_nodes.Tank_nodes)))
			continue;

		let temp_name = "Not working";
		let node_name = m[elem].name;


		if ((typeof latest_tankdata != 'undefined') && node_name in latest_tankdata) {
			var created_at = latest_tankdata[node_name].created_at;
			var dateTime = created_at.split(" ");
			var date = dateTime[0];
			var time = dateTime[1];
			var timeWithoutSeconds = time.split(":").slice(0, -1).join(":");
			var formattedDate = date + " " + timeWithoutSeconds;
			temp_name = String("<b><em>" + node_name + "</em></b>" + "<br>" + "Current Volume:&nbsp" + latest_tankdata[node_name].curr_volume + "<br>" + "Water Level:&nbsp" + latest_tankdata[node_name].water_level + "<br>" + "Temperature:&nbsp" + latest_tankdata[node_name].temp + "<br>" + "Updated:&nbsp" + formattedDate);
		}

		// if (datagraphtank[node_name].label) {

		// }
		// let si = datagraphtank[node_name].tooltiplabel.length;
		// let last = datagraphtank[node_name].tooltiplabel[si-1];
		// const lastDataTime = new Date(last);
		// // console.log(lastDataTime);
		// const presentTime = new Date();
		// lastDataTime.setFullYear(presentTime.getFullYear());
		// const lastDataTimes = new Date(lastDataTime);
		// console.log(lastDataTimes);
		// const timeDifferenceInSeconds = Math.floor((presentTime.getTime() - lastDataTimes.getTime()) / 1000);
		// console.log(timeDifferenceInSeconds);
		// const timeDifference = presentTime - lastDataTime;
		// const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);
		// console.log(timeDifferenceInHours);
		// if(timeDifferenceInHours>2){
		// 	temp = {
		// 		marker: L.marker(cood, {
		// 			icon: borewell // test marker
		// 		}).addTo(Tank_layer),
		// 		name: name,
		// 		layer: Tank_layer
		// 	}
		// 	m_tank.push(temp);
		// }

		m[elem].marker.bindTooltip(temp_name, {
			interactive: true,
			direction: "bottom"
		}).addTo(m[elem].layer);

		console.log(m[elem].marker._icon.id)
		m[elem].marker._icon.id = node_name + "marker";
		document.getElementById(node_name + "marker").onclick = function () {
			$('#GraphModal').modal('toggle');
			document.getElementById("myModalLabel").innerHTML = node_name;

			if ((typeof datagraphtank != 'undefined') && node_name in datagraphtank) {
				graphData = datagraphtank[node_name];
			}
		};
	}
}


function add_marker_tooltip_borewell(map, m) {

	for (let elem in m) {
		if (Render_nodes != map_nodes.All_nodes &&
			((m[elem].layer == Borewell_layer && Render_nodes != map_nodes.Borewell_nodes)))
			continue;

		let temp_name = "Not working";
		let node_name = m[elem].name;

		if ((typeof latest_borewelldata != 'undefined') && node_name in latest_borewelldata) {
			var created_at = latest_borewelldata[node_name].created_at;
			var dateTime = created_at.split(" ");
			var date = dateTime[0];
			var time = dateTime[1];
			var timeWithoutSeconds = time.split(":").slice(0, -1).join(":");
			var formattedDate = date + " " + timeWithoutSeconds;
			// let wi = datagraphborewell[node_name].tooltiplabel.length;
			// let last = datagraphborewell[node_name].tooltiplabel[wi-1];

			temp_name = String("<b><em>" + node_name + "</em></b>" + "<br>" + "Water Level:&nbsp" + latest_borewelldata[node_name].water_level + "<br>" + "Updated:&nbsp" + formattedDate);
		}

		m[elem].marker.bindTooltip(temp_name, {
			interactive: true,
			direction: "bottom"
		}).addTo(m[elem].layer);

		m[elem].marker._icon.id = node_name + "marker";
		document.getElementById(node_name + "marker").onclick = function () {
			$('#GraphModal').modal('toggle');
			document.getElementById("myModalLabel").innerHTML = node_name;

			if ((typeof datagraphborewell != 'undefined') && node_name in datagraphborewell) {
				graphData = datagraphborewell[node_name];
			}
		};
	}
}


// Coordinates for meters
var PH0100_coords = [17.44569406326424, 78.35106044604086];
var PH0300_coords = [17.443354319948497, 78.34915055527897];
var PH0301_coords = [17.442827183975563, 78.34938126965041];
var PH0302_coords = [17.4424868537213, 78.34965217276277];
var PH0303_coords = [17.443019108416138, 78.35002495542388];
var PH0300A_coords = [17.443633235944663, 78.34882600798592];
var H02_coords = [17.444874413411647, 78.34958335377839];
var H01_coords = [17.445066326533762, 78.34977915503782];
var PH02_coords = [17.446230849938598, 78.34898293018342];
var PR0070_coords = [17.446980307205415, 78.34765791893007];
var KB0472_coords = [17.445166121277442, 78.34924539544016];
var KB0473_coords = [17.445355475256317, 78.34945192553575];
var PL0070_coords = [17.44407158256472, 78.34583380854033];
var PL0071_coords = [17.444787159568232, 78.34612905979156];
var PH0470_coords = [17.44789564904833, 78.34882071940228];
var PH0471_coords = [17.44803894182678, 78.34909966913982];
var VN0470_coords = [17.445643856527443, 78.34970085986416];
var VN0471_coords = [17.445431283570784, 78.35028514438183];
var BB1_coords = [17.445626711694263, 78.34914078928786];
var BB0_coords = [17.445416887315332, 78.34894230581938];
// Coordinates for sumps
var PH04sump_coords = [17.44783894182678, 78.34930966913982];
var PH02sump_coords = [17.446530849938598, 78.34918293018342];
var PH03sump_coords = [17.44303190276076, 78.34952338233461];
var STRAYsump_coords = [17.445000161494846, 78.35012613521576];
var OBHsump_coords = [17.444306991279152, 78.34545829059722];
var PH0302sump_coords = [17.442765780208067, 78.3498425652096];
var nbhsump_coords = [17.446785341039817, 78.34716222736283];
var mainsump_coords = [17.44584170785649, 78.3513727784157];
// Coordinates for Tanks
var KBtankOH_coords = [17.444937826214677, 78.3499251887606];
var KBtankRO_coords = [17.444726211593455, 78.34974194754611];
var VNtankOH_coords = [17.44525886781208, 78.35011680477474];
var VNtankRO_coords = [17.44566778590112, 78.34999074524211];
var ANtankRO_coords = [17.44400944925504, 78.348375438118];
var BNtankRO_coords = [17.44340944925504, 78.348425438118];
var PLtank_coords = [17.4448213275659, 78.34586599550956];
var GhA_coords = [17.447058948163672, 78.34683954312207];
var GhB_coords = [17.447335860846568, 78.34710171957016];
var GhC_coords = [17.447599374138104, 78.3473404874068];
var oldParijat_coords = [17.447453149052535, 78.3477952011394];
var oldParijatRO_coords = [17.447368708409176, 78.34769059499381];
var NBHtank_coords = [17.446826407404746, 78.34709150779136];
var bakultank_coords = [17.44836641570782, 78.34828425737464];
// Coordinates for borewells
var palash_borewell_coords = [17.443866289180157, 78.34621720365946];
var nbh_borewell_coords = [17.446574142445503, 78.3469592929404];
var bakul_borewell_coords = [17.44821284080954, 78.34894940284315];
var pumph2_borewell_coords = [17.446682258474638, 78.34902883603114];
var ph3_borewell_coords = [17.44265754926405, 78.3499794331807];
var vn_borewell_coords = [17.444451988307012, 78.35011498769984];


var flow_BB0 = latestdatawater["Smart Water Meter-Retrofit Bodh Bhavan Rooftop BB0"].flowrate;
var flow_BB1 = latestdatawater["Smart Water Meter-Retrofit Bodh Bhavan Rooftop BB1"].flowrate;
var flow_VN0471 = latestdatawater["Smart Water Meter-Retrofit Vindhya Rooftop VN04-71"].flowrate;
var flow_VN0470 = latestdatawater["Smart Water Meter-Retrofit Vindhya Rooftop VN04-70"].flowrate;
var flow_PH0471 = latestdatawater["SmartWaterMeter_Node_PH04-71"].flowrate;
var flow_PH0470 = latestdatawater["SmartWaterMeter_Node_PH04-70"].flowrate;
var flow_PL0071 = latestdatawater["SmartWaterMeter_Node_PL00-71"].flowrate;
var flow_PL0070 = latestdatawater["SmartWaterMeter_Node_PL00-70"].flowrate;
var flow_KB0473 = latestdatawater["SmartWaterMeter_Node_Kohli_Rooftop-73"].flowrate;
var flow_KB0472 = latestdatawater["SmartWaterMeter_Node_Kohli_Rooftop-72"].flowrate;
var flow_PR0070 = latestdatawater["Parijath Nivas"].flowrate;
var flow_PH02 = latestdatawater["PH02"].flowrate;
var flow_H01 = latestdatawater["Himalaya01"].flowrate;
var flow_H02 = latestdatawater["Himalaya02"].flowrate;
var flow_PH0300A = latestdatawater["PH03-00 Analog"].flowrate;
var flow_PH0303 = latestdatawater["PH03-03"].flowrate;
var flow_PH0302 = latestdatawater["PH03-02"].flowrate;
var flow_PH0301 = latestdatawater["Ph03-01"].flowrate;
var flow_PH0300 = latestdatawater["PH03-00"].flowrate;
var flow_PH0100 = latestdatawater["PH01-00"].flowrate;


var flowchange_BB0 = flowchangedatawater["Smart Water Meter-Retrofit Bodh Bhavan Rooftop BB0"];
var flowchange_BB1 = flowchangedatawater["Smart Water Meter-Retrofit Bodh Bhavan Rooftop BB1"];
var flowchange_VN0471 = flowchangedatawater["Smart Water Meter-Retrofit Vindhya Rooftop VN04-71"];
var flowchange_VN0470 = flowchangedatawater["Smart Water Meter-Retrofit Vindhya Rooftop VN04-70"];
var flowchange_PH0471 = flowchangedatawater["SmartWaterMeter_Node_PH04-71"];
var flowchange_PH0470 = flowchangedatawater["SmartWaterMeter_Node_PH04-70"];
var flowchange_PL0071 = flowchangedatawater["SmartWaterMeter_Node_PL00-71"];
var flowchange_PL0070 = flowchangedatawater["SmartWaterMeter_Node_PL00-70"];
var flowchange_KB0473 = flowchangedatawater["SmartWaterMeter_Node_Kohli_Rooftop-73"];
var flowchange_KB0472 = flowchangedatawater["SmartWaterMeter_Node_Kohli_Rooftop-72"];
var flowchange_PR0070 = flowchangedatawater["Parijath Nivas"];
var flowchange_PH02 = flowchangedatawater["PH02"];
var flowchange_H01 = flowchangedatawater["Himalaya01"];
var flowchange_H02 = flowchangedatawater["Himalaya02"];
var flowchange_PH0300A = flowchangedatawater["PH03-00 Analog"];
var flowchange_PH0303 = flowchangedatawater["PH03-03"];
var flowchange_PH0302 = flowchangedatawater["PH03-02"];
var flowchange_PH0301 = flowchangedatawater["Ph03-01"];
var flowchange_PH0300 = flowchangedatawater["PH03-00"];
var flowchange_PH0100 = flowchangedatawater["PH01-00"];


// Initialise empty leakCheck array of size 38 
// Each index is mapped to a pipeline (total num of pipelines: 38)
var Check = [];
for (let i = 0; i < 38; i++) {
	Check[i] = 0;
}
// Initialise empty color array
var pipelineColor = [];

// Initialise empty description array
var pipelineDescription = [];

// Only 2 pipelines can be checked for leakage
Check[6] = Math.abs(flowchange_PR0070 - flowchange_PH02); // pipeline6
Check[8] = Math.abs(flowchange_PH0300A - flowchange_PH0300); // pipeline8

function checkLeakage() {
	for (let i = 0; i < Check.length; i++) {
		if (Check[i] < 0.2) {
			pipelineColor[i] = "rgb(51, 153, 255)";
			pipelineDescription[i] = "No Leakage Detected";
		}
		else {
			pipelineColor[i] = "red";
			pipelineDescription[i] = "Leakage";
		}
	}
}

var check_flow = [];
for (let i = 0; i < 38; i++) {
	check_flow[i] = 0;
}
check_flow[1] = Math.abs(flow_PH0471);
check_flow[2] = Math.abs(flow_PH0470);
check_flow[5] = Math.abs(flow_PR0070);
check_flow[7] = Math.abs(flow_PH0300A);
check_flow[8] = Math.abs(flow_PH0300);
check_flow[9] = Math.abs(flow_PH0301);
check_flow[10] = Math.abs(flow_PH0302);
check_flow[11] = Math.abs(flow_PH0303);
check_flow[19] = Math.abs(flow_H02);
check_flow[20] = Math.abs(flow_KB0472);
check_flow[22] = Math.abs(flow_H01);
check_flow[23] = Math.abs(flow_KB0473);
check_flow[30] = Math.abs(flow_PL0070);
check_flow[31] = Math.abs(flow_PL0071);


function makelines(latlngs, set_color, set_desc, check_flow) {
	if (check_flow == 0) {
		var polyline = L.polyline(latlngs, { color: set_color, weight: 5, opacity: 0.8 });
		polyline.addTo(map);
		polyline.bindTooltip(set_desc, { sticky: true }).addTo(map);
	}
	else {
		var polyline = L.polyline(latlngs, { color: set_color, dashArray: "10 10", dashSpeed: 50, weight: 5 });
		polyline.addTo(map);
		polyline.bindTooltip(set_desc, { sticky: true }).addTo(map);
	}
}

// Show Pipelines on Map
function renderPipes(pipeline, item, pipeColor) {
	var polyline = L.polyline(pipeline, { color: pipeColor, weight: 7, opacity: 0.7 });
	polyline.addTo(map);
	polyline.bindTooltip(pipelineDescription[item], { sticky: true }).addTo(map);
}

function constructPipes() {
	checkLeakage();
	var pipeline1 = [PH04sump_coords, mainsump_coords];
	var pipeline2 = [PH04sump_coords, PH0471_coords];
	var pipeline3 = [PH0470_coords, [17.44763894182678, 78.34909966913982], PH04sump_coords];
	// PH01 to PH02 to PR
	var pipeline4 = [PH02sump_coords, [17.447275849938598, 78.34988293018342], mainsump_coords];
	var pipeline5 = [PH02_coords, PH02sump_coords];
	var pipeline6 = [PR0070_coords, [17.4460620297878, 78.34882199764253], PH02_coords];
	// PH01 to PH03 to AN,BN tanks
	var pipeline7 = [PH0302sump_coords, PH0303_coords, [17.44427905187095, 78.34868872450151], ANtankRO_coords];
	var pipeline8 = [PH03sump_coords, PH0300_coords];
	var pipeline9 = [PH0300_coords, PH0300A_coords];
	var pipeline10 = [PH0300A_coords, ANtankRO_coords];
	var pipeline11 = [PH03sump_coords, PH0301_coords, [17.44352575461277, 78.34854710264099], BNtankRO_coords];
	var pipeline12 = [PH0302sump_coords, PH0302_coords, BNtankRO_coords];
	var pipeline13 = [mainsump_coords, [17.445508856305832, 78.35169062212935], PH03sump_coords];
	var pipeline14 = [PH0302sump_coords, ph3_borewell_coords];
	// OBH Network
	var pipeline15 = [OBHsump_coords, [17.444013689506584, 78.34719343280792], [17.44714170785649, 78.35001983684157], mainsump_coords];
	var pipeline16 = [palash_borewell_coords, PL0070_coords, OBHsump_coords];
	var pipeline17 = [OBHsump_coords, [17.444465647941943, 78.34559509241494], PLtank_coords];
	// NBH Parijat
	var pipeline18 = [GhA_coords, [17.44698748675787, 78.34691445067867]];
	var pipeline19 = [GhB_coords, [17.44726439954931, 78.34716258195988]];
	var pipeline20 = [GhC_coords, [17.447523446618586, 78.34741539496339]];
	var pipeline21 = [[17.44698748675787, 78.34691445067867], [17.44726439954931, 78.34716258195988], [17.447523446618586, 78.34741539496339]];
	var pipeline22 = [nbhsump_coords, [17.44665713147751, 78.34682768502918], [17.446790987971248, 78.34665730695953], [17.44698748675787, 78.34691445067867]];
	var pipeline23 = [nbhsump_coords, nbh_borewell_coords];
	var pipeline24 = [NBHtank_coords, nbhsump_coords, [17.44561078763408, 78.34864545839834]];
	var pipeline25 = [oldParijatRO_coords, nbhsump_coords];
	var pipeline26 = [oldParijat_coords, [17.447325208668538, 78.34795613367108], [17.446980307205415, 78.34765791893007]];
	// Bakul
	var pipeline27 = [PH0470_coords, bakultank_coords];
	var pipeline28 = [[17.44803894182678, 78.34909966913982], bakul_borewell_coords];
	var pipeline29 = [PH02sump_coords, pumph2_borewell_coords];
	var pipeline30 = [PH02sump_coords, [17.44640541703848, 78.34934383231227], PH0100_coords, mainsump_coords];
	// VN
	var pipeline31 = [STRAYsump_coords, [17.444800161494846, 78.35035913521576], mainsump_coords];
	var pipeline32 = [[17.445140161494846, 78.35026613521576], VNtankOH_coords, VN0470_coords];
	var pipeline33 = [[17.445310161494846, 78.35043613521576], VN0471_coords, VNtankRO_coords];
	var pipeline34 = [STRAYsump_coords, [17.445310161494846, 78.35043613521576], [17.445140161494846, 78.35026613521576]];
	var pipeline35 = [BB0_coords, KB0472_coords, H02_coords, KBtankRO_coords, [17.444690030976407, 78.34979201068033]];
	var pipeline36 = [BB1_coords, KB0473_coords, H01_coords, KBtankOH_coords, [17.44485690184198, 78.34999198883334]];
	var pipeline37 = [STRAYsump_coords, [17.44485690184198, 78.34999198883334], [17.444690030976407, 78.34979201068033]];
	var pipeline38 = [STRAYsump_coords, vn_borewell_coords];

	var listofpipes = [];
	listofpipes.push(pipeline1, pipeline2, pipeline3, pipeline4, pipeline5, pipeline6, pipeline7, pipeline8, pipeline9, pipeline10,
		pipeline11, pipeline12, pipeline13, pipeline14, pipeline15, pipeline16, pipeline17, pipeline18, pipeline19, pipeline20,
		pipeline21, pipeline22, pipeline23, pipeline24, pipeline25, pipeline26, pipeline27, pipeline28, pipeline29, pipeline30, pipeline31,
		pipeline32, pipeline33, pipeline34, pipeline35, pipeline36, pipeline37, pipeline38);
	for (var i = 0; i < listofpipes.length; i++) {
		renderPipes(listofpipes[i], item, pipelineColor[i]);
	}
}


// Show walls of IIIT Hyderabad
function developWalls() {
	var wall1 = [[17.44431215246116, 78.34421333959695], [17.448959007851123, 78.3484512379919], [17.444986217014176, 78.35261351452294],
	[17.444150848626073, 78.35110228147538], [17.441949414491706, 78.34974490029627], [17.44431215246116, 78.34421333959695]];
	var polyline = L.polyline(wall1, { color: "black", weight: 3, opacity: 0.8 });
	polyline.addTo(map);
	polyline.bindTooltip('<b>IIIT Hyderabad Bounds</b>', { sticky: true }).addTo(map);
}


// Show Sumps on Map
function developSumps() {
	var sump1 = PH04sump_coords;
	var sump2 = PH02sump_coords;
	var sump3 = PH03sump_coords;
	var sump4 = STRAYsump_coords;
	var sump5 = OBHsump_coords;
	var sump6 = PH0302sump_coords;
	var sump7 = nbhsump_coords;
	var sump8 = mainsump_coords;

	var sumplist = [];
	sumplist.push(sump1, sump2, sump3, sump4, sump5, sump6, sump7, sump8);
	var sumpnames = [];
	sumpnames.push('Pump House 4 Sump', 'Pump House 2 Sump', 'Pump House 3 Sump', 'STRAY Sump', 'OBH Sump', 'Pump House 3 - 02 Sump', 'NBH Sump', 'Main Gate Sump');
	for (var i = 0; i < sumplist.length; i++) {
		renderSumps(sumplist[i], sumpnames[i]);
	}

}

// Show Sumps Dynamically
function developSumps_dynamic(Sumps_data) {
	for (var i = 0; i < Sumps_data.length; i++) {
		renderSumps(Sumps_data[i]['coordinates'], Sumps_data[i]['name']);
	}
}

function renderSumps(sump, sumpname) {
	if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Sump_nodes) {
		var finalSump = L.circle(sump, { color: 'black', radius: 6, fillOpacity: 0.5 });
		finalSump.addTo(Sump_layer);
		finalSump.bindTooltip('<b>' + sumpname + '</b>', { sticky: true }).addTo(Sump_layer);
	}
}


// Show Borewells on Map
function developBorewells() {
	var borewell1 = nbh_borewell_coords;
	var borewell2 = palash_borewell_coords;
	var borewell3 = bakul_borewell_coords;
	var borewell4 = pumph2_borewell_coords;
	var borewell5 = ph3_borewell_coords;
	var borewell6 = vn_borewell_coords;
	var borewelllist = [];
	var borewellnamelist = [];
	borewelllist.push(borewell1, borewell2, borewell3, borewell4, borewell5, borewell6);
	borewellnamelist.push('NBH Borewell', 'OBH Borewell', 'Bakul Nivas Borewell', 'Pump House 2 Borewell', 'Pump House 3 Borwell', 'Vindhya Borewell');
	for (var i = 0; i < borewelllist.length; i++) {
		renderBorewells(borewelllist[i], borewellnamelist[i]);
	}
}

// Show Borewells Dynamically
function developBorewells_dynamic(Borewells_data) {
	for (var i = 0; i < Borewells_data.length; i++) {
		var borewell_data = Borewells_data[i];
		renderBorewells(borewell_data['coordinates'], borewell_data['name']);
	}
}

function renderBorewells(borewell, borewellname) {
	if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Borewell_nodes) {
		var finalborewell = L.circle(borewell, { color: 'brown', radius: 6, fillOpacity: 0.5 });
		finalborewell.addTo(Borewell_layer);
		finalborewell.bindTooltip('<b>' + borewellname + '</b>', { sticky: true }).addTo(Borewell_layer);
	}
}


// Show Tanks on Map
function developTanks() {
	var tank1 = KBtankOH_coords;
	var tank2 = KBtankRO_coords;
	var tank3 = VNtankOH_coords;
	var tank4 = VNtankRO_coords;
	var tank5 = ANtankRO_coords;
	var tank6 = BNtankRO_coords;
	var tank7 = PLtank_coords;
	var tank8 = GhA_coords;
	var tank9 = GhB_coords;
	var tank10 = GhC_coords;
	var tank11 = oldParijat_coords;
	var tank12 = NBHtank_coords;
	var tank13 = oldParijatRO_coords;
	var tank14 = bakultank_coords;

	var tanklist = [];
	tanklist.push(tank1, tank2, tank3, tank4, tank5, tank6, tank7, tank8, tank9, tank10,
		tank11, tank12, tank13, tank14)

	var tankname = [];
	tankname.push('Kohli Block Overhead Tank', 'Kohli Block RO Tank', 'Vindhya Overhead Tank', 'Vindhya RO Tank', 'Anand Nivas RO Tank',
		'Bodh Nivas RO Tank', 'Palash Tank', 'Girls Hostel A Tank', 'Girls Hostel B Tank', 'Girls Hostel C Tank', 'Old Parijat Tank', 'NBH Tank',
		'Old Parijat RO Tank', 'Bakul Tank');
	for (var i = 0; i < tanklist.length; i++) {
		renderTanks(tanklist[i], tankname[i]);
	}


}

// Dynamic Tank Render
function developTanks_dynamic(Tanks_data) {
	for (var i = 0; i < Tanks_data.length; i++) {
		var tank = Tanks_data[i];
		renderTanks(tank['coordinates'], tank['name']);
	}

}

function renderTanks(tankp, tanknames) {
	if (Render_nodes == map_nodes.Tank_nodes || Render_nodes == map_nodes.All_nodes) {
		var finaltank = L.marker(tankp, { icon: tank }).addTo(Tank_layer);
		finaltank.bindTooltip('<b>' + tanknames + '</b>', { sticky: true }).addTo(Tank_layer);
	}
}


// Static Nodes Render
function developNodes(Nodes_data) {
	var Tank_node = [];
	var Sump_node = [];
	var Borewell_node = [];
	for (var i = 0; i < Nodes_data.length; i++) {
		var node = Nodes_data[i];
		if (node['type'] == 'Tank') {
			Tank_node.push(node);
		}
		else if (node['type'] == 'Sump') {
			Sump_node.push(node);
		}
		else if (node['type'] == 'Borewell') {
			Borewell_node.push(node);
		}
	}
	developTanks_dynamic(Tank_node);
	developBorewells_dynamic(Borewell_node);
	developSumps_dynamic(Sump_node);
}


async function markers(mapdata, option) {
	// console.log("test1")
	// call all functions here.....
	map = mapdata;

	console.log(Render_Index);

	let promise_1 = new Promise((resolve, reject) => {
		setTimeout(function () {
			resolve("Success!")
		}, 10)
	});
	promise_1.then((successMessage) => {
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Analog_nodes)
			Meters_Analog_layer.addTo(map);
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Digital_nodes)
			Meters_Digital_layer.addTo(map);

		add_markers(points_water);
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Meters_Analog_nodes || Render_nodes == map_nodes.Meters_Digital_nodes)
			add_marker_tooltip(map, m_water);

		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Tank_nodes)
			Tank_layer.addTo(map);
		add_markers_tank(static_nodes);
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Tank_nodes)
			add_marker_tooltip_tank(map, m_tank);

		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Borewell_nodes)
			Borewell_layer.addTo(map);
		add_markers_borewell(borewell_nodes);
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Borewell_nodes)
			add_marker_tooltip_borewell(map, m_borewell);
	}).then((successMessage) => {
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Tank_nodes)
			Tank_layer.addTo(map);
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Borewell_nodes)
			Borewell_layer.addTo(map);
		if (Render_nodes == map_nodes.All_nodes || Render_nodes == map_nodes.Sump_nodes)
			Sump_layer.addTo(map);

		legendinitiate(map);
		developWalls();
		constructPipes();
		// developSumps();
		// developBorewells();
		// developTanks();
		developNodes(static_nodes);
		Update_Index();
	}
	).then((successMessage) => {
		initiate();
		update(param, map, m_water);
		setInterval(function () {
			update(param, map, m_water)
		}, 1000 * 120);
	});

}
//legend function hide unhide

function allNodeStatuses() {
	let time_limit = 24 * 60 * 60 * 1000; // For checking if the time difference is within 24 hours (24 * 60 * 60 * 1000 milliseconds)
	let html = "<center><b>All Node Details</b></center><br><br>";

	// For styling bootstrap tables uniformly
	let table_tag = `<table class="table table-striped table-bordered caption-top">`;
	let caption_tag = `<caption style="text-align:center">`;
	let thead_tag = `<thead class="thead-dark">`;
	let tr_active_tag = `<tr class="table-success">`;
	let tr_inactive_tag = `<tr class="table-danger">`;

	////////////////////////////////////////////// Water Meters (Prawah/Shenitech Water Meters) //////////////////////////////////////////////
	html += `<div id="waterNodeStatusTable">`
	let active_nodes_html = [];
	let inactive_nodes_html = [];

	for (let elem in m_water) {
		let temp_name = "Not working";
		let node_name = m_water[elem].name;

		if ((typeof latestdatawater != 'undefined') && node_name in latestdatawater) {
			let created_at = latestdatawater[node_name].created_at;
			let dateTime = created_at.split(" ");
			let date = dateTime[0];
			let time = dateTime[1];
			let timeWithoutSeconds = time.split(":").slice(0, -1).join(":");
			let formattedDate = date + " " + timeWithoutSeconds;

			// Parse formattedDate and current datetime to compare
			let split_date = date.split("-")
			let reformatted_date = split_date[2] + "-" + split_date[1] + "-" + split_date[0] + "T" + time + ".000+05:30";
			let parsedFormattedDate = Date.parse(reformatted_date);
			let currentDate = new Date();
			currentDate = Date.parse(currentDate);

			// Calculate the difference in milliseconds
			let timeDifference = currentDate - parsedFormattedDate;

			let node_data = {"node_name": node_name, "total_flow": latestdatawater[node_name].totalflow, "flow_rate": latestdatawater[node_name].flowrate, "updated_at": formattedDate};
			if (timeDifference <= time_limit) {
				node_data["status"] = "Active";
				active_nodes_html.push(node_data);
			} else {
				node_data["status"] = "Inactive";
				inactive_nodes_html.push(node_data);
			}
		}
	}

	html += "<center><b>Water Meters</b></center><br>";
	html += `
		${table_tag}
			${caption_tag}Active Nodes</caption>
			${thead_tag}
				<tr>
					<th scope="col">#</th>
					<th scope="col">Node Name</th>
					<th scope="col">Total Flow</th>
					<th scope="col">Flow Rate</th>
					<th scope="col">Last Updated</th>
				</tr>
			</thead>
			<tbody>`
	
	for (let i = 0; i < active_nodes_html.length; i++) {
		html += `${tr_active_tag}<th scope="row">${String(i + 1)}</th>`;
		html += `<td>${active_nodes_html[i].node_name}</td>`;
		html += `<td>${active_nodes_html[i].total_flow}</td>`;
		html += `<td>${active_nodes_html[i].flow_rate}</td>`;
		html += `<td>${active_nodes_html[i].updated_at}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table>`
	html += "<br>";
	html += `
		${table_tag}
			${caption_tag}Inactive Nodes</caption>
			${thead_tag}
				<tr>
					<th scope="col">#</th>
					<th scope="col">Node Name</th>
					<th scope="col">Total Flow</th>
					<th scope="col">Flow Rate</th>
					<th scope="col">Last Updated</th>
				</tr>
			</thead>
			<tbody>`
	
	for (let i = 0; i < inactive_nodes_html.length; i++) {
		html += `${tr_inactive_tag}<th scope="row">${String(i + 1)}</th>`;
		html += `<td>${inactive_nodes_html[i].node_name}</td>`;
		html += `<td>${inactive_nodes_html[i].total_flow}</td>`;
		html += `<td>${inactive_nodes_html[i].flow_rate}</td>`;
		html += `<td>${inactive_nodes_html[i].updated_at}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table></div><hr><br><br>`
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////// Water Tanks /////////////////////////////////////////////////////////////
	html += `<div id="waterTankStatusTable">`
	active_nodes_html = [];
	inactive_nodes_html = [];

	for (let elem in m_tank) {
		let temp_name = "Not working";
		let node_name = m_tank[elem].name;

		if ((typeof latest_tankdata != 'undefined') && node_name in latest_tankdata) {
			var created_at = latest_tankdata[node_name].created_at;
			var dateTime = created_at.split(" ");
			var date = dateTime[0];
			var time = dateTime[1];
			var timeWithoutSeconds = time.split(":").slice(0, -1).join(":");
			var formattedDate = date + " " + timeWithoutSeconds;

			// Parse formattedDate and current datetime to compare
			let split_date = date.split("-")
			let reformatted_date = split_date[2] + "-" + split_date[1] + "-" + split_date[0] + "T" + time + ".000+05:30";
			let parsedFormattedDate = Date.parse(reformatted_date);
			let currentDate = new Date();
			currentDate = Date.parse(currentDate);

			// Calculate the difference in milliseconds
			let timeDifference = currentDate - parsedFormattedDate;

			let node_data = {"node_name": node_name, "water_level": latest_tankdata[node_name].water_level, "temperature": latest_tankdata[node_name].temp, "updated_at": formattedDate};
			if (timeDifference <= time_limit) {
				node_data["status"] = "Active";
				active_nodes_html.push(node_data);
			} else {
				node_data["status"] = "Inactive";
				inactive_nodes_html.push(node_data);
			}
		}
	}

	html += "<center><b>Water Tanks</b></center><br>";
	html += `
		${table_tag}
			${caption_tag}Active Nodes</caption>
			${thead_tag}
				<tr>
					<th scope="col">#</th>
					<th scope="col">Node Name</th>
					<th scope="col">Water Level</th>
					<th scope="col">Temperature</th>
					<th scope="col">Last Updated</th>
				</tr>
			</thead>
			<tbody>`
	
	for (let i = 0; i < active_nodes_html.length; i++) {
		html += `${tr_active_tag}<th scope="row">${String(i + 1)}</th>`;
		html += `<td>${active_nodes_html[i].node_name}</td>`;
		html += `<td>${active_nodes_html[i].water_level}</td>`;
		html += `<td>${active_nodes_html[i].temperature}</td>`;
		html += `<td>${active_nodes_html[i].updated_at}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table>`
	html += "<br>";
	html += `
		${table_tag}
			${caption_tag}Inactive Nodes</caption>
			${thead_tag}
				<tr>
					<th scope="col">#</th>
					<th scope="col">Node Name</th>
					<th scope="col">Water Level</th>
					<th scope="col">Temperature</th>
					<th scope="col">Last Updated</th>
				</tr>
			</thead>
			<tbody>`
	
	for (let i = 0; i < inactive_nodes_html.length; i++) {
		html += `${tr_inactive_tag}<th scope="row">${String(i + 1)}</th>`;
		html += `<td>${inactive_nodes_html[i].node_name}</td>`;
		html += `<td>${inactive_nodes_html[i].water_level}</td>`;
		html += `<td>${inactive_nodes_html[i].temperature}</td>`;
		html += `<td>${inactive_nodes_html[i].updated_at}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table></div><hr><br><br>`
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////// Borewells //////////////////////////////////////////////////////////////
	html += `<div id="borewellStatusTable">`
	active_nodes_html = [];
	inactive_nodes_html = [];

	for (let elem in m_borewell) {
		let temp_name = "Not working";
		let node_name = m_borewell[elem].name;

		if ((typeof latest_borewelldata != 'undefined') && node_name in latest_borewelldata) {
			var created_at = latest_borewelldata[node_name].created_at;
			var dateTime = created_at.split(" ");
			var date = dateTime[0];
			var time = dateTime[1];
			var timeWithoutSeconds = time.split(":").slice(0, -1).join(":");
			var formattedDate = date + " " + timeWithoutSeconds;
			
			// Parse formattedDate and current datetime to compare
			let split_date = date.split("-")
			let reformatted_date = split_date[2] + "-" + split_date[1] + "-" + split_date[0] + "T" + time + ".000+05:30";
			let parsedFormattedDate = Date.parse(reformatted_date);
			let currentDate = new Date();
			currentDate = Date.parse(currentDate);

			// Calculate the difference in milliseconds
			let timeDifference = currentDate - parsedFormattedDate;

			let node_data = {"node_name": node_name, "water_level": latest_borewelldata[node_name].water_level, "updated_at": formattedDate};
			if (timeDifference <= time_limit) {
				node_data["status"] = "Active";
				active_nodes_html.push(node_data);
			} else {
				node_data["status"] = "Inactive";
				inactive_nodes_html.push(node_data);
			}
		}
	}

	html += "<center><b>Borewells</b></center><br>";
	html += `
		${table_tag}
			${caption_tag}Active Nodes</caption>
			${thead_tag}
				<tr>
					<th scope="col">#</th>
					<th scope="col">Node Name</th>
					<th scope="col">Water Level</th>
					<th scope="col">Last Updated</th>
				</tr>
			</thead>
			<tbody>`
	
	for (let i = 0; i < active_nodes_html.length; i++) {
		html += `${tr_active_tag}<th scope="row">${String(i + 1)}</th>`;
		html += `<td>${active_nodes_html[i].node_name}</td>`;
		html += `<td>${active_nodes_html[i].water_level}</td>`;
		html += `<td>${active_nodes_html[i].updated_at}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table>`
	html += "<br>";
	html += `
		${table_tag}
			${caption_tag}Inactive Nodes</caption>
			${thead_tag}
				<tr>
					<th scope="col">#</th>
					<th scope="col">Node Name</th>
					<th scope="col">Water Level</th>
					<th scope="col">Last Updated</th>
				</tr>
			</thead>
			<tbody>`
	
	for (let i = 0; i < inactive_nodes_html.length; i++) {
		html += `${tr_inactive_tag}<th scope="row">${String(i + 1)}</th>`;
		html += `<td>${inactive_nodes_html[i].node_name}</td>`;
		html += `<td>${inactive_nodes_html[i].water_level}</td>`;
		html += `<td>${inactive_nodes_html[i].updated_at}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table></div>`
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	return html;
}


function hideFunction() {
	Render_Index = "Hide";
	Update_Index();
}

function Update_Index() {
	var index = document.getElementById("myDIV")
	var btn = document.getElementById("IDIV")
	if (Render_Index == "Hide") {
		index.style.display = "none";
		btn.style.display = "inline-block";
	}
	else {
		index.style.display = "inline-block";
		btn.style.display = "none";
	}
}


function myFunction() {
	Render_Index = "Show";
	Update_Index();
}


//  alertBar.appendChild(div);

// function alertBar(){
//     var input = L.DomUtil.create('input');
// 	   input.innerHTML="hello";
//     input.setAttribute('type', 'input');
//     input.setAttribute('placeholder', 'Enter Description');
// 	   return input;
// }

// var test= document.createElement("test");
// test.innerHTML ="HELLLO";
//  var alertDiv = document.createElement("alertDiv");
//  alertBar.innerHTML += "<div class=alert-container>" ;
//  alertBar.innerHTML += "<button >Alert</button>";
//  alertBar.innerHTML += "<div class=alert hide>";
//  alertBar.innerHTML += "<span class=mtr-img><img src=https://spcrc.iiit.ac.in/water/static/js/img-ap/marker-icon-2x-gold.pngalt=></span>";
//  alertBar.innerHTML += "<span class=msg> <strong>Warning </strong>: This is warning alert</span>";
//  alertBar.innerHTML += "<span class=close-btn>";
//  alertBar.innerHTML += "<span class=x-btn>X</span>";
//  alertBar.innerHTML += "</span>";
//  alertBar.innerHTML += "</div>";
//  alertBar.innerHTML+="</div>";
//}

function alertNotiBar() {
	$('#nodes_state').click(function () {
		$('.alert').removeClass("hide");
		$('.alert').addClass("show");
		$('.alert').addClass("showAlert");

		setTimeout(function () {
			$('.alert').addClass("hide");
			$('.alert').removeClass("show");
		}, 6000); // hide alert automatically after 6 sec
	});
	$('.close-btn').click(function () {
		$('.alert').addClass("hide");
		$('.alert').removeClass("show");
	});
}