import { useEffect, useState } from 'react';
const useDarkMode = (): [boolean | undefined, (darkMode: boolean) => void] => {
  const [enabled, setenabled] = useState<boolean>();

  useEffect(() => {
    setenabled(localStorage.theme === 'dark');
  }, []);
  useEffect(() => {
    if (enabled === undefined) return;
    if (enabled) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = 'light';
    }

    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
      document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [enabled]);

  return [enabled, setenabled];
};

export default useDarkMode;
