import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import DarkModeToggle from '../components/DarkModeToggle';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    if (localStorage.theme === 'dark')
      document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className='w-screen min-h-screen bg-gradient-to-tr bg-blue-300 dark:bg-slate-800 p-5 flex flex-col justify-start items-center text-slate-800'>
      <DarkModeToggle />
      <ToastContainer />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
