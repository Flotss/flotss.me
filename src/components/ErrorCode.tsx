import { Divider, Text } from '@chakra-ui/react';
import { Container } from './StyledBox';
import Title from './Title';

interface ErrorCodeProps {
  code: string;
  message: string;
}

/**
 * Renders an error code component.
 *
 * @param {ErrorCodeProps} props - The props for the error code component.
 * @returns {JSX.Element} The rendered error code component.
 */
const ErrorCode = (props: ErrorCodeProps) => {
  const { code, message } = props;

  // Function to determine the color based on the error code
  const getColor = (code: string): string => {
    if (code.startsWith('4')) return 'red'; // Client error codes
    if (code.startsWith('5')) return 'orange'; // Server error codes
    if (code.startsWith('3')) return 'blue'; // Redirection codes
    if (code.startsWith('2')) return 'green'; // Success codes
    return 'purple'; // Other codes
  };

  const color = getColor(code);

  return (
    <>
      <Container className="mx-5 mt-5 flex flex-col items-center justify-center space-y-5 px-5 py-5 sm:mx-20 sm:px-20">
        <Title title={code} className={color} color={color} />
        <Divider />
        <Text className="text-2xl">{message}</Text>
      </Container>
    </>
  );
};

export default ErrorCode;
