interface TitleProps {
    title: string
    className?: string
}

export default function Title({ title, className }: TitleProps) {
    return (
        <div className="flex items-center justify-center mt-6">
            <h1 className={`text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 pb-5 pr-1 ${className}`}>
                {title}
            </h1>
        </div>
    )
}
