import React from 'react';
import { IconPresentationAnalytics } from '@tabler/icons-react';
import { IconButton, TextButton } from '../components/buttons.jsx'

export default function Root() {
  return (
    <>
      <section className="p-4 flex justify-center h-screen items-center flex-wrap-reverse">
        <div className=" flex-col gap-10 justify-center">
          <h1 className="my-8 text-6xl font-bold  flex flex-col text-justify">Make your<br/>presentation<br/>using AI</h1>
          <TextButton onClick={()=>{window.location.href="generator"}}>Get started</TextButton>
        </div>
        <div className="p-2 object-fill">
          <img src="/src/assets/img/presentation.png"/>
        </div>
      </section>
    </>
  );
}
