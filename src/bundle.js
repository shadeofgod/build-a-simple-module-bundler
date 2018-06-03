const fs = require('fs');

function bundle(graph) {
  let modules = '';

  /**
   * 生成一串 key-value 结构，以 id 作为 key，一个数组作为 value。
   * 其中数组的第一个值为一个函数包裹的代码块，这样各自模块的作用域保持独立，不会影响其他的模块。
   * 第二个值为 { './relative/path': 1 } 这样的 mapping 对象，
   * 方便模块内使用相对路径的 require 函数调用。
   *
   * 因为生成的代码使用了 CommonJS 的模块引入方式，因此我们之后需要手动实现一下 require 函数。
   */
  graph.forEach(singleModule => {
    modules += `${singleModule.id}: [ function (require, module, exports) { ${singleModule.code} }, ${JSON.stringify(singleModule.mapping)}, ],`;
  });

  // 将 require 函数和 module.exports 保存在匿名的 IIFE 主函数，并将其引用注入到模块内部。
  const result = `(function(modules) {
    function require(id) {
      var fn = modules[id][0];
      var mapping = modules[id][1];

      function localRequire(name) {
        return require(mapping[name]);
      }

      var module = { exports: {} };

      fn(localRequire, module, module.exports);

      return module.exports;
    }

    require(0);
  })({ ${modules} });`


  fs.writeFile('bundle.js', result, 'utf-8', (err) => {
    if (err) throw err;
    console.log('The bundle file has been saved!');
  });

  return result;
};

module.exports = bundle;