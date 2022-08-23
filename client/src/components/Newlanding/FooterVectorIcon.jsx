import { memo, SVGProps } from 'react';

const BackgroundVectorIcon2 = (props) => (
  <svg preserveAspectRatio='none' viewBox='0 0 447 255' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M289.692 106.594C388.506 155.473 447 -1.52588e-05 447 -1.52588e-05V255H0.631927C0.631927 255 -14.7013 217.898 105.693 184.33C226.088 150.762 190.878 57.7136 289.692 106.594Z'
      fill='url(#10_a)'
    />
    <defs>
      <linearGradient id='10_a' x1={366.48} y1={366.074} x2={178.073} y2={-277.427} gradientUnits='userSpaceOnUse'>
        <stop offset={0.258935} stopColor='#0A0A0A' />
        <stop offset={1} stopColor='#757272' />
      </linearGradient>
    </defs>
  </svg>
);

const Memo = memo(BackgroundVectorIcon2);
export { Memo as BackgroundVectorIcon2 };
