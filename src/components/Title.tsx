import { Box, Text } from "@chakra-ui/react"

interface TitleProps {
    title: string
    className?: string
    color?: string
}

/**
 * The `Title` component displays a title text with customizable styling.
 *
 * @component
 * @param {TitleProps} props - The component's props.
 * @param {string} props.title - The title text to be displayed.
 * @param {string} [props.className] - Additional CSS classes to apply to the `Title` component.
 * @param {string} [props.color] - The text color of the title.
 * @returns {JSX.Element} - The rendered `Title` component.
 */
export default function Title({ title, className, color }: TitleProps) {
    return (
        <Box className="flex items-center justify-center">
            <Text className={`text-3xl mdrepo:text-5xl lgrepo:text-7xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 pb-5 pr-1 ${className}`}
                color={color}>
                {title}
            </Text>
        </Box>
    )
}
