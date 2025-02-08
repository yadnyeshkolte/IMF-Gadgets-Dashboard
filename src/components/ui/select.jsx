import { cn } from "./utils.js"

const Select = ({
                    className,
                    ...props
                }) => (
    <select
        className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    />
)

export { Select }