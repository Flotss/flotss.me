import { Box, Text } from "@chakra-ui/react"

interface TitleProps {
    title: string
    className?: string
}

export default function Title({ title, className }: TitleProps) {
    return (
        <Box className="flex items-center justify-center mt-6">
            <Text className={`text-3xl mdrepo:text-5xl lgrepo:text-7xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 pb-5 pr-1 ${className}`}>
                {title}
            </Text>
        </Box>
    )
}
