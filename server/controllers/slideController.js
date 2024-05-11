const chatGpt = require("../utils/chatGpt.js")

const titleGenerate = async (req, res) => {
  let body = req.body;
  let response = await chatGpt.slideTitle(body.title, body.presentation_title, body.amount || 1);

  //\let response = ["Slide1", "Slide2","Slide3"]

  res.send(response)
}

const contentGenerate = async (req, res) => {
  let body = req.body;
  //let response = "Content based on "+body.title
  let response = await chatGpt.slideContent(body.title, body.section_title); 
  
  res.send(response)
}
module.exports = { titleGenerate, contentGenerate }
