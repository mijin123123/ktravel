import { useState, useEffect } from 'react';
import { Menu } from '../types';

export const useMenu = () => {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/menu.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Menu[] = await response.json();
        setMenu(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menu, loading, error };
};
