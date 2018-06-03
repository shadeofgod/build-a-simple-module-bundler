const bundle = require('./src/bundle');
const createGraph = require('./src/createGraph');

const graph = createGraph('./example/main.js');

bundle(graph);