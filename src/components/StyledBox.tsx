import { Box } from '@chakra-ui/react';
import React, { Ref } from 'react';

interface StyledBoxProps {
  children: React.ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}

export const Container = ({ children, className, ...props }: StyledBoxProps) => {
  return (
    <ContainerNoStyle
      className={`rounded-2xl border border-white/5 bg-white/[0.03] p-8 ${className}`}
      {...props}
    >
      {children}
    </ContainerNoStyle>
  );
};

export const ContainerNoStyle = ({ children, className, ...props }: StyledBoxProps) => {
  return (
    <Box className={`p-8 ${className}`} {...props}>
      {children}
    </Box>
  );
};
