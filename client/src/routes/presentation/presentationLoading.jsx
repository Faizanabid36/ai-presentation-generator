import React, { useState, useEffect } from 'react';
import { IconCheck, IconX, IconLoader2 } from '@tabler/icons-react';
import axios from 'axios';
import {
  Box,
  BoxHeader,
  BoxContent,
  IconContainer,
} from '../../components/box.jsx';
import { IconButton } from '../../components/buttons.jsx';

export default function PresentationLoading(props) {
  const presentationIntro = props.presentation;
  const [presentation, setPresentation] = useState(presentationIntro);
  const [sections, setSections] = useState(presentationIntro.sections);

  async function generateSections() {
    let amount;
    if (presentation.max_sections > sections.length) {
      amount = presentation.max_sections - sections.length;
    } else {
      amount = sections.length;
    }

    let { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/section/title/generate`,
      {
        amount: amount,
        title: presentation.title,
      }
    );
    data = data.map((section) => {
      return { section_title: section, section_slides: [], generated: false };
    });
    data = sections.concat(data);

    return data;
  }

  async function generateContent(title, section_title) {
    let { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/slide/content/generate`,
      {
        title: title,
        section_title: section_title,
      }
    );
    console.log(data);
    return data;
  }

  async function generateSlides(sections) {
    for await (const section of sections) {
      let { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/slide/title/generate`,
        {
          amount: presentation.max_slides,
          title: section.section_title,
          presentation_title: presentation.title,
        }
      );
      console.log('DATA', data);

      data = data.map((slide) => {
        return { slide_title: slide, slide_content: '' };
      });
      for await (const slide of data) {
        slide.slide_content = await generateContent(
          slide.slide_title,
          section.section_title
        );
      }
      section.section_slides = data;
      section.generated = true;
    }
    console.log('SECT', sections);
    return sections;
  }

  const presentationGenerated = (sections) => {
    return sections.every((section) => section.generated);
  };

  const updatePresentation = async (pres) => {
    let { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/presentation/${pres._id}`,
      pres
    );

    return data;
  };

  const updateSections = (data) => {
    presentation.sections = data;
    if (
      !sections.every(
        (section) =>
          section.generated == false || section.generated == undefined
      )
    ) {
      presentation.generated = true;
    }

    setSections(data);
    updatePresentation(presentation).then((data) => {
      if (presentation.generated) window.location.href = window.location.href;
    });

    return data;
  };

  const getPresentation = async () => {
    let { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/presentation/${presentation._id}`
    );
    return data;
  };

  useEffect(() => {
    getPresentation().then(setPresentation);
    generateSections().then(updateSections);
  }, []);
  useEffect(() => {
    generateSlides(sections).then(updateSections);
  }, [sections]);

  const getSections = () => {
    return sections.map((section) => (
      <Box className='w-full'>
        <BoxHeader>
          <p>{section.section_title}</p>
          <IconContainer>
            {!section.generated ? (
              <IconLoader2 className='animate-spin' />
            ) : (
              <IconCheck />
            )}
          </IconContainer>
        </BoxHeader>
        <BoxContent className='flex-col'>
          {section.section_slides.map((slide) => {
            return (
              <div>
                <div className='text-2xl'>{slide.slide_title}</div>
                <div className='text-xl'>{slide.slide_content}</div>
              </div>
            );
          })}
        </BoxContent>
      </Box>
    ));
  };

  return (
    <>
      <p className='text-6xl font-bold'>
        Getting your
        <br /> presentation ready...
      </p>
      <div className='flex flex-col gap-4 p-4 w-full max-w-xl overflow-auto'>
        <p>&quot;{presentation.title}&quot;</p>
        {getSections()}
      </div>
    </>
  );
}
