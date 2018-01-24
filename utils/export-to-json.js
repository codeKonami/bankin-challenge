/**
 * convert JS Object in JSON files
 * @param {Object} data
 * @return {void} Write file to ./output.json
 */

const fs = require('fs');

module.exports =
  (data) => fs.writeFileSync(
    './output.json',
    JSON.stringify(data, null, 2),'utf8'
  );
