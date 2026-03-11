import { Box, Text } from '@chakra-ui/react';

interface TitleProps {
  title: string;
  className?: string;
  color?: string;
}

export default function Title({ title, className, color }: TitleProps) {
  return (
    <Box className="flex items-center justify-center">
      <Text
        className={`bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text pb-5 pr-1 text-3xl font-bold tracking-tight text-transparent sm:text-5xl mdrepo:text-5xl lgrepo:text-7xl ${className}`}
        color={color}
      >
        {title}
      </Text>
    </Box>
  );
}
