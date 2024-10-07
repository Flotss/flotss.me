import { technologieGroup } from '@/types/tech.types';
import React from 'react';
import Title from '../Title';

interface TechStackComponentProps {
  technologies?: technologieGroup[];
}

const TechStackComponent: React.FC<TechStackComponentProps> = ({ technologies }) => {
  return (
    <>
      <Title title="Tech stack" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
      <p className="text-[#A0AEC0]">A brief description about the developer</p>
      <div className="flex justify-center gap-x-4">
        {/* Add your tech stack icons or content here */}
      </div>
    </>
  );
};

export default TechStackComponent;
