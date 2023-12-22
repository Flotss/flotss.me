import { Divider, Text } from "@chakra-ui/layout";
import { StyledBox } from "./StyledBox";
import Title from "./Title";

interface ErrorCodeProps {
    code: string;
    message: string;
}

const ErrorCode = (props: ErrorCodeProps): JSX.Element => {
    const { code, message } = props;

    const getColor = (code: string): string => {
        if (code.startsWith("4")) return "red";
        if (code.startsWith("5")) return "orange";
        if (code.startsWith("3")) return "blue";
        if (code.startsWith("2")) return "green";
        return "purple";
    }


    const color = getColor(code);

    return (
        <>
            <StyledBox className="flex flex-col items-center justify-center px-5 sm:px-20 py-5 space-y-5 mx-5 sm:mx-20 mt-5">
                <Title title={code} className={color} color={color}/>
                <Divider />
                <Text className="text-2xl">{message}</Text>
            </StyledBox>
        </>
    )
}

export default ErrorCode