const hoodie = require("express").Router();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../utils/kovalev-congratulations-36185cf65812.json");

const transformRow = (row) => ({
  name: row.name || null,
  contacts: row.contacts || null,
});

const getLoadedDoc = async () => {
  const doc = new GoogleSpreadsheet(
    "1x9W92qD4E9y0jw_uAt7TH7Bb963AaDYicZZkWlmVYsY"
  );

  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo();

  return doc;
};

const checkValidBody = (body) => body.name && body.contacts;

hoodie.post("/api/hoodie", async (req, res) => {
  const { body } = req;

  const isValidBody = checkValidBody(body);

  if (!isValidBody) {
    return res.status(400).send({ success: false, message: "Body not valid" });
  }

  const { name, contacts } = body;

  const doc = await getLoadedDoc();

  const sheet = doc.sheetsById[881745631];

  const newRow = await sheet.addRow({
    name,
    contacts,
    created: new Date(),
  });

  const transformedRow = transformRow(newRow);

  return res.send({ success: true, data: transformedRow });
});

module.exports = hoodie;
