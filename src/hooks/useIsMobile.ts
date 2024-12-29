import { breakpoints } from '@/utils/tailwindBreakpoints';
import { useMediaQuery } from '@chakra-ui/react';

export const useIsMobile = () => {
    const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.lg})`);
    return isMobile;
};
