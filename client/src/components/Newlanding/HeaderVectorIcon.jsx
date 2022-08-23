


import { memo, SVGProps } from 'react';

const BackgroundVectorIcon = (props) => (
  <svg preserveAspectRatio='none' viewBox='0 0 428 277' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M150.621 161.21C56.0072 108.113 0 277 0 277V0H427.395C427.395 0 442.076 40.3025 326.799 76.7667C211.522 113.231 245.236 214.307 150.621 161.21Z'
      fill='url(#9_a)'
    />
    <defs>
      <linearGradient id='9_a' x1={77.0976} y1={-120.656} x2={304.139} y2={562.869} gradientUnits='userSpaceOnUse'>
        <stop offset={0.258935} stopColor='#0A0A0A' />
        <stop offset={1} stopColor='#757272' />
      </linearGradient>
    </defs>
  </svg>
);

const Memo = memo(BackgroundVectorIcon);
export { Memo as BackgroundVectorIcon };