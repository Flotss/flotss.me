import { Divider, Text } from "@chakra-ui/layout";
import { StyledBox } from "./StyledBox";
import Title from "./Title";
import Image from "next/image";
import Link from "next/link";

/**
 * Renders an error code component.
 *
 * @param {ErrorCodeProps} props - The props for the error code component.
 * @returns {JSX.Element} The rendered error code component.
 */
const WorkInProgress = () : JSX.Element => {
    return (
        <>
            <StyledBox className="flex flex-col items-center justify-center px-5 sm:px-20 py-5 space-y-5 mx-5 sm:mx-20 mt-5">
                <Title title={'This page is not unvaible '} className={'black'}/>
                <Divider />
                <Text className="text-2xl">Work in progress</Text>
                <Image src="https://github.blog/wp-content/uploads/2023/01/1200x640.png?fit=1200%2C640" alt="github image" width={400} height={400} />
                {/* contribute */}
                <Text className="text-2xl">Contribute to this project</Text>
                <Text className="text-lg">If you want to contribute to this project, please visit the repository on GitHub.</Text>
                <Link href="https://www.github.com/rodriguesmsb/rodriguesmsb.github.io" target="_blank" rel="noopener noreferrer" className="text-lg">GitHub Repository</Link>
            </StyledBox>
        </>
    )
}

export default WorkInProgress;