// ContactHeader.tsx
'use client';

import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { Box, Text } from '@chakra-ui/react';

const ContactHeader = () => (
  <Container className="grid grid-cols-1 gap-2 sm:grid-cols-3">
    <Box className="col-span-2">
      <Box className="flex justify-start">
        <Title title="Contact." className=""></Title>
      </Box>
      <Text>Like my work? Want to collaborate or just have a chat? Feel free to get in touch.</Text>
    </Box>
    <picture>
      <img src="/images/contactflatdesign.png" alt="contact" width={150} />
    </picture>
  </Container>
);

export default ContactHeader;
