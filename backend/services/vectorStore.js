const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let store = [];

async function indexPDFText(textFile) {

  store = [];

  const text =
    fs.readFileSync(textFile, 'utf-8');

  const chunks =
    text.match(/.{1,1500}/g) || [];

  console.log(
    `Split into ${chunks.length} chunks`
  );

  for (const chunk of chunks) {

    store.push({
      id: uuidv4(),
      text: chunk
    });
  }

  console.log(
    `Indexed ${chunks.length} chunks`
  );
}

function getStore() {
  return store;
}

module.exports = {
  indexPDFText,
  getStore
};