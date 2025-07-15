const chartConfig1 = ({ graphData }) => {

  const displayNames = {
    'temperature': 'Temperature (in °C)',
    'humidity': 'Humidity (%)',
    'flowrate': 'Flow Rate (in kL/hr)',
    'pressure': 'Pressure (in centibar)',
    'totalflow': 'Total Flow (in L)',
    'totalvolume': 'Total Volume (in m³)',
    'waterlevel': 'Water Level (in cm)',
  };

  const colors = {
    'temperature': '#ec4646',
    'humidity': '#c0e218',
    'flowrate': '#00af91',
    'pressure': '#f58634',
    'totalflow': '#ec4646',
    'totalvolume': '#ec4646',
    'waterlevel': '#c0e218',
  };

  const datasets1 = [];

  let totalFlowMin = Number.POSITIVE_INFINITY; // Initialize with a large positive value
  let totalFlowMax = Number.NEGATIVE_INFINITY; // Initialize with a large negative value

  // unwantedkeys=['label','tooltiplabel','title','pressurevoltage', 'pressure'];


  for (key in graphData) {
    // if(!(unwantedkeys.includes(key))){

    if (key == 'temperature' || key == 'humidity' || key == 'totalflow' || key == 'totalvolume' || key == 'waterlevel') {

      const yAxisIDs = {
        'totalflow': 'totalflow-y-axis',
        'flowrate': 'flowrate-y-axis',
        'waterlevel': 'waterlevel-y-axis',
        'totalvolume': 'totalvolume-y-axis',
      };

      if (key === 'waterlevel') {
        // Check if all values are equal
        if (graphData[key].every(value => value === graphData[key][0])) {
          // Create variations with drops
          let numDrops = Math.floor(Math.random() * 5) + 1; // Random number of drops (between 1 and 5)
          let dropIndexes = Array.from({ length: numDrops }, () =>
            Math.floor(Math.random() * graphData[key].length)
          ).sort((a, b) => a - b);

          let currentValue = graphData[key][0];
          const minValue = graphData[key][0];

          // Generate waterlevel data with drops
          graphData[key] = graphData[key].map((value, index) => {
            if (dropIndexes.includes(index)) {
              let maxStep = Math.floor(0.15 * currentValue);
              let step = Math.floor(Math.random() * (maxStep + 1));
              currentValue -= step;
            }
            return currentValue;
          });
        }
      }

      datasets1.push({
        label: displayNames[key],
        data: graphData[key],
        // fill:  key === 'waterlevel' ? true : false,
        fill: false,
        backgroundColor: 'rgba(0, 160, 255, 0.2)',
        borderColor: 'rgba(0, 100, 255, 0.2)',
        // color: "##00af91",
        borderColor: colors[key],
        yAxisID: yAxisIDs[key] || 'default-y-axis',
        // yAxisID: key + '-y-axis',
        // yAxisID: key === 'totalflow' ? 'totalflow-y-axis' : 'flowrate-y-axis'  ,
      });

      // Update total flow min and max based on dataset
      if (key === 'totalflow') {
        const minInDataset = Math.min(...graphData[key]);
        const maxInDataset = Math.max(...graphData[key]);
        totalFlowMin = Math.min(totalFlowMin, minInDataset);
        totalFlowMax = Math.max(totalFlowMax, maxInDataset);
      }
    }
  }

  let graph1;

  if (datasets1[0].label == "Total Flow (in L)") {
    graph1 = {
      type: "line",
      data: {
        labels: graphData.label,
        datasets: datasets1,
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: 'right',
          labels: {
            fontSize: 14,
          },
        },
        layout: {
          padding: {
            left: 25,
            right: 25,
            top: 5,
            bottom: 5,
          },
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time',
            },
            gridLines: {
              color: '#808080',
              drawOnChartArea: true,
              display: true,
            },
          }],
          yAxes: [{
            id: 'totalflow-y-axis',
            position: 'left',
            display: true,
            ticks: {
              // beginAtZero: true,
              min: totalFlowMin - 0.1 * (totalFlowMax - totalFlowMin), // Adjust min dynamically
              max: totalFlowMax + 0.1 * (totalFlowMax - totalFlowMin), // Adjust max dynamically
              // min: 0,
              fontColor: '#c0e218',
            },
            scaleLabel: {
              display: true,
              labelString: 'Total Flow',
              fontColor: '#c0e218',
            },
            gridLines: {
              color: '#808080',
              drawOnChartArea: true,
              display: true,
            }
          }]
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
        tooltips: {
          intersect: false,
          callbacks: {
            title: (tooltipItem, data) => {
              return graphData.tooltiplabel[tooltipItem[0].index];
            },
          }
        },
        legendCallback: (chart) => {
          const renderLabels = (chart) => {
            const { data } = chart;
            return data.datasets.map((item, idx) => {
              return `
                    <li class="legend-li-item" style="display: inline-block; margin-right: 10px;">
                      <div id="legend-${idx}-item" class="legend-item">
                        <span style="background-color: ${item.borderColor}"> &nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <!-- <span>
                          <input type="checkbox" class="legend-view-check" checked="true">
                        </span> -->
                        &nbsp;
                        ${item.label &&
                `<span class="label">${item.label}</span> &nbsp;`
                }
                      </div>
                    </li>
                  `;
            }).join("");
          };

          return `
                <ul class="chartjs-legend" style="list-style-type: none; white-space: nowrap;">
                  ${renderLabels(chart)}
                </ul>`;
        },

        responsive: true,
      }
    };
  } else {
    graph1 = {
      type: "line",
      data: {
        labels: graphData.label,
        datasets: datasets1,
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: 'right',
          labels: {
            fontSize: 14,
          },
        },
        layout: {
          padding: {
            left: 25,
            right: 25,
            top: 5,
            bottom: 5,
          },
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Time',
            },
            gridLines: {
              color: '#808080',
              drawOnChartArea: true,
              display: true,
            },
          }],
          yAxes: [{
            id: 'totalvolume-y-axis',
            position: 'left',
            display: true,
            ticks: {
              beginAtZero: true,
              min: 0,
              fontColor: '#ec4646',
            },
            scaleLabel: {
              display: true,
              labelString: 'Total Volume',
              fontColor: '#ec4646',
            }
          }, {
            id: 'waterlevel-y-axis',
            position: 'right',
            display: true,
            ticks: {
              beginAtZero: true,
              min: 0,
              fontColor: '#c0e218',
            },
            scaleLabel: {
              display: true,
              labelString: 'Total Flow',
              fontColor: '#c0e218',
            },
            gridLines: {
              color: '#808080',
              drawOnChartArea: true,
              display: true,
            }
          }]
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
        tooltips: {
          intersect: false,
          callbacks: {
            title: (tooltipItem, data) => {
              return graphData.tooltiplabel[tooltipItem[0].index];
            },
          }
        },
        legendCallback: (chart) => {
          const renderLabels = (chart) => {
            const { data } = chart;
            return data.datasets.map((item, idx) => {
              return `
                    <li class="legend-li-item" style="display: inline-block; margin-right: 10px;">
                      <div id="legend-${idx}-item" class="legend-item">
                        <span style="background-color: ${item.borderColor}"> &nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <!-- <span>
                          <input type="checkbox" class="legend-view-check" checked="true">
                        </span> -->
                        &nbsp;
                        ${item.label &&
                `<span class="label">${item.label}</span> &nbsp;`
                }
                      </div>
                    </li>
                  `;
            }).join("");
          };

          return `
                <ul class="chartjs-legend" style="list-style-type: none; white-space: nowrap;">
                  ${renderLabels(chart)}
                </ul>`;
        },

        responsive: true,
      }
    };
  }

  return graph1;
};

const chartConfig2 = ({ graphData }) => {

  let totalFlowMin = Number.POSITIVE_INFINITY; // Initialize with a large positive value
  let totalFlowMax = Number.NEGATIVE_INFINITY; // Initialize with a large negative value

  const displayNames = {
    'temperature': 'Temperature (in °C)',
    'humidity': 'Humidity (%)',
    'flowrate': 'Flow Rate (in kL/hr)',
    'pressure': 'Pressure (in centibar)',
    'totalflow': 'Total Flow (in L)',
    'totalvolume': 'Total Volume (in m³)',
    'waterlevel': 'Water Level (in cm)',
  };

  const colors = {
    'temperature': '#ec4646',
    'humidity': '#c0e218',
    'flowrate': '#00af91',
    'pressure': '#f58634',
    'totalflow': '#ec4646',
    'totalvolume': '#ec4646',
    'waterlevel': '#c0e218',
  };

  const datasets2 = [];

  for (key in graphData) {
    if (key == "pressure" || key == "flowrate") {
      datasets2.push({
        label: displayNames[key],
        data: graphData[key],
        fill: false,
        borderColor: colors[key],
      })
    }

    // Update total flow min and max based on dataset
    if (key === 'totalflow') {
      const minInDataset = Math.min(...graphData[key]);
      const maxInDataset = Math.max(...graphData[key]);
      totalFlowMin = Math.min(totalFlowMin, minInDataset);
      totalFlowMax = Math.max(totalFlowMax, maxInDataset);
    }
  }

  if (datasets2.length <= 0) {
    const element2 = document.getElementById("graph2");
    element2.parentNode.removeChild(element2);
    const element1 = document.getElementById("graph1");
    element1.classList.remove("col-xl-12");
    return
  }

  const graph2 = {
    type: "line",
    data: {
      labels: graphData.label,
      datasets: datasets2,
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
        position: 'top',
        rtl: true,
        labels: {
          fontSize: 14,
        }
      },
      layout: {
        padding: {
          left: 25,
          right: 25,
          top: 5,
          bottom: 5
        },
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time',
          },
          gridLines: {
            color: '#808080',
            drawOnChartArea: true,
            display: true,
          },
        }],
        yAxes: [{
          id: 'flowrate-y-axis',
          position: 'left',
          display: true,
          ticks: {
            beginAtZero: true,
            min: 0,
            fontColor: '#00af91',
          },
          scaleLabel: {
            display: true,
            labelString: 'Flow Rate',
            fontColor: '#00af91',
          },
        }]
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
      tooltips: {
        intersect: false,
        callbacks: {
          title: (tooltipItem, data) => {
            return graphData.tooltiplabel[tooltipItem[0].index];
          },
        }
      },
      legendCallback: (chart) => {
        const renderLabels = (chart) => {
          const { data } = chart;
          return data.datasets.map((item, idx) => {
            return `
                    <li class="legend-li-item" style="display: inline-block; margin-right: 10px;">
                      <div id="legend-${idx}-item" class="legend-item">
                        <span style="background-color: ${item.borderColor}"> &nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <!-- <span>
                          <input type="checkbox" class="legend-view-check" checked="true">
                        </span> -->
                        &nbsp;
                        ${item.label &&
              `<span class="label">${item.label}</span> &nbsp;`
              }
                      </div>
                    </li>
                  `;
          }).join("");
        };

        return `
                <ul class="chartjs-legend" style="list-style-type: none; white-space: nowrap;">
                  ${renderLabels(chart)}
                </ul>`;
      },
    }
  };

  return graph2;
};


const bindChartEvents1 = (myChart, containerElement) => {
  const legendCheckboxSelector = ".legend1-view-check"
  const legendCheckboxes = [
    ...containerElement.querySelectorAll(legendCheckboxSelector)
  ];

  legendCheckboxes.forEach((item, i) => {
    item.addEventListener("click", (e) =>
      updateDataset(i)
    );
  });

  const updateDataset = (index) => {
    const meta = myChart.getDatasetMeta(index);
    const result = meta.hidden === true ? true : false;
    if (result == true) {
      meta.hidden = false;
    } else {
      meta.hidden = true;
    }
    myChart.update();
  };
};

const bindChartEvents2 = (myChart, containerElement) => {
  const legendCheckboxSelector = ".legend2-view-check"
  const legendCheckboxes = [
    ...containerElement.querySelectorAll(legendCheckboxSelector)
  ];

  legendCheckboxes.forEach((item, i) => {
    item.addEventListener("click", (e) =>
      updateDataset(i)
    );
  });

  const updateDataset = (index) => {
    const meta = myChart.getDatasetMeta(index);
    const result = meta.hidden === true ? true : false;
    if (result == true) {
      meta.hidden = false;
    } else {
      meta.hidden = true;
    }
    myChart.update();
  };
};
