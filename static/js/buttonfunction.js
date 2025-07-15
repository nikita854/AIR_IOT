// USED

function status(tstamp) {
    var stat;
    var t = new Date(tstamp);
    var ts = new Date();
    if (ts - t > 30 * 60 * 1000) {
        stat = false;
    } else {
        stat = true;
    }
    return stat;
}

function dispdatetime(dt) {
    return dt.toLocaleString("en-GB", {
        day: "2-digit"
    }) + "-" + dt.toLocaleString("en-GB", {
        month: "2-digit"
    }) + " T " + dt.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function setContent(choice, data, m) {
    var a = data;
    var idx = 0;
    for (let i = 0; i < m.length; i++) {
        idx += 1;
        if (m[i] != undefined && a != undefined && m[i].name in a) {
            if (choice == 1) {
                coltotalflow(m[i], a[m[i].name].totalflow, a[m[i].name].created_at);
            }
            if (choice == 2) {
                colflowrate(m[i], a[m[i].name].flowrate, a[m[i].name].created_at)
            }
        }
    }
}

function checkStat(m, timeStamp) {
    var stat = status(timeStamp);
    var dt = new Date(timeStamp);
    if (stat) return true;
    m.marker.setIcon(greyIcon);
    m.marker.setTooltipContent("Last : " + dispdatetime(dt));
    return false;
}



function coltotalflow(m, value, TimeStamp) {
    value = value.toFixed(2);
    var str = value.toString();
    if (!checkStat(m, TimeStamp)) return;
    if (value < 0) {
        m.marker.setIcon(greyIcon);
        str = "not available";
    }
    str = Math.round(value).toString();
}

function colflowrate(m, value, TimeStamp) {
    value = value.toFixed(2);
    var str;
    if (value < 0) {
        m.marker.setIcon(greyIcon);
        str = "not available";
    }
    str = Math.round(value).toString();
    m.marker.setTooltipContent("Flow rate: " + ' ' + str);

}

function checkLessThanZero(m, value, col) {
    console.log('checkLessThanZero');
    if (value < 0) {
        m.marker.setIcon(greyIcon);
        s = "not available";
    } else {
        m.marker.setIcon(blueIcon);
    }

    value = Math.round(value);
    s = value.toString();
    m.marker.setTooltipContent(col + s);
}


// Parameter Function
function totalflowcall() {
    console.log('totalflowcall');
    param = 1;
    document.getElementById('parameters').innerHTML = 'Total Flow'
    setContent(1, datawater10, m_water);
}

function flowratecall() {
    console.log('flowratecall');
    param = 2;
    document.getElementById('parameters').innerHTML = 'Flow Rate'
    setContent(2, datawater10, m_water);
}