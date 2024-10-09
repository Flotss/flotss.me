import { Technologie } from '@/types/tech.types';
import Image from 'next/image';
import React from 'react';

interface TechProps {
  technologie: Technologie;
}

const Tech: React.FC<TechProps> = (props: TechProps) => {
  const { name, number, icon } = props.technologie;
  return (
    <div className="tech">
      <Image src={icon} alt={`${name} icon`} className="tech-icon" />
      <p className="tech-name">{name}</p>
      <p className="tech-name">{number}</p>
    </div>
  );
};

export default Tech;
