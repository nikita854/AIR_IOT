//USED
function getDataElement(curr_data, node_parameters, title) {
    labels = []
    tooltipLabels = []
    final_data = {}
    curr_data = JSON.parse(JSON.stringify(curr_data))
    for (idx in node_parameters) {
        param = node_parameters[idx]
        final_data[param] = []
    }

    for (item in curr_data) {

        t = new Date(curr_data[item]['created_at']);
        labels.push(dispdatetime(t))
        // TODO: this is temporary solution has to be updated
        tooltipLabels.push(dispToolTipTime(t))
        for (idx in node_parameters) {
            param = node_parameters[idx]
            final_data[param].push(curr_data[item][param])
        }
    }
    final_data['title'] = title
    final_data['label'] = labels
    final_data['tooltiplabel'] = tooltipLabels

    return final_data
}

function dispdatetime(dt) {
    return dt.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function dispToolTipTime(dt) {
    return dt.toLocaleString("en-GB", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

var param = 1;
var nodetype = 1;
var graphData;
var ctx;
var points_iiit, iiit_url_data_10minutes, datagraphiiit = {};
var points_airveda, airveda_url_data_10minutes, datagraphairveda = {};
var points_water = {}, datagraphwater = {}, water_url_data_10minute;
var center = { lat: 17.44555, lon: 78.34832 };

var datagraphtank = {};
var static_nodes = {};
var borewell_nodes = {};
var datagraphborewell = {};

function loadParameters(points) {
    curr_parameters = {}
    for (var i = 0; i < points.length; i++) {
        curr_parameters[points[i]['name']] = points[i]['parameters']
    }
    return curr_parameters
}


function sort_based_on_time(a, b) {
    let adate = new Date(a.created_at);
    let bdate = new Date(b.created_at);

    if (bdate >= adate) {
        return 1;
    }
    else {
        return -1;
    }
}

var non_working_nodes = [], working_nodes = [];

function analysis(datawater) {
    for (node in datawater) {
        datawater[node].sort(sort_based_on_time);
    }
    for (node in datawater) {
        let last_updated = datawater[node][0]?.created_at;
        let current_time = new Date();

        if (last_updated) {
            let lastUpdatedTime = new Date(last_updated);

            if ((current_time - lastUpdatedTime) / (60 * 1000) >= 4 * 60) {
                non_working_nodes.push({ "name": node, "lu": lastUpdatedTime });
            } else {
                working_nodes.push({ "name": node, "lu": lastUpdatedTime });
            }
        } else {
            // Handle the case when 'created_at' is undefined
            non_working_nodes.push({ "name": node, "lu": 100 });
        }
    }
}

function loadData(water, waterdataurl, latestwater, datawater, flowchangewater, staticnodes, borewellnodes, tankdata, borewelldata, tankdataurl, borewelldataurl, datatankgraph, databorewellgraph) {
    points_water = JSON.parse(water);
    parameters_water = loadParameters(points_water)
    water_url_data_10minutes = waterdataurl;
    latestdatawater = JSON.parse(latestwater);
    flowchangedatawater = JSON.parse(flowchangewater);
    datawater = JSON.parse(datawater);

    // static nodes
    static_nodes = JSON.parse(staticnodes);
    parameter_tank = loadParameters(static_nodes);

    tank_url_data = tankdataurl;
    latest_tankdata = JSON.parse(tankdata);

    borewell_nodes = JSON.parse(borewellnodes);
    parameter_borewell = loadParameters(borewell_nodes);

    borewell_url_data = borewelldataurl;
    latest_borewelldata = JSON.parse(borewelldata);

    datatankgraph = JSON.parse(datatankgraph);
    databorewellgraph = JSON.parse(databorewellgraph);

    for (elem in datatankgraph) {
        datagraphtank[elem] = getDataElement(datatankgraph[elem], parameter_tank[elem], elem)
    }
    for (elem in databorewellgraph) {
        datagraphborewell[elem] = getDataElement(databorewellgraph[elem], parameter_borewell[elem], elem)
    }

    for (elem in datawater) {
        datagraphwater[elem] = getDataElement(datawater[elem], parameters_water[elem], elem)
    }

    analysis(datawater);

}