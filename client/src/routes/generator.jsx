import React from 'react';
import { Form } from "../components/form.jsx"

export default function Generator(props){  
  return (
    <>
      <section className="p-4 flex justify-center h-screen items-center flex-wrap-reverse overflow-y-auto ">
        <div className=" flex-col gap-10 justify-center p-8 rounded-xl">
          <h1 className="my-8 text-6xl font-bold flex flex-col text-justify">Tell us about<br/>your presentation</h1>
          <Form/>
        </div>
      </section>
    </>
  );

}
