import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import { Control, FieldValues, Path } from 'react-hook-form'
import { useState } from 'react'
import Eye from '/public/assets/icons/eye.svg'
import EyeSlash from '/public/assets/icons/eye-slash.svg'

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type: 'text' | 'password' | 'email'
  placeholder: string
}

const CustomFormField = <T extends FieldValues>({
  control,
  name,
  label,
  type,
  placeholder,
}: CustomFormFieldProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-light-secondary">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={type === 'password' && isPasswordVisible ? 'text' : type}
                placeholder={placeholder}
                className="h-12 bg-dark-secondary border-none text-light-primary placeholder:text-light-muted focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-muted pr-12"
                {...field}
              />
              {type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-0 right-0 bg-transparent translate-y-1 text-light-muted focus:outline-none hover:outline-none border-none"
                >
                  <img
                    src={
                      isPasswordVisible
                        ? '/assets/icons/eye-slash.svg'
                        : '/assets/icons/eye.svg'
                    }
                    alt={isPasswordVisible ? 'Hide password' : 'Show password'}
                    className="size-5"
                  />
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
