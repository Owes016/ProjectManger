import * as React from 'react';

declare module 'react' {
  // Augment ReactNode to accept bigint
  type ReactNode = 
    | React.ReactElement
    | string
    | number
    | bigint // Add bigint support
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
} 