const axios = require('axios');
require('dotenv').config();

const askChatGPT = async (
  input,
  temperature = 1,
  presence_penalty = 0,
  frequency_penalty = 0
) => {
  const body = {
    model: 'gpt-4',
    messages: [{ role: 'system', content: input }],
    temperature,
    presence_penalty,
    frequency_penalty,
    max_tokens: 3500,
  };

  let { data } = await axios.post(process.env.OPENAI_URL, body, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return data;
};

const sectionTitle = async (title, amount) => {
  while (true) {
    let query = `You are a part of a complex and accurate presentation generator that handles section title generation. 
    Respond in json format.
    Your response contains only one key called "title"
    Key "title" contains ${amount} title${
      amount == 1 ? '' : 's'
    } of a section for a presentation titled - "${title}"   
    Each title of a section should be unique but keeping the context of presentation.
`;
    let response = await askChatGPT(query, 1, 2, 0);
    let { choices } = response;
    console.log("FAIZAN", choices)
    try {
      let result = JSON.parse(choices[0]['message']['content']?.replaceAll('\n', '')).title;
      if (typeof result == 'string') {
        result = [result];
      }
      return result;
    } catch (error) {
      console.error(error, response);
      console.log('Error, retrying');
    }
  }
};

const slideTitle = async (title, presentation_title, amount) => {
  while (true) {
    let query = `You are a part of a complex and accurate presentation generator that handles section title generation. 
    Respond in json format.
    Your response contains only one key called "title"
    Key "title" contains ${amount} title${
      amount == 1 ? '' : 's'
    } of a slide for a section titled - "${title}" and presentation titled - ${presentation_title}`;
    let response = await askChatGPT(query, 1, 2, 0);
    let { choices } = response;
    try {
      let result = JSON.parse(choices[0]['message']['content']?.replaceAll('\n', '')).title;
      if (typeof result == 'string') {
        result = [result];
      }
      return result;
    } catch (error) {
      console.error(error, response);
      console.log('Error, retrying');
    }
  }
};

const slideContent = async (title, section_title) => {
  let query = `You are a part of a complex and accurate presentation generator that handles slide content generation.
  Respond in json format. Your response contains only one key called "content". 
  Content that you generate is unique accurate and written using very good and adequate language.
  Content that you generate isn't repetetive.
  Content that you generate shouldn't be longer than one paragraph.
  Key "content" is plain text of slide's content that you'll generate considering slide title - "${title}" and section's title - "${section_title}"

`;
  while (true) {
    let response = await askChatGPT(query, 0.8, 0.8, 0.8);
    let { choices } = response;
    console.log(response);
    try {
      let result = JSON.parse(choices[0]['message']['content']?.replaceAll('\n', '')).content;

      return result;
    } catch (error) {
      console.error(error, response);
      console.log('Error, retrying');
    }
  }
};
module.exports = { sectionTitle, slideTitle, slideContent };
