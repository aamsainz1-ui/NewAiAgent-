const fs = require('fs');
const code = fs.readFileSync('./src/App.jsx', 'utf8');

const dynamicCode = code.substring(code.indexOf('const DynamicConnections'), code.indexOf('const useLiveStats'));
console.log(dynamicCode);
