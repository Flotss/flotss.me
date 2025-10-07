import { Box } from '@chakra-ui/react';
import React, { Ref } from 'react';

interface StyledBoxProps {
  children: React.ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}

/**
 * `StyledBox` is a custom component that wraps content within a styled `Box` component.
 *
 * @component
 * @param {StyledBoxProps} props - The component's props.
 * @param {React.ReactNode} props.children - The content to be rendered within the `StyledBox`.
 * @param {string} [props.className] - Additional CSS classes to apply to the `StyledBox`.
 * @param {Ref<HTMLDivElement>} [props.ref] - Ref object to attach to the underlying `div` element.
 * @param {React.CSSProperties} [props.style] - Additional inline styles to apply to the `StyledBox`.
 * @returns {JSX.Element} - The rendered `StyledBox` component.
 */
export const Container = ({ children, className, ...props }: StyledBoxProps) => {
  return (
    <ContainerNoStyle className={`rounded-3xl bg-box-color p-8 ${className}`} {...props}>
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
