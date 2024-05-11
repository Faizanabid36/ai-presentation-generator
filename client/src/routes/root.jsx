import { IconMenu2 } from '@tabler/icons-react';
import React from 'react';
import { Outlet } from "react-router-dom";
import { IconPresentationAnalytics, IconSearch } from '@tabler/icons-react';
import {TextButton, LinkButton} from '../components/buttons.jsx'



export default function Root() {
  return (
    <>
      <header className="p-4 flex justify-between items-center absolute w-full top-0 font-extrabold">
        <LinkButton className="border-0 p-0" href="/">
          <IconPresentationAnalytics/>
        </LinkButton>
        <LinkButton  className="border-0 p-0" href="/presentation/">
          <IconSearch/>
        </LinkButton>
      </header>
      <Outlet/>
    </>
  );
}
