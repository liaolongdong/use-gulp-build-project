'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _orderBrowserify = require('./orderBrowserify');

var _orderBrowserify2 = _interopRequireDefault(_orderBrowserify);

var _aboutBrowserify = require('./aboutBrowserify');

var _aboutBrowserify2 = _interopRequireDefault(_aboutBrowserify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (win, doc) {
    // // 使用requie引入第三方库
    // jQuery = require('jquery');
    // lodash = require('lodash');

    console.log('jquery', (0, _jquery2.default)('.footer'));
    console.log('lodash', _lodash2.default.isEmpty([1, 2, 3]));

    // const order = require('./order.js');
    // const about = require('./about.js');
    (0, _orderBrowserify2.default)();
    (0, _aboutBrowserify2.default)();
    console.log('this is demoOne order and about node was insert body node successful!');
    console.log('this is demoOne order and about node was insert body node successful!');
    console.log('this is demoOne order and about node was insert body node successful!');
})(window, document);