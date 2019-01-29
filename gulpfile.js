var gulp = require('gulp'); // 自动化构建项目的工具
var fs = require('fs'); // node内置的文件系统模块
var path = require('path'); // node内置的路径拼接处理模块
// var browserify = require('browserify'); // browserify 是一个浏览器端代码模块化工具，可以处理模块之间的依赖关系，让服务器端的 CommonJS 格式的模块可以运行在浏览器端
// var watchify = require('watchify'); // 一个持续监视文件的改动，并且只重新打包必要的文件的 browserify 打包工具
// var babelify = require('babelify'); // Babel browserify transform
// var source = require('vinyl-source-stream'); // browserify的输出不能直接用着gulp的输入，vinly-source-stream 主要是做一个转化，把node文件流转换成gulp能够处理的流
// var buffer = require('vinyl-buffer'); // 把gulp流转换成buffer
// var buffer = require('gulp-buffer'); // 把stream转成buffer
// var streamify = require('gulp-streamify'); // 转换成gulp支持的流文件
var runSequence = require('run-sequence'); // 按照指定顺序执行task任务的插件 
var opn = require('opn'); // 自动打开浏览器
var uglify = require('gulp-uglify'); // 压缩混淆js的gulp插件
var eslint = require('gulp-eslint'); // 使用eslint进行代码校验
var cleanCss = require('gulp-clean-css'); // 压缩css的gulp插件
var autoprefixer = require('gulp-autoprefixer'); // css样式自动添加浏览器内核前缀，如-webkit,-moz,-o
var htmlmin = require('gulp-htmlmin'); // 压缩html文件的gulp插件
var imagemin = require('gulp-imagemin'); // 压缩PNG, JPEG, GIF and SVG格式的图片的gulp插件
// var pump = require('pump'); // 捕捉打包压缩js错误
var babel = require('gulp-babel'); // 转义es6语法的gulp插件
var sass = require('gulp-sass'); // 编译sass的gulp插件
var concat = require('gulp-concat'); // 合并文件的gulp插件
var gulpIf = require('gulp-if'); // 条件判断
var connect = require('gulp-connect'); // 创建web服务器的gulp插件
var rename = require('gulp-rename'); // 重命名插件
var plumber = require('gulp-plumber'); // Prevent pipe breaking caused by errors from gulp plugins(捕获错误))
var preprocess = require('gulp-preprocess'); // 在html和JS中自定义环境变量的gulp插件

var isProd = process.env.ENV === 'prod'; // 判断当前环境是否为生产环境
console.log('当前环境是', process.env.ENV);
var buildPath = 'src'; // 要打包的文件目录
var destPath = 'dist'; // 打包输出目录

// 使用browserify和watchify加速打包以及打包第三方类库
// gulp.task('mainJs', function () {
//     var b = browserify({
//         entries: ['src/demoOne/js/indexBrowserify.js'],
//         cache: {},
//         packageCache: {},
//         plugin: [watchify]
//     }).transform(babelify, {presets: ['es2015']}); // 在browserify中使用es6语法
//     // .external('jquery').external('lodash'); // 使用external避免jquery和lodash重复打包打main.js文件
//     var bundle = function () {
//         b.bundle()
//             // .pipe(fs.createWriteStream('src/demoOne/js/main.js'));
//             .pipe(plumber())
//             .pipe(source('indexBrowserify.js'))
//             // .pipe(buffer())
//             // .pipe(uglify())
//             .pipe(rename('mainBrowserify.js'))
//             .pipe(gulp.dest(path.join('src/demoOne/js')))
//     }
//     bundle(); // 执行一次输出操作
//     b.on('update', bundle);
// });

// // 单独打包第三方库到vendor.js
// gulp.task('vendorJs', function () {
//     var b = browserify()
//         .require('jquery', {
//             expose: 'jquery' // 别名
//         })
//         .require('lodash', {
//             expose: 'lodash'
//         })
//         .bundle()
//         .pipe(fs.createWriteStream('src/demoOne/js/vendor.js'));
// });

// gulp.task('buildMain', function () {
//     runSequence('vendorJs', 'mainJs');
// });

/**
 * @param { dir：string，文件夹名称}
 * @return {dir文件夹下的文件夹名称数组}  
 */
function getFolders (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        })
}
console.log('getFolders', getFolders('src'));
console.log(path.join(buildPath, 'demoOne', 'index.html'));

// 打包js
gulp.task('minifyJs', function () {
    getFolders(buildPath).map(function (folder) {
        gulp.src(path.join(buildPath, folder, 'js/*.js'))
            .pipe(plumber())
            .pipe(babel({
                // presets: ['env']
                presets: ['es2015']
            }))
            .pipe(eslint({useEslintrc: false}))
            .pipe(eslint.failOnError())
            .pipe(gulp.dest(path.join(destPath, folder, 'js')))
            .pipe(gulpIf(isProd, concat('main.js')))
            .pipe(gulpIf(isProd, uglify()))
            .pipe(gulp.dest(path.join(destPath, folder, 'js')))
            .pipe(connect.reload());
    });
});


// 打包css
gulp.task('minifyCss', function () {
    getFolders(buildPath).map(function (folder) {
        gulp.src(path.join(buildPath, folder, 'css/*.*')) // 输出要打包的css文件
            .pipe(autoprefixer())
            .pipe(sass())
            .pipe(gulp.dest(path.join(destPath, folder, 'css')))
            .pipe(concat('main.css'))
            .pipe(gulpIf(isProd, cleanCss())) // 兼容ie9及以上
            .pipe(gulp.dest(path.join(destPath, folder, 'css'))) // 把打包压缩好的css打包到dist/demoOne目录下的js文件夹中
            .pipe(connect.reload());
        });
});

// 压缩图片
gulp.task('minifyImgs', function () {
    getFolders(buildPath).map(function (folder) {
        gulp.src(path.join(buildPath, folder, 'imgs/*.*'))
            .pipe(gulpIf(isProd, imagemin()))
            .pipe(gulp.dest(path.join(destPath, folder, 'imgs')))
            .pipe(connect.reload());
        });
});

// 压缩html
gulp.task('minifyHtml', function () {
    getFolders(buildPath).map(function (folder) {
        gulp.src(path.join(buildPath, folder, '*.html'))
            // .pipe(plumber())
            .pipe(gulpIf(isProd, htmlmin({collapseWhitespace: true})))
            .pipe(gulp.dest(path.join(destPath, folder)))
            .pipe(connect.reload());
        });
});

// 创建本地web服务
gulp.task('devServer', function () {
    connect.server({
        name: 'Dev Server',
        host: '127.0.0.1',
        root: ['dist'],
        port: 8000,
        livereload: true
    });
});

// 监听文件修改
gulp.task('watch', function () {
    gulp.watch('src/**/js/*.js', ['minifyJs']);
    gulp.watch(['src/**/css/*.css', 'src/**/css/*.scss'], ['minifyCss']);
    gulp.watch('src/**/imgs/*.*', ['minifyImgs']);
    gulp.watch('src/**/*.html', ['minifyHtml']);
});

// 使用gulp命令，默认执行'default'任务
gulp.task('default', ['minifyJs', 'minifyCss', 'minifyImgs', 'minifyHtml', 'devServer', 'watch'], function () {
    console.log('build successful!');
    // 在mac上设置打开的浏览器类型为chrome会报：UnhandledPromiseRejectionWarning: Error: Exited with code 1 错误
    // opn('http://127.0.0.1:8000/demoOne', {app: 'chrome'});
    opn('http://127.0.0.1:8000/demoOne');
});

