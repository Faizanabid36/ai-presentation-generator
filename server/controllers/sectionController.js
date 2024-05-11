const chatGpt = require("../utils/chatGpt.js")

const titleGenerate = async (req, res) => {
  let body = req.body;
  let response = await chatGpt.sectionTitle(body.title, body.amount || 1);
  //"Section1"+body.title,"Section2"+body.title,"Section3"+body.title]
  res.send(response)
}

module.exports = { titleGenerate }
