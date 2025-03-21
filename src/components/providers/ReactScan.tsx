'use client';

import { FunctionComponent, useEffect } from 'react';
import { scan } from 'react-scan';

export const ReactScan: FunctionComponent = () => {
  useEffect(() => {
    scan({
      enabled: process.env.NODE_ENV === 'development' ? true : false,
    });
  });

  return null;
};
