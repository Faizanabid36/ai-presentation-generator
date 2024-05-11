import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import Root from './routes/root';
import LandingPage from './routes/landingpage';
import Generator from './routes/generator';
import Presentation from './routes/presentation/presentation';
import PresentationBrowser from './routes/presentation/presentationBrowser';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/generator',
        element: <Generator />,
      },
      {
        path: '/presentation',
        element: <PresentationBrowser />,
      },
      {
        path: '/presentation/:id',
        element: <Presentation />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
  </>
);
