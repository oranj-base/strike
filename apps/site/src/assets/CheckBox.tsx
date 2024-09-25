import * as React from 'react';
import { type SVGProps } from 'react';

export const CheckBoxIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.75 11.9445L10.25 15.4445L17.25 8.44446M7.1 22.4445H16.9C18.8602 22.4445 19.8403 22.4445 20.589 22.063C21.2475 21.7274 21.783 21.192 22.1185 20.5334C22.5 19.7847 22.5 18.8046 22.5 16.8445V7.04446C22.5 5.08427 22.5 4.10418 22.1185 3.35549C21.783 2.69692 21.2475 2.16149 20.589 1.82594C19.8403 1.44446 18.8602 1.44446 16.9 1.44446H7.1C5.13982 1.44446 4.15972 1.44446 3.41103 1.82594C2.75247 2.16149 2.21703 2.69692 1.88148 3.35549C1.5 4.10418 1.5 5.08427 1.5 7.04446V16.8445C1.5 18.8046 1.5 19.7847 1.88148 20.5334C2.21703 21.192 2.75247 21.7274 3.41103 22.063C4.15972 22.4445 5.13982 22.4445 7.1 22.4445Z"
        stroke="#3670FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};