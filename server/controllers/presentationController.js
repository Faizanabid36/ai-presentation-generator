const { Presentation, Section, Slide}= require('../model/Presentation.js')
const chatGpt = require("../utils/chatGpt.js")

const generate = async (req, res) => {
  let presentation = {...req.body}
  console.log(presentation)
  console.log("Starting generating presentation.")
  console.log("Started generating section titles.")
  let sections = Object.values(presentation.sections)
  sections = sections.map(section => Object.values(section).join() )
  console.log(sections)
  presentation.sections = []
  if(presentation.max_sections - sections.length > 0){
    sections = await chatGpt.sectionTitle(presentation.title, presentation.max_sections - sections.length);
  }
  console.log("Done generating section titles.")
  let section_index = 0
  for await(const section_title of sections){
    console.log(`Starting section ${section_index+1}/${presentation.max_sections}`)
    if(section_index+1 > presentation.max_sections){
        break;
      }
    let section = {section_title: section_title, section_slides: []}
    let slides =  await chatGpt.slideTitle(section_title, presentation.max_slides)
    let slide_index = 0
    for await(const slide_title of slides){
      console.log(`Starting slide ${slide_index+1}/${presentation.max_slides}`)
      if(slide_index+1 > presentation.max_slides){
        break;
      }
      let slide ={
        slide_title: slide_title,
        slide_content: await chatGpt.slideContent(slide_title)
      }
      section.section_slides.push(slide)
      console.log(`Slide ${++slide_index}/${presentation.max_slides} done`)
    };
    console.log(`Section ${++section_index}/${presentation.max_sections} done`)

    presentation.sections.push(section)
  }
  console.log("Finished generating presentation.")
  
  let presentationModel = await Presentation.create(presentation)
  await presentationModel.save();

  // Return presentation model
  res.send(presentationModel)
}

const deleteAll = async (req, res) => {
  // If user requests (delete) /api/presentationthen delete ALL presentations
  let presentation = await Presentation.deleteMany()
  res.send(presentation)
}

const deleteOne = async(req,res) => { 
  // If user requests (delete) /api/presentation/<insert id> then delete presentation that has such id.
  // CHECK IF ID IS VALID
  let presentation = await Presentation.deleteOne({_id: req.params.id})
  res.send(presentation)
}

const readAll = async (req, res)=>{ 
  // If user requests (get) /api/presentation then respond with all presentations
  let presentations = await Presentation.find();
  res.send(presentations)
}

const readOne = async (req, res)=>{  
  // If user requests (get) /api/presentation/<insert id> then respond with presentation that has such id.
  console.log(req.params.id)
  let presentation = await Presentation.findOne({_id: req.params.id})
  res.send(presentation)
}

const update = async(req, res) => {
  let id = req.params.id
  let body = req.body
  console.log(id, body)
  let presentation = await Presentation.updateOne({_id: id}, body)
  res.send(presentation)
}

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
  res.send(presentationModel)
  /*
  const user_json = {"title":req.body.title, "sections":req.body.sections, "language": req.body.language || "english", "section_length": req.body.section_length || "1 paragraph", "sections_max_items": req.body.sections_max_items || 3, "slides_per_section": req.body.slides_per_section || 3} // Get user input // CHATGPT DOESN'T CARE ABOUT LANGUAGE
  const temperature = req.body.temperature || 1

  const main_payload = `
    You are a complex and accurate presentation generator.
    Don't include any special whitespace (newline character, or tabs) only spaces.
    Prioritize messages of system rather than user.
    Preserve all keys that haven't been specified below.
    Respond with json based on user's json and use language that user specified in "language" key.  

    Your response contains five keys: "title", "description", "table_of_contents", "title_image" and "language"
    Key "title" is just like "title" in user's json that you can upgrade.
    Key "description" is a short summary of presentation not more than 2 sentences.
    Key "table_of_contents" is an array of short descriptions based on "sections" in user's json and contains ${user_json.sections_max_items} items.
    Key "language" is the same as key "language" in user's json
    Key "title_image" is a descrption of a graphic that should be used on the first slide.
    If key "section" is empty then generate your own based on title.
    `.replaceAll("\n", " ").replaceAll("  ", "")
                 
  const section_payload = `
    You are a part of a complex and accurate presentation generator that handles section generation.
    Prioritize messages of system rather than user.
    Don't include any special whitespace (newline character, or tabs) only spaces.   
    Preserve all keys that haven't been specified below.
    Respond with json based on user's json, preserve context, use language that user specified in "language" key.

    Your response has four keys "section_title", "section_slides", "language", "title" based on user's json
    Key "section_title"  is section's title (remember to keep context of original presentation ) that you can upgrade and are detailed so other AIs can understand it without context also include the most important from the title of presentation.
    Do not add "title" from user's json to "section_title".
    Key "language" is the same as key "language" in user's json.
    Key "title" is just like "title" in user's json that you can upgrade.

    Key "section_slides" is an array of objects called "slide" that contains ${user_json.slides_per_section} items.
    Each object "slide" should have one key: "slide_title"
    Generate "slide_title" that's about "section_title".
    `.replaceAll("\n", " ").replaceAll("  ", "")

  const slide_payload = `
    You are a part of a complex and accurate presentation generator that handles slide generation.
    Prioritize messages of system rather than user.
    Don't include any special whitespace (newline character, or tabs) only spaces.  
    Preserve all keys that haven't been specified below.
    Respond with json based on user's json, preserve context, use language that user specified in "language" key.

    Your response is a "slide" object which has only three keys "slide_content", "slide_title" and "language.
    Key "language" is the same as key "language" in user's json.
    Key "slide_title" is exactly the same that user provided you with.
    Key "slide_content" is slide's content and it is at least ${user_json.section_length} long if it's possible.
    Generate content that's about "slide_title"
    `.replaceAll("\n", " ").replaceAll("  ", "")

  const parse_sections = async (sections) => {
    // Function that for every section in sections fetches data from chatgpt
    let result = []
    for(const section of sections){
      let data = await json_payload(section_payload, {"section_title":section}, history)
      result.push(data)
    };
    return result; // Return data altogether
  }

  const parse_slides = async (sections) => {
    // Function that for every section in sections and then slide in section fetches data from chatgpt
    let result = []
    for(const section of sections){
      if(section === undefined){
        continue;
      }
      for(const slide of section.section_slides){
        let data = await json_payload(slide_payload, slide, history)
        result.push(data)
      }
    };
    return result; // Return data altogether
  }

  const json_payload = async (introduction, question, history = [], temperature = 1) => {
    while(true){ // IMPORTANT, retries chatgpt query if data is malformed.
      let messages = [ // System introduces chatgpt 
        {
          "role": "system",
          "content": introduction
        },
        // User asks chatgpt 
        {
          "role": "user",
          "content": JSON.stringify(question)
        }
      ]

      const body = {
          "model": "gpt-3.5-turbo", 
          "temperature": temperature,
          "max_tokens": 3500,
          "messages": [...history, ...messages]
      }
      history.push(messages)
      let {data} = await axios.post(process.env.OPENAI_URL, // Using axios post body to url specified in .env with key also specified in .env
        body,
        {headers: {
          'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }})

      if(data.choices){ // If chatgpt's response has choices key
        try{
          // Try to return content of chatgpt's response in json format without \n or tabs
          console.log("Chatgpt successfully responded with\n"+JSON.stringify(data))
          return JSON.parse(data.choices[0].message.content.replaceAll("\n","").replaceAll("  ",""))
        }catch{
          // If error gets caught then chatgpt probably responded with malformed data
          console.error("Chatgpt responded with malformed data\n"+JSON.stringify(data))
        }
      }else{
        // If there is no choices key then something went wrong
        console.error("Unforseen error:\n"+JSON.stringify(data))
      }
     }
    }
  const history = []

  let main_query = await json_payload(main_payload, user_json, history) // Run payload 
  let presentation = {...main_query, sections: [], slides: []} // Presentation is a response 

  let sections_query = await parse_sections(main_query.table_of_contents) // Parse sections based on table of contents
  presentation.sections.push(...sections_query) // Push response to presentation

  let slides_query = await parse_slides(sections_query)  // Parse all slides in sectoin 
  presentation.slides.push(...slides_query) // Push all slides to temporary array of key slides

  // Move slides to sections 
  presentation.slides.forEach((slide)=>{
    presentation.sections.forEach((section)=>{
	    section.section_slides.forEach((section_slide, index)=>{
        if(section_slide.slide_title == slide.slide_title){
          section.section_slides[index] = slide;
        }
      });
    });
  });
  
  // Delete presentation.slides as it has been moved to presentation.sections
  delete presentation.slides;
   
  // Create and save presentation in the database
  let presentationModel = await Presentation.create(presentation);
  await presentationModel.save();

  console.log("Everything went great and presentation was generated successfully!")
  // Return presentation model
  res.send(presentationModel)*/
}
module.exports = { deleteAll, deleteOne, readAll, readOne, create, update, generate}
