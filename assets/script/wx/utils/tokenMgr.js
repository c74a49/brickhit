const key = "__token__";

var token = null;

function getToken() {
    return token;
}

function checkToken() {
  if (!token) return false;
    return true;
}

function setToken(info) {
    token = info;
    console.log('setToken:' + token);
}

module.exports = {
    getToken: getToken,
    checkToken: checkToken,
    setToken: setToken
}