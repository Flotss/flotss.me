import { Box } from "@chakra-ui/react";

interface StyledBoxProps {
    children: React.ReactNode;
    className?: string;
}
export const StyledBox = ({ children, className, ...props }: StyledBoxProps) => (
    <Box className={`rounded-3xl bg-[#131312] p-8 ${className}`} {...props}>
        {children}
    </Box>
);
