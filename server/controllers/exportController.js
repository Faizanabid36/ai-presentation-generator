const {Presentation} = require('../model/Presentation.js')
const PptxGenJs = require('pptxgenjs')

const generatePresentation = (presentation) => {
  let pptxPresentation = new PptxGenJs();
 
  pptxPresentation.theme = { headFontFace: "Montserrat" };
  pptxPresentation.theme = { bodyFontFace: "Montserrat" };

  pptxPresentation.author = "Author"
  pptxPresentation.title = presentation.title
  
  pptxPresentation.addSection({ title: "Title" });
  pptxPresentation.defineSlideMaster({
   title: "TITLE_WITH_DESCRIPTION_SLIDE",
   background: { color: "FFFFFF" },
   objects: [
    { 
      placeholder: {
        options: { name: "title_text", type: "title_text", x: 0.75, y: 1.25, w: 8.25, h: 0.5, align: "center", fontSize:24, bold: true },
        text: "Enter your title.",
      }
    },
    {
      placeholder: {
          options: { name: "description_text", type: "description_text", x: 0.75, y: 2.5, w: 8.25, h: 2.25, align: "left", fit:"shrink", fontSize:18},
        text: "Enter your description.",
      },
    },
   ]
  });
  pptxPresentation.defineSlideMaster({
   title: "TITLE_SLIDE",
   background: { color: "FFFFFF" },
   objects: [
    { 
      placeholder: {
        options: { name: "title_text", type: "title_text", x: 0.75, y: 2.25, w: 8.25, h: 0.5, align: "center", fontSize:24, bold: true },
        text: "Enter your title.",
      }
    }
  ]
  });
  pptxPresentation.defineSlideMaster({
   title: "DEFAULT_SLIDE",
   background: { color: "FFFFFF" },
   objects: [
    { 
      placeholder: {
          options: { name: "header_text", type: "header_text", x: 0.5, y: 0.5, w: 9.0, h: 0.5, bold: true, fontSize: 24, fit:"shrink"},
        text: "Enter your header.",
      }
    },
    {
      placeholder: {
          options: { name: "content_text", type: "content_text", x: 0.5, y: 1.25, w: 9, h: 4, fit:"shrink", fontSize: 18, valign:"middle"},
        text: "Enter your content.",
      },
    },
   ]
  });

  let titleSlide = pptxPresentation.addSlide({sectionTitle: "Title", masterName: "TITLE_WITH_DESCRIPTION_SLIDE"});
  titleSlide.addText(presentation.title, {placeholder: "title_text"});
  titleSlide.addText(presentation.description, {placeholder: "description_text"});

  let tableOfContentsSlide = pptxPresentation.addSlide({sectionTitle: "Title", masterName: "DEFAULT_SLIDE"});
  tableOfContentsSlide.addText("Table of contents", {placeholder: "header_text"})
  tableOfContentsSlide.addText(presentation.sections.map((section)=>section.section_title).join("\n"),{placeholder: "content_text"})

  presentation.sections.forEach((section)=>{
    pptxPresentation.addSection({ title: section.section_title});
    let sectionSlide = pptxPresentation.addSlide({sectionTitle: section.section_title, masterName: "TITLE_WITH_DESCRIPTION_SLIDE"});
    sectionSlide.addText(section.section_title, {placeholder: "title_text"})
    let text = section.section_slides.map(slide => slide.slide_title).join("\n")
    sectionSlide.addText(text, {placeholder: "description_text"})
    section.section_slides.forEach((slide)=>{
      let slideSlide = pptxPresentation.addSlide({sectionTitle: section.section_title, masterName: "DEFAULT_SLIDE"});
      slideSlide.addText(slide.slide_title, {placeholder: "header_text"})
      slideSlide.addText(slide.slide_content, {placeholder: "content_text"})
    })
  })

  return pptxPresentation
}

const pptxExport = async (req, res)=>{
  let presentation = await Presentation.findOne({_id: req.params.id})
  let pptxPresentation = generatePresentation(presentation)

  let fileName = presentation._id+".pptx"
  pptxPresentation.stream().then((data)=>{
    res.writeHead(200, { "Content-disposition": "attachment;filename=" + fileName, "Content-Length": data.length });
    res.end(Buffer.from(data, "binary"));
  })
}

module.exports = { pptxExport}
