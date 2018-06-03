const path = require('path');

const createAsset = require('./createAsset');

function createGraph(entry) {
  const mainAsset = createAsset(entry);

  // 我们用一个数组来保存每一个文件的依赖关系。一开始这里只有入口文件。
  const queue = [mainAsset];

  // 循环这个数组，分析其依赖，并将相对路径转换为绝对路径，然后在 push 到该数组内。
  for (const asset of queue) {
    asset.mapping = {};

    // 模块当前所在的文件内
    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);

      // 保存这个依赖关系
      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  return queue;
}

module.exports = createGraph;