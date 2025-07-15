// NOT USED
//graph node variables

function addfunction() {
  document.getElementById("allnodes").onclick = function () { allnodes() };
  document.getElementById("tanknodes").onclick = function () { tanknodes() };
  document.getElementById("meternodes_analog").onclick = function () { analognodes() };
  document.getElementById("meternodes_digital").onclick = function () { digitalnodes() };
  document.getElementById("sumpnodes").onclick = function () { sumpnodes() };
  document.getElementById("borewellnodes").onclick = function () { borewellnodes() };
}

function addIIITfunctions() {
  document.getElementById("aqi").onclick = function () { aqicall() };
  document.getElementById("pm25").onclick = function () { pm25call() };
  document.getElementById("pm10").onclick = function () { pm10call() };
  document.getElementById("temperature").onclick = function () { tempcall() };
  document.getElementById("humidity").onclick = function () { humidcall() };
  document.getElementById("co").onclick = function () { cocall() };
  document.getElementById("no2").onclick = function () { no2call() };
  document.getElementById("nh3").onclick = function () { nh3call() };
}

function Uncheck_all() {
  // uncheck the remaining checkboxes
  document.getElementById('Tank_check').checked = false;
  document.getElementById('Sump_check').checked = false;
  document.getElementById('Borewell_check').checked = false;
  document.getElementById('Analog_check').checked = false;
  document.getElementById('Digital_check').checked = false;
  document.getElementById('Pipe_check').checked = false;
}

function allnodes() {
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "All Nodes";
  Uncheck_all();
  // Activiate the all nodes 
  Render_nodes = map_nodes.All_nodes;
  markers(map);
}

function pipelines() {
  // check index
  var bool_check = document.getElementById('Pipe_check').checked;
  if (bool_check == false) {
    allnodes();
    location.reload();
    return;
  }
  Uncheck_all();
  document.getElementById('Pipe_check').checked = true;
  Render_nodes = map_nodes.Pipelines;
  map.removeLayer(Tank_layer);
  map.removeLayer(Sump_layer);
  map.removeLayer(Borewell_layer);
  map.removeLayer(Meters_Analog_layer);
  map.removeLayer(Meters_Digital_layer);
  markers(map);
}

function tanknodes() {
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "Tank Nodes";
  // check index
  var bool_check = document.getElementById('Tank_check').checked;
  if (bool_check == false) {
    allnodes();
    location.reload();
    return;
  }
  Uncheck_all();
  document.getElementById('Tank_check').checked = true;

  // Remove all markers from map
  Render_nodes = map_nodes.Tank_nodes;
  map.removeLayer(Sump_layer);
  map.removeLayer(Borewell_layer);
  map.removeLayer(Meters_Analog_layer);
  map.removeLayer(Meters_Digital_layer);
  // hideFunction();
  // myFunction();
  markers(map);
}
//test 
// function setting(){
//   //var chbx=document.querySelector(".myCheckbox1");
//   console.log("its workings..")
//   if(multi==true){
//     tanknodes();

//   }else{
//     allnodes();
//   }
// }

function analognodes() {
  multi = true;
  //if( multi==true){
  document.getElementById('typeofnodes').innerHTML = "Analog Nodes";
  // check index
  var bool_check = document.getElementById('Analog_check').checked;
  if (bool_check == false) {
    allnodes();
    location.reload();
    return;
  }
  Uncheck_all();
  document.getElementById('Analog_check').checked = true;
  // Remove all markers from map
  Render_nodes = map_nodes.Meters_Analog_nodes;
  map.removeLayer(Tank_layer);
  map.removeLayer(Sump_layer);
  map.removeLayer(Borewell_layer);
  map.removeLayer(Meters_Digital_layer);
  markers(map);
  //   return;
  //  }
  //  else{
  //  allnodes();
  //  }
}

function digitalnodes() {
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "Digital Nodes";
  // check index
  var bool_check = document.getElementById('Digital_check').checked;
  if (bool_check == false) {
    allnodes();
    location.reload();
    return;
  }

  Uncheck_all();
  document.getElementById('Digital_check').checked = true;
  // Remove all markers from map
  Render_nodes = map_nodes.Meters_Digital_nodes;
  map.removeLayer(Tank_layer);
  map.removeLayer(Sump_layer);
  map.removeLayer(Borewell_layer);
  map.removeLayer(Meters_Analog_layer);
  markers(map);
}

function sumpnodes() {
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "Sump Nodes";
  // check index
  var bool_check = document.getElementById('Sump_check').checked;
  if (bool_check == false) {
    location.reload();
    allnodes();
    return;
  }

  Uncheck_all();
  document.getElementById('Sump_check').checked = true;
  // Remove all markers from map
  Render_nodes = map_nodes.Sump_nodes;
  map.removeLayer(Tank_layer);
  map.removeLayer(Borewell_layer);
  map.removeLayer(Meters_Analog_layer);
  map.removeLayer(Meters_Digital_layer);
  markers(map);
  //console.log(Render_nodes, "Sump nodes");
}

function borewellnodes() {
  // check index
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "Borewell Nodes";
  var bool_check = document.getElementById('Borewell_check').checked;
  if (bool_check == false) {
    allnodes();
    location.reload();
    return;
  }

  Uncheck_all();
  document.getElementById('Borewell_check').checked = true;
  // Remove all markers from map
  Render_nodes = map_nodes.Borewell_nodes;
  map.removeLayer(Tank_layer);
  map.removeLayer(Sump_layer);
  map.removeLayer(Meters_Analog_layer);
  map.removeLayer(Meters_Digital_layer);
  markers(map);
}

function iiitnodes() {
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "IIIT Nodes";
  nodetype = 2;
  var nodelist = document.getElementById('nodeslist');
  nodelist.innerHTML = "";
  for (elem in points_iiit) {
    str = '<li><a class="dropdown-item" id="' + points_iiit[elem].name + '">' + points_iiit[elem].location + '</a></li>';
    nodelist.innerHTML += str;
  }

  for (let elem in points_iiit) {
    document.getElementById(points_iiit[elem].name).onclick = function () { multi = false; singleData = points_iiit[elem].name; drawChartAll(nodetype, param, multi); }
  }

  drawChartAll(nodetype, param, multi);
}

function airvedanodes() {
  multi = true;
  document.getElementById('typeofnodes').innerHTML = "Airveda Nodes";
  nodetype = 3;
  var nodelist = document.getElementById('nodeslist');
  nodelist.innerHTML = "";
  for (elem in points_airveda) {
    str = '<li><a class="dropdown-item" id="' + points_airveda[elem].name + '">' + points_airveda[elem].location + '</a></li>';
    nodelist.innerHTML += str;
  }

  for (let elem in points_airveda) {
    document.getElementById(points_airveda[elem].name).onclick = function () { multi = false; singleData = points_airveda[elem].name; drawChartAll(nodetype, param, multi); }
  }

  drawChartAll(nodetype, param, multi);
}

// Parameter Function
function pm25call() {
  param = 2;
  document.getElementById('parameters').innerHTML = 'PM<sub>2.5</sub>'
  drawChartAll(nodetype, param, multi)

}

function pm10call() {
  param = 3;
  document.getElementById('parameters').innerHTML = 'PM<sub>2.5</sub>'
  drawChartAll(nodetype, param, multi)
}

function aqicall() {
  param = 1;
  document.getElementById('parameters').innerHTML = 'AQI'
  drawChartAll(nodetype, param, multi)
}

function tempcall() {
  param = 4;
  document.getElementById('parameters').innerHTML = 'Temperature C'
  drawChartAll(nodetype, param, multi)
}

function humidcall() {
  param = 5;
  document.getElementById('parameters').innerHTML = 'Humidity %'
  drawChartAll(nodetype, param, multi)
}

function cocall() {
  param = 6;
  document.getElementById('parameters').innerHTML = 'CO'
  drawChartAll(nodetype, param, multi)
}

function no2call() {
  param = 7;
  document.getElementById('parameters').innerHTML = 'NO<sub>2</sub>'
  drawChartAll(nodetype, param, multi)
}

function nh3call() {
  param = 8;
  document.getElementById('parameters').innerHTML = 'NH<sub>3</sub>'
  drawChartAll(nodetype, param, multi)
}

function drawChartAll(types, parameters, multiplenodes) {
  console.log("This is being called ", parameters);
  dataset = []
  if (multiplenodes) {
    if (types == 1) {
      for (elem in datagraphairveda) {
        set = {}
        set.label = elem
        set.fill = false
        set.borderColor = getRandomColor()
        set.data = datagraphairveda[elem][parameterselect(parameters)]
        dataset.push(set);
      }
      for (elem in datagraphiiit) {
        set = {}
        set.label = elem
        set.fill = false
        set.borderColor = getRandomColor()
        set.data = datagraphiiit[elem][parameterselect(parameters)]
        dataset.push(set);
      }
    }
    else if (types == 2) {
      for (elem in datagraphiiit) {
        set = {}
        set.label = elem
        set.fill = false
        set.borderColor = getRandomColor()
        set.data = datagraphiiit[elem][parameterselect(parameters)]
        dataset.push(set);
      }
    }
    else {
      for (elem in datagraphairveda) {
        set = {}
        set.label = elem
        set.fill = false
        set.borderColor = getRandomColor()
        set.data = datagraphairveda[elem][parameterselect(parameters)]
        dataset.push(set);
      }

    }
  } else {
    if (singleData in datagraphiiit) {
      set = {}
      set.label = singleData
      set.fill = false
      set.borderColor = getRandomColor()
      set.data = datagraphiiit[singleData][parameterselect(parameters)]
      dataset.push(set);
    }
    else {
      set = {}
      set.label = singleData
      set.fill = false
      set.borderColor = getRandomColor()
      set.data = datagraphairveda[singleData][parameterselect(parameters)]
      dataset.push(set);
    }
  }
  console.log(dataset);
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datagraphiiit["Palash Nivas IIITH"].label,
      datasets: dataset
    },
    options: {
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: true,
            min: 0
          }
        }]
      }
    }
  })
}

function parameterselect(paramater) {
  if (paramater == 1) {
    return 'aqi'
  }
  else if (paramater == 2) {
    return 'pm25'
  }
  else if (paramater == 3) {
    return 'pm10'
  }
  else if (paramater == 4) {
    return 'temperature'
  }
  else if (paramater == 5) {
    return 'humidity'
  }
  else if (paramater == 6) {
    return 'co'
  }
  else if (paramater == 7) {
    return 'no2'
  }
  else {
    return 'nh3'
  }
}