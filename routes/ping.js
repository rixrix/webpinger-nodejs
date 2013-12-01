
function pingHostCmd(host) {
    var data_idx = 1,
        latency_idx = 6,
        cmd = "ping -n -c 1",
        exec = require('exec-sync'),
        result,
        latency;

    if (result = exec(cmd + " " + host)) {
        latency = result.match(/[^\n]+/g)[data_idx].match(/[^\s]+/g)[latency_idx];
        if (latency !== undefined) {
            latency = latency.replace("time=", "").replace("ms", "");
            return (latency < 1) ? 0 : latency;
        }
    }

    return null;
}

function pingHosts(hosts) {
    var result = {};

    hosts.forEach(function(val, idx, array){
        result[val] = pingHostCmd(val);
    });

    return result;
}

exports.ping = function(req, res){
    var hosts = req.query.hosts.match(/[^,]+/g);
    var result = {};

    if (result = pingHosts(hosts)) {
        result = JSON.stringify(result);
    }

    res.send(result);
};