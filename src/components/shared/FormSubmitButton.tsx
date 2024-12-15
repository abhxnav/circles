import { Button } from '@/components/ui'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

interface FormSubmitButtonProps {
  text: string
  isLoading: boolean
  loadingText: string
  className?: string
}

const FormSubmitButton = ({
  text,
  isLoading,
  loadingText,
  className,
}: FormSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={clsx(
        className,
        'bg-accent-coral hover:bg-accent-coral/70 text-dark-primary !border-none !outline-none flex gap-2'
      )}
    >
      {isLoading ? (
        <div className="flex gap-2 items-center justify-center">
          <Loader2 size={20} className="animate-spin" />
          <p>{loadingText}</p>
        </div>
      ) : (
        <>{text}</>
      )}
    </Button>
  )
}

export default FormSubmitButton
