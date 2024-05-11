import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import PresentationLoading from "./presentationLoading";
import PresentationViewer from "./presentationViewer"
export default function Presentation() {
  const [presentation, setPresentation] = useState({});
  let params = useParams();
  let {id} = params;
  
  useEffect(() => {
    async function getPresentation (){
      let url = "http://127.0.0.1:8000/api/presentation/"+id
      let {data} = await axios.get(url)
      console.log(data)
      setPresentation(data)
    }
    console.log(presentation)
    getPresentation();
  }, []);

  console.log(presentation)

  return (
    <>     
    <section className="p-4 flex justify-center h-screen items-center flex-col text-4xl gap-6 ">
      {
        (JSON.stringify(presentation) == "{}") ? <p>This presentation does not exist</p> 
        : (presentation.generated == true) ? <PresentationViewer presentation={presentation}/>
        : (presentation.generated == false) ? <PresentationLoading presentation={presentation}/>
        : <p>1</p>
      }    
      </section>
    </>
  );
}
