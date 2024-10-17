import * as React from 'react';
import { type SVGProps } from 'react';

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="2" fill="#121212" />
      <rect y="8" width="24" height="2" fill="#121212" />
      <rect y="16" width="24" height="2" fill="#121212" />
    </svg>
  );
};
