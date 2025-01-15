import { useEffect, useState } from 'react'
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/components/ui'
import clsx from 'clsx'
import { FileUploader, MentionSearchListSkeleton } from '@/components'
import { useSearchUsers } from '@/react-query/queries'

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  placeholder?: string
  fieldType: string
  className?: string
  labelClassName?: string
  messageClassName?: string
  post?: any
}

const RenderField = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T, Path<T>>
  props: CustomFormFieldProps<T>
}) => {
  const { fieldType, placeholder, className, post } = props

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState('')

  const { data: searchResults, isLoading } = useSearchUsers(searchQuery)

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [inputValue])

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible)

  switch (fieldType) {
    case 'text':
      return (
        <FormControl>
          <Input
            placeholder={placeholder}
            className={clsx(
              'h-12 bg-dark-secondary border-none text-light-primary placeholder:text-light-muted focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-muted',
              className
            )}
            {...field}
          />
        </FormControl>
      )

    case 'textarea':
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            className={clsx(
              'h-36 bg-dark-secondary text-light-secondary rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-dark-muted scrollbar-styled',
              className
            )}
            {...field}
          />
        </FormControl>
      )

    case 'password':
      return (
        <FormControl>
          <div className="relative">
            <Input
              placeholder={placeholder}
              className={clsx(
                'h-12 bg-dark-secondary border-none text-light-primary placeholder:text-light-muted focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-muted pr-12',
                className
              )}
              {...field}
            />
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
          </div>
        </FormControl>
      )

    case 'file':
      return (
        <FormControl>
          <FileUploader
            fieldChange={field.onChange}
            mediaUrl={post?.imageUrl}
          />
        </FormControl>
      )

    case 'mentions':
      return (
        <FormControl>
          <div className="flex flex-col gap-5">
            <div className="text-light-primary">
              {/* Search Bar */}
              <Input
                placeholder="Search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={clsx(
                  'h-10 bg-dark-secondary border-none text-light-primary placeholder:text-light-muted focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-muted',
                  className
                )}
              />

              {/* Mentioned Users */}
              <div className="flex items-center gap-2 mt-4 border border-dark-secondary rounded-md p-2 h-16 overflow-x-scroll scrollbar-styled">
                {field.value.length > 0 ? (
                  field.value.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-dark-secondary p-2 rounded-md min-w-fit"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user?.avatar_url}
                          alt={user?.username}
                          className="size-5 rounded-full"
                        />
                        <p className="text-xs text-light-muted leading-none">
                          @{user?.username}
                        </p>
                      </div>
                      <img
                        src="/assets/icons/remove.svg"
                        alt="x"
                        className="size-5 cursor-pointer"
                        onClick={() => {
                          field.onChange(
                            field.value.filter((u: User) => u.id !== user.id)
                          )
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-dark-muted text-sm pl-2">
                    No mentions yet
                  </p>
                )}
              </div>

              {/* Search List */}
              {isLoading ? (
                <MentionSearchListSkeleton />
              ) : (
                <div className="flex flex-col gap-2 mt-4 shadow-lg h-60 overflow-auto scrollbar-styled">
                  {searchResults?.length > 0 ? (
                    searchResults.map((user: User) => {
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            const mentionedUsers = field.value.map(
                              (u: User) => u.id
                            )
                            if (!mentionedUsers.includes(user.id)) {
                              field.onChange([...field.value, user]) // Append to mentions
                            }
                          }}
                          className="flex items-center gap-3 cursor-pointer rounded-md bg-dark-secondary p-4 hover:opacity-70"
                        >
                          <img
                            src={user?.avatar_url}
                            alt={user?.username}
                            className="size-10 rounded-full"
                          />
                          <div className="flex flex-col gap-1">
                            <p className="leading-none">{user?.name}</p>
                            <p className="text-xs text-light-muted leading-none">
                              @{user?.username}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-light-muted text-sm">
                      No results found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </FormControl>
      )

    default:
      break
  }
}

const CustomFormField = <T extends FieldValues>(
  props: CustomFormFieldProps<T>
) => {
  const { control, name, label, labelClassName, messageClassName } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={clsx('text-light-secondary', labelClassName)}>
            {label}
          </FormLabel>
          <RenderField field={field} props={props} />
          <FormMessage className={clsx(messageClassName)} />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
