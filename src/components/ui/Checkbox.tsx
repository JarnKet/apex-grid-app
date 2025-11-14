import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onCheckedChange) {
                onCheckedChange(e.target.checked)
            }
        }

        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    className={cn(
                        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-background checked:bg-primary checked:border-primary cursor-pointer transition-colors duration-200",
                        className
                    )}
                    ref={ref}
                    onChange={handleChange}
                    {...props}
                />
                <Check className="absolute h-3 w-3 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity duration-200" />
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
