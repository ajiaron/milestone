import { memo, SVGProps } from 'react';

const Line2Icon = (props) => (
  <svg preserveAspectRatio='none' viewBox='0 0 57 2' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M1 1H56' stroke='white' strokeLinecap='round' />
  </svg>
);

const Memo = memo(Line2Icon);
export { Memo as Line2Icon };
