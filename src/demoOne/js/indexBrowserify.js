import jQuery from 'jquery';
import lodash from 'lodash';

import order from './orderBrowserify';
import about from './aboutBrowserify';

(function (win, doc) {
    // // 使用requie引入第三方库
    // jQuery = require('jquery');
    // lodash = require('lodash');

    console.log('jquery', jQuery('.footer'));
    console.log('lodash', lodash.isEmpty([1, 2, 3]));

    // const order = require('./order.js');
    // const about = require('./about.js');
    order();
    about();
    console.log('this is demoOne order and about node was insert body node successful!');
    console.log('this is demoOne order and about node was insert body node successful!');
    console.log('this is demoOne order and about node was insert body node successful!');
})(window, document);