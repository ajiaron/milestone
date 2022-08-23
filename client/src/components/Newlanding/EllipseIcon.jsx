import { memo, SVGProps } from 'react';

const Ellipse1Icon = (props) => (
  <svg preserveAspectRatio='none' viewBox='0 0 273 273' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <circle cx={136.5} cy={136.5} r={135.5} fill='url(#11_a)' stroke='black' />
    <defs>
      <radialGradient
        id='11_a'
        cx={0}
        cy={0}
        r={1}
        gradientUnits='userSpaceOnUse'
        gradientTransform='translate(136.5 136.5) rotate(92.5354) scale(135.633)'
      >
        <stop stopColor='#555454' />
        <stop offset={1} stopColor='#1E1E1E' stopOpacity={0} />
      </radialGradient>
    </defs>
  </svg>
);

const Memo = memo(Ellipse1Icon);
export { Memo as Ellipse1Icon };
