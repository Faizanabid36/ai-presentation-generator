import React from 'react';
import { useState } from 'react';
import { TextField, FieldHeader, FieldButtons, NumberField } from './input.jsx';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { IconButton, TextButton } from './buttons.jsx';
import { Box, BoxContent, BoxHeader } from './box.jsx';
import axios from 'axios';

export function BasicSectionInput(props) {
  const { id, removeSection, sectionInput } = props;

  return (
    <TextField name={id} onChange={sectionInput}>
      <FieldHeader>Section title</FieldHeader>
      <FieldButtons>
        <IconButton
          onClick={(e) => {
            removeSection(e, id);
          }}
        >
          <IconTrash />
        </IconButton>
      </FieldButtons>
    </TextField>
  );
}
export function Form() {
  const [sections, setSections] = useState([]);
  const [values, setValues] = useState({ sections: [] });

  const addSection = () => {
    let nextIndex = 0;
    if (sections.length > 0) {
      nextIndex = sections[sections.length - 1].id + 1;
    }
    setSections([...sections, { id: nextIndex, section_title: 'section' }]);
  };

  const sectionInput = (event) => {
    let target = event.target;
    let result = values;
    result.sections[target.name] = { section_title: target.value };
    setValues(result);
  };

  const removeSection = (event, id) => {
    let result = sections.filter((section) => section.id !== id);
    setSections(result);
    result = values;
    result.sections.splice(id, 1);
    setValues(result);
  };

  const generatePresentation = async () => {
    console.log(values);
    if (values.title == undefined || values.title == '') {
      return;
    } // SAVE TITLE GET ID AND THEN TELEPORT USER TO /presentation/ID

    let result = await axios.put(
      `${import.meta.env.VITE_API_URL}/presentation/`,
      values,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(result.data);
    let { _id } = result.data;
    window.location = '/presentation/' + _id;
  };
  const formInput = (event) => {
    let target = event.target;
    let result = values;
    result[target.name] = target.value;
    setValues(result);
  };

  return (
    <div className='flex gap-4 flex-col'>
      <TextField name='title' onChange={formInput}>
        <FieldHeader>
          <p>Title</p>
          <p>(required)</p>
        </FieldHeader>
      </TextField>
      <Box>
        <BoxHeader>
          <p>Sections</p>
        </BoxHeader>
        <BoxContent className='justify-center align-center flex flex-col'>
          {sections.map((section) => {
            return (
              <BasicSectionInput
                id={section.id}
                sectionInput={sectionInput}
                removeSection={removeSection}
              />
            );
          })}
          <IconButton
            className='justify-center align-center flex '
            onClick={addSection}
          >
            <IconPlus />
          </IconButton>
        </BoxContent>
      </Box>
      <Box>
        <BoxHeader>
          <p>Advanced options</p>
        </BoxHeader>
        <BoxContent className='flex flex-row flex-wrap max-w-xl justify-center gap-4 align-center '>
          <NumberField
            className='max-w-sm'
            name='max_sections'
            onChange={formInput}
            placeholder={3}
          >
            <FieldHeader>Max sections</FieldHeader>
          </NumberField>
          <NumberField
            className='max-w-sm'
            name='max_slides'
            onChange={formInput}
            placeholder={3}
          >
            <FieldHeader>Max slides</FieldHeader>
          </NumberField>
        </BoxContent>
      </Box>
      <TextButton onClick={generatePresentation}>Generate!</TextButton>
    </div>
  );
}
