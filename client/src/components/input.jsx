import React from 'react';
import {useState} from 'react';
import {IconNumber, IconQuote} from '@tabler/icons-react';
import {IconButton} from './buttons.jsx'

export function TextField(props){
  const {children, name, onChange} = props;
  const [contains, setContains] = useState(false);

  const updateClass = (input) => {
    input.className = "test";
  }

  return (
    <div className="flex flex-col relative">
      <input name={name}  className={`p-4 pr-12 border-2 border-black rounded-2xl outline-none peer ${contains ? 'contains' : ""}`} onChange={(e)=>{onChange(e);if(e.target.value != ""){setContains(true)}else{setContains(false)}}}/>
      <div className="flex justify-center align-center absolute right-4 top-[50%] -translate-y-[50%] ">
        <IconQuote/>  
      </div><label className="flex p-4 justify-between -top-0 align-center text-xl absolute w-full pointer-events-none peer-focus:-top-7 ease-in-out duration-100 peer-[.contains]:-top-7">{children}</label>
    </div>
  )
}
export function NumberField(props){
  const {children, name, onChange, placeholder, className} = props;
  const [contains, setContains] = useState(false);

  const updateClass = (input) => {
    input.className = "test";
  }

  return (
    <div className={`flex flex-col relative ${className}`}>
      <input name={name} placeholder={placeholder} className={`p-4 border-2 border-black rounded-2xl outline-none peer ${contains ? 'contains' : ""}`} onChange={(e)=>{onChange(e);e.target.value=e.target.value.replace(/\D/g, "");if(e.target.value != ""){setContains(true)}else{setContains(false)}}}/>
      <div className="flex justify-center align-center absolute right-4 top-[50%] -translate-y-[50%] ">
        <IconNumber/>  
      </div>
      <label className="flex p-4 justify-between -top-0 align-center text-xl absolute w-full pointer-events-none peer-focus:-top-7 ease-in-out duration-100 peer-[.contains]:-top-7">{children}</label>
    </div>
  )
}
export function FieldHeader(props){
  const {children} = props;

  return (<div className="flex align-center justify-between bg-white rounded-2xl p-2 py-0 width-full gap-2">{children}</div>)
}

export function FieldButtons(props){
  const {children} = props;

  return (<div className="flex align-center bg-white rounded-2xl p-2 py-0 pointer-events-auto">{children}</div>)
}


