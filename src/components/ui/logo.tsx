const Logo = ({ 
  size = 200, 
  primaryColor = '#3b52ff', 
  accentColor = '#1effc6', 
  fillColor = '#f1f5f9', // Use '#ffffff' for white or '#f1f5f9' for slate-100
  className = '',
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 540 320"
      width={size}
      height={size * (320 / 540)}
      className={className}
      {...props}
    >
      {/* 1. SOLID BACKGROUND COLOR LAYER (Fills the inside of the outlines) */}
      <g fill={fillColor}>
        {/* 'i' Dot Fill */}
        <circle cx="50" cy="50" r="30" />
        
        {/* 'i' Body Fill */}
        <path d="M20 100 h60 v200 h-60 z" />
        
        {/* Main 'a-v' Combined Shape Inner Fill */}
        <path d="M 175 100 
                 C 100 100, 100 300, 175 300 
                 C 230 300, 270 230, 270 170 
                 C 270 230, 310 300, 365 300 
                 C 410 300, 460 160, 410 100 
                 C 375 150, 350 220, 330 220 
                 C 310 220, 290 150, 250 100 
                 C 220 150, 200 220, 175 220 
                 C 145 220, 145 160, 175 160 
                 C 200 160, 215 190, 225 190 
                 C 240 190, 255 140, 270 100 Z" />
      </g>

      {/* 2. TEAL ACCENT WING LAYER */}
      <path
        d="M 430 130 
           C 445 90, 475 30, 520 30 
           C 510 70, 475 120, 445 170 Z"
        fill={accentColor}
        stroke={primaryColor}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. PRIMARY OUTLINE LAYER */}
      <g fill="none" stroke={primaryColor} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        {/* 'i' Dot Outline */}
        <circle cx="50" cy="50" r="30" />
        
        {/* 'i' Body Outline */}
        <path d="M 20 100 h 60 v 200 h -60 z" />
        
        {/* The continuous 'a' and 'v' fluid loop line */}
        <path d="M 270 100 
                 C 255 140, 240 190, 225 190 
                 C 215 190, 200 160, 175 160 
                 C 145 160, 145 220, 175 220 
                 C 200 220, 220 150, 250 100 
                 C 290 150, 310 220, 330 220 
                 C 350 220, 375 150, 410 100 
                 C 460 160, 410 300, 365 300 
                 C 310 300, 270 230, 270 170 
                 C 270 230, 230 300, 175 300 
                 C 100 300, 100 100, 175 100 Z" />
      </g>
    </svg>
  );
};

export default Logo;