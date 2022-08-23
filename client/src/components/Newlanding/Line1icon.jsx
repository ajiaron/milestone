import { memo, SVGProps } from 'react';

const Line1Icon = (props) => (
  <svg preserveAspectRatio='none' viewBox='0 0 55 2' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M1 1L54 1' stroke='white' strokeLinecap='round' />
  </svg>
);

const Memo = memo(Line1Icon);
export { Memo as Line1Icon };

