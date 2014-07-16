/* global browser, global, protractor */
var sandboxUrl = 'http://127.0.0.1:8765/test/e2e/env/index.html';
var i = 0;

global.By = protractor.By;
global.prot = protractor.getInstance();

beforeEach(function() {
  i = 0;
  browser.get(sandboxUrl);
});

module.exports = {
  help: function() {
    i++;
    return i <= 1 ? '... I need somebody.' : 'not just anybody!';
  }
};