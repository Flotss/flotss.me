import { Technologie } from '@/types/tech.types';
import React from 'react';
import Title from '../Title';
import Tech from './Tech';

interface TechStackComponentProps {
  technologies?: Technologie[];
}

const TechStackComponent: React.FC<TechStackComponentProps> = ({ technologies }) => {
  return (
    <>
      <Title title="Tech stack" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
      <p className="text-[#A0AEC0]">A brief description about the developer</p>
      <div className="flex justify-center gap-x-4">
        {/* Add your tech stack icons or content here */}
        {technologies?.map((tech) => <Tech key={tech.name} technologie={tech} />)}
      </div>
    </>
  );
};

export default TechStackComponent;
