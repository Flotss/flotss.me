import { Box } from "@chakra-ui/react";
import { Ref } from "react";

interface StyledBoxProps {
    children: React.ReactNode;
    className?: string;
    ref?: Ref<HTMLDivElement>;
    style?: React.CSSProperties;
}

export const StyledBox = ({ children, className, ...props }: StyledBoxProps) => {
    return (
        <Box className={`rounded-3xl bg-box-color p-8 ${className}`} {...props}>
            {children}
        </Box>
    );
};
