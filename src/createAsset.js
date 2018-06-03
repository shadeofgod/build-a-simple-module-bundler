const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

// 使用一个递增的 id 来区分每一个依赖
let ID = 0;

function createAsset(filename) {
  // 获取入口文件的文本内容
  const content = fs.readFileSync(filename, 'utf-8');

  // 利用 babylon parser 从 ES6 代码生成 ast
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  // 这里我们使用 babel 提供的工具从 ast 转化为 ES5 代码以适应多种浏览器
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });

  const id = ID++;

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

module.exports = createAsset;