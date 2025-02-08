import { cn } from "./utils.js"

const Alert = ({
                   className,
                   variant = "default",
                   ...props
               }) => (
    <div
        role="alert"
        className={cn(
            "relative w-full rounded-lg border p-4",
            {
                "bg-background text-foreground": variant === "default",
                "border-destructive/50 text-destructive dark:border-destructive": variant === "destructive",
            },
            className
        )}
        {...props}
    />
)

const AlertDescription = ({
                              className,
                              ...props
                          }) => (
    <div
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
)

export { Alert, AlertDescription }
