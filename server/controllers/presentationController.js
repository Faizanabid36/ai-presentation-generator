const { Presentation, Section, Slide } = require('../model/Presentation.js');
const chatGpt = require('../utils/chatGpt.js');

const generate = async (req, res) => {
  let presentation = { ...req.body };
  console.log(presentation);
  console.log('Starting generating presentation.');
  console.log('Started generating section titles.');
  let sections = Object.values(presentation.sections);
  sections = sections.map((section) => Object.values(section).join());
  console.log(sections);
  presentation.sections = [];
  if (presentation.max_sections - sections.length > 0) {
    sections = await chatGpt.sectionTitle(
      presentation.title,
      presentation.max_sections - sections.length
    );
  }
  console.log('Done generating section titles.');
  let section_index = 0;
  for await (const section_title of sections) {
    console.log(
      `Starting section ${section_index + 1}/${presentation.max_sections}`
    );
    if (section_index + 1 > presentation.max_sections) {
      break;
    }
    let section = { section_title: section_title, section_slides: [] };
    let slides = await chatGpt.slideTitle(
      section_title,
      presentation.max_slides
    );
    let slide_index = 0;
    for await (const slide_title of slides) {
      console.log(
        `Starting slide ${slide_index + 1}/${presentation.max_slides}`
      );
      if (slide_index + 1 > presentation.max_slides) {
        break;
      }
      let slide = {
        slide_title: slide_title,
        slide_content: await chatGpt.slideContent(slide_title),
      };
      section.section_slides.push(slide);
      console.log(`Slide ${++slide_index}/${presentation.max_slides} done`);
    }
    console.log(`Section ${++section_index}/${presentation.max_sections} done`);

    presentation.sections.push(section);
  }
  console.log('Finished generating presentation.');

  let presentationModel = await Presentation.create(presentation);
  await presentationModel.save();

  // Return presentation model
  res.send(presentationModel);
};

const deleteAll = async (req, res) => {
  // If user requests (delete) /api/presentationthen delete ALL presentations
  let presentation = await Presentation.deleteMany();
  res.send(presentation);
};

const deleteOne = async (req, res) => {
  // If user requests (delete) /api/presentation/<insert id> then delete presentation that has such id.
  // CHECK IF ID IS VALID
  let presentation = await Presentation.deleteOne({ _id: req.params.id });
  res.send(presentation);
};

const readAll = async (req, res) => {
  // If user requests (get) /api/presentation then respond with all presentations
  let presentations = await Presentation.find();
  res.send(presentations);
};

const readOne = async (req, res) => {
  // If user requests (get) /api/presentation/<insert id> then respond with presentation that has such id.
  console.log(req.params.id);
  let presentation = await Presentation.findOne({ _id: req.params.id });
  res.send(presentation);
};

const update = async (req, res) => {
  let id = req.params.id;
  let body = req.body;
  console.log(id, body);
  let presentation = await Presentation.updateOne({ _id: id }, body);
  res.send(presentation);
};

const create = async (req, res) => {
  // If user requests (post) /api/presentation then create and repsond with presentation
  // TODO
  // ADD CONTEXT
  // ADD THE ABILITY FOR THE USER TO ADD THEIR OWN MESSAGES TO PAYLOAD
  // ADD IMAGE DESCRIPTION IN CHATGPT RESPONSE

  // Create and save presentation in the database
  let body = req.body;

  let presentationModel = await Presentation.create(body);
  await presentationModel.save();

  // Return presentation model
  res.send(presentationModel);
};
module.exports = {
  deleteAll,
  deleteOne,
  readAll,
  readOne,
  create,
  update,
  generate,
};
