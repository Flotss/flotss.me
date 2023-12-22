import { Box } from "@chakra-ui/react";
import { Ref } from "react";

interface StyledBoxProps {
    children: React.ReactNode;
    className?: string;
    ref?: Ref<HTMLDivElement>;
    style?: React.CSSProperties;
}

export const StyledBox = ({ children, className, ...props }: StyledBoxProps) => (
    <Box className={`rounded-3xl bg-[#131312] p-8 ${className}`} {...props}>
        {children}
    </Box>
);
