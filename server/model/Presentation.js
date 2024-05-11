const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  slide_title: {
    type: String,
    
  },
  slide_content: {
    type: String,
  }
},{unique: false})

const SectionSchema = new mongoose.Schema({
  section_title: {
    type: String,
  },
  section_slides: {
      type: [SlideSchema],
    },

},{unique: false})

const PresentationSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    language: {
      type: String
    },
    summary: {
      type: String, 
    },
    sections: {
      type: [SectionSchema], default: []
      },
    generated: {
      type: Boolean, required: true, default: false
    },
    max_sections: {type: Number, default: 3},
    max_slides: {type:Number, default:3 }
  },{
      timestamps:true,
      unique: false
    })

const Presentation = mongoose.model('Presentation', PresentationSchema)
const Section = mongoose.model('Section', SectionSchema)
const Slide = mongoose.model('Slide', SlideSchema)

module.exports = {Presentation, Section, Slide}
