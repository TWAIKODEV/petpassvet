import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <Link to="/" className="flex items-center">
      <div className="flex-shrink-0 text-[#2caa56]">
        <Stethoscope size={36} />
      </div>
      {!collapsed && (
        <span className="ml-2 text-2xl font-bold">
          <span className="text-[#042f40] font-fonarto">Petpass</span>
          <span className="text-[#2caa56]">Vet</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;