import { MutableRefObject } from "react";
import { Text } from "@chakra-ui/react";

const SpanExtraBold = ({
  innerHTML,
  color,
}: {
  innerHTML: string;
  color: string;
  ref?: MutableRefObject<any>;
}) => {
  return (
    <>
    <Text as="span" color={color} className="font-extrabold">
      {innerHTML}
    </Text>
    </>
  );
};

export default SpanExtraBold;