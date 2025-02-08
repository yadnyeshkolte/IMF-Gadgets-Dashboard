import { cn } from "./utils.js"

const Button = ({
                    className,
                    variant = "default",
                    size = "default",
                    ...props
                }) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                {
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
                },
                {
                    "h-9 px-4 py-2": size === "default",
                    "h-8 rounded-md px-3 text-xs": size === "sm",
                    "h-10 rounded-md px-8": size === "lg",
                },
                className
            )}
            {...props}
        />
    )
}

export { Button }