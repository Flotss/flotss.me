import { StyledBox } from '@/components/StyledBox';
import { Heading, Text } from '@chakra-ui/react';

export default function contact(props) {
  return (
    <div className="flex flex-col gap-2 px-5 py-2 sm:px-20">
      <StyledBox>
        <Heading>Contact Page</Heading>
        <Text>This is the contact page.</Text>
      </StyledBox>
      <StyledBox>
        <Heading>Contact Page</Heading>
      </StyledBox>
    </div>
  );
}
