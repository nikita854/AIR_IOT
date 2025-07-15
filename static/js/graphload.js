//USED
var myChart1;
var myChart2;

document.getElementById("closeModal").onclick = function () {
    const element1 = document.getElementById("graph-container");
    const element2 = document.getElementById("graphs");
    element2.parentNode.removeChild(element2);
    // element1.innerHTML += '<div class="column" id="graphs"><div class="col-xl-6" id="graph1"><div class="ml-auto" style="height:80px"><div id = "legend1" class="align-middle"></div></div><div style="height:480px"><canvas id="canvas1" class="graph-canvas"></canvas></div></div><div class="col-xl-6" id="graph2"><div class="ml-auto" style="height:80px"><div id = "legend2" class="align-middle"></div></div><div style="height:480px"><canvas id="canvas2" class="graph-canvas"></canvas></div></div></div>';
    element1.innerHTML += '<div class="column" id="graphs"><div class="col-xl-12" id="graph1"><div class="ml-auto" style="height:40px"><div id = "legend1" class="align-middle"></div></div><div style="height:250px"><canvas id="canvas1" class="graph-canvas"></canvas></div></div><div class="col-xl-12" id="graph2"><div class="ml-auto" style="height:40px"><div id = "legend2" class="align-middle"></div></div><div style="height:250px"><canvas id="canvas2" class="graph-canvas"></canvas></div></div></div>';
    $('#GraphModal').modal('hide');
};

$('#GraphModal').on('shown', function () {
    console.log("modal loaded")
});

$('#GraphModal').on('shown.bs.modal', function (e) {
    if (myChart1) {
        myChart1.destroy();
    }
    if (myChart2) {
        myChart2.destroy();
    }

    var ctx1 = document.getElementById("canvas1").getContext('2d');
    var ctx2 = document.getElementById("canvas2").getContext('2d');
    var chartConfigs1 = chartConfig1({ graphData });
    var chartConfigs2 = chartConfig2({ graphData });
    myChart1 = new Chart(ctx1, chartConfigs1);
    myChart2 = new Chart(ctx2, chartConfigs2);

    var legend1 = document.getElementById("legend1")
    legend1.innerHTML = myChart1.generateLegend();
    var legend2 = document.getElementById("legend2")
    if (legend2 != null) {
        legend2.innerHTML = myChart2.generateLegend();
    }

    bindChartEvents1(myChart1, document);
    bindChartEvents2(myChart2, document);
});
