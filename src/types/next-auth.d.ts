import 'next-auth';
import 'react';

declare module 'react' {
  interface ReactNode {
    readonly $$typeof?: symbol;
  }
}

declare module 'next/link' {
  export default function Link(props: any): JSX.Element;
} 