var urls = require('config').urls;
var util = require('../utils/util');

const startActivity = function(callback) {
    var url = urls.lottery + "/startActivity";
    var param = {};
    util.request({
        url: url,
        data: param,
        method: 'POST',
        success: res => {
            console.log('start activity success:', res);
            if (callback && typeof callback == 'function') {
                callback(res.data);
            }
        },
        fail: res => {
            console.log('start activity failed');
        },
    });
};

const runLottery = function(type, callback) {
    var url = urls.lottery + "/runLottery";
    var param = {
        lotteryType: type
    };
    util.request({
        url: url,
        data: param,
        method: 'POST',
        success: res => {
            console.log('run lottery success:', res);
            if (callback && typeof callback == 'function') {
                callback(res.data);
            }
        },
        fail: res => {
            console.log('run lottery failed');
        },
    });
};

/**
 * @deprecated - 弃用
 * @param {*} callback 
 */
const quitActivity = function(callback) {
    var url = urls.lottery + "/quitActivity";
    var param = {};
    util.request({
        url: url,
        data: param,
        method: 'POST',
        success: res => {
            console.log('quit activity success:', res);
            if (callback && typeof callback == 'function') {
                callback(res.data);
            }
        },
        fail: res => {
            console.log('quit activity failed');
        },
    });
};

module.exports = {
    startActivity: startActivity,
    runLottery: runLottery,
    quitActivity: quitActivity
}