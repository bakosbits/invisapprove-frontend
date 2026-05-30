const Logo = ({ 
  size = 120, 
  primaryColor = '#3b52ff', // Blue outline
  accentColor = '#1effc6',  // Teal checkmark fill
  insideFill = '#f1f5f9',   // Background fill (set to '#ffffff' for white)
  className = '', 
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 620 380"
      width={size}
      height={size * (380 / 620)}
      className={className}
      {...props}
    >
      {/* ================= BACKGROUND FILLS ================= */}
      <g fill={insideFill}>
        {/* 'i' dot fill */}
        <circle cx="55" cy="55" r="30" />
        
        {/* 'i' stem fill */}
        <path d="M28 115 h54 v230 h-54 z" />
        
        {/* 'a' and 'v' main body fill */}
        <path d="M310 120 
                 C200 120, 110 200, 110 290 
                 C110 370, 210 370, 310 320 
                 C335 305, 360 250, 385 190 
                 C410 250, 440 360, 490 360 
                 C540 360, 560 240, 500 115
                 C470 180, 440 260, 415 260
                 C390 260, 365 180, 340 140
                 C330 125, 320 120, 310 120 Z" />
      </g>

      <path
        d="M515 150 
           C535 90, 560 30, 600 30 
           L610 30 
           C610 70, 570 110, 535 160 
           Z"
        fill={accentColor}
        stroke={primaryColor}
        strokeWidth="12"
        strokeLinejoin="round"
      />

      <g fill="none" stroke={primaryColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        {/* 'i' dot outline */}
        <circle cx="55" cy="55" r="30" />
        
        {/* 'i' stem outline */}
        <path d="M28 115 h54 v230 h-54 z" />
        
        {/* 'a' and 'v' main outline wireframe */}
        <path d="M310 120 
                 C200 120, 110 200, 110 290 
                 C110 370, 210 370, 310 320 
                 C335 305, 360 250, 385 190 
                 C410 250, 440 360, 490 360 
                 C540 360, 560 240, 500 115" />
      </g>
    </svg>
  );
};

export default Logo;