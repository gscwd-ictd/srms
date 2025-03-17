'use client';

import { type FunctionComponent } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../ui/Tabs';
import { Laptop, Moon, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeSwitcher: FunctionComponent = () => {
  const { setTheme } = useTheme();
  const theme = localStorage.getItem('theme');

  return (
    <Tabs defaultValue={theme ?? 'system'}>
      <TabsList className="bg-secondary/50">
        <TabsTrigger value="light" onClick={() => setTheme('light')}>
          <SunMedium />
        </TabsTrigger>

        <TabsTrigger value="dark" onClick={() => setTheme('dark')}>
          <Moon />
        </TabsTrigger>

        <TabsTrigger value="system" onClick={() => setTheme('system')}>
          <Laptop />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
