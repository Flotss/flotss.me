import React from 'react';

interface TechProps {
  name: string;
  icon: string;
}

const Tech: React.FC<TechProps> = ({ name, icon }) => {
  return (
    <div className="tech">
      <img src={icon} alt={`${name} icon`} className="tech-icon" />
      <p className="tech-name">{name}</p>
    </div>
  );
};

export default Tech;
