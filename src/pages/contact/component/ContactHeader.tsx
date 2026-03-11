// ContactHeader.tsx
'use client';

import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { Box, Text } from '@chakra-ui/react';

const ContactHeader = () => (
  <Container className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <Box className="col-span-2">
      <Box className="flex justify-start">
        <Title title="Contact." />
      </Box>
      <Text className="text-zinc-400">
        Like my work? Want to collaborate or just have a chat? Feel free to get in touch.
      </Text>
    </Box>
    <Box className="flex items-center justify-center">
      <picture>
        <img
          src="/images/contactflatdesign.png"
          alt="contact"
          width={150}
          className="opacity-80"
        />
      </picture>
    </Box>
  </Container>
);

export default ContactHeader;
