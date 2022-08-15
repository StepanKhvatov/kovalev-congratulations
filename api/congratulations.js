const congratulations = require("express").Router();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../utils/kovalev-congratulations-36185cf65812.json");

const transformRow = (row) => ({
  id: row.rowNumber,
  text: row.text || null,
  name: row.name || null,
  created: row.created || null,
});

const getLoadedDoc = async () => {
  const doc = new GoogleSpreadsheet(
    "1x9W92qD4E9y0jw_uAt7TH7Bb963AaDYicZZkWlmVYsY"
  );

  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo();

  return doc;
};

const checkValidBody = (body) => body.text && body.name;

congratulations.get("/api/congratulations", async (_, res) => {
  const doc = await getLoadedDoc();

  const sheet = doc.sheetsById[0];

  const rows = await sheet.getRows();

  const transformedRows = rows.map(transformRow);

  return res.send({ success: true, data: transformedRows });
});

congratulations.post("/api/congratulations", async (req, res) => {
  const { body } = req;

  const isValidBody = checkValidBody(body);

  if (!isValidBody) {
    return res.status(400).send({ success: false, message: "Body not valid" });
  }

  const { text, name } = body;

  const doc = await getLoadedDoc();

  const sheet = doc.sheetsById[0];

  const newRow = await sheet.addRow({
    text,
    name,
    created: new Date(),
  });

  const transformedRow = transformRow(newRow);

  return res.send({ success: true, data: transformedRow });
});

congratulations.put("/api/congratulations/:id", async (req, res) => {
  const { id } = req.params;

  const { body } = req;

  const isValidBody = checkValidBody(body);

  if (!isValidBody) {
    return res.status(400).send({ success: false, message: "Body not valid" });
  }

  const { text, name } = body;

  const doc = await getLoadedDoc();

  const sheet = doc.sheetsById[0];

  const rows = await sheet.getRows();

  const rowIndex = +id - 2;

  const row = rows[rowIndex];

  if (row) {
    rows[rowIndex].text = text;
    rows[rowIndex].name = name;

    await rows[rowIndex].save();

    const transformedRow = transformRow(row);

    return res.send({ success: true, data: transformedRow });
  }

  return res.status(404).send({ success: false, message: "Not found" });
});

module.exports = congratulations;
