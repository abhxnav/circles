import { useEffect, useRef, useState } from 'react'
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
import { Loader2 } from 'lucide-react'

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T> // React Hook Form control object
  name: Path<T> // Name of the field
  label?: string // Optional label for the field
  placeholder?: string // Optional placeholder text
  fieldType: string // Type of the field (e.g., text, password, etc.)
  className?: string // Additional CSS classes for styling
  labelClassName?: string // CSS classes for the label
  messageClassName?: string // CSS classes for the error message
  post?: any // Optional post data for fields like file uploads
}

// Renders the appropriate input field based on the provided `fieldType`
const RenderField = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T, Path<T>> // Field object from React Hook Form
  props: CustomFormFieldProps<T> // Field configuration props
}) => {
  const { fieldType, placeholder, className, post } = props

  const observerRef = useRef<HTMLDivElement>(null) // Ref for intersection observer

  // States for password visibility, search input, and query
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [inputValue, setInputValue] = useState('')

  // Custom hook to fetch user mentions based on the search query
  const {
    data: searchedUsersData,
    isLoading,
    fetchNextPage: fetchSearchedNextPage,
    hasNextPage: hasSearchedNextPage,
    isFetchingNextPage: isFetchingSearchedNextPage,
  } = useSearchUsers(searchQuery)

  // Flattening paginated data into a single array
  const searchResults =
    searchedUsersData?.pages.flatMap((page: any) => page.users) || []

  // Debounce search input to avoid making too many API calls
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [inputValue])

  // Fetches the next page of search results when needed
  const fetchNextPage = () => {
    if (hasSearchedNextPage) {
      fetchSearchedNextPage()
    }
  }

  // Set up an intersection observer to trigger fetch when the user scrolls to the bottom
  useEffect(() => {
    if (!observerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 1 } // Trigger when the element is fully visible
    )

    observer.observe(observerRef.current)

    return () => observer.disconnect()
  }, [observerRef.current, hasSearchedNextPage])

  // Toggles visibility of password field
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible)

  // Render field based on `fieldType`
  switch (fieldType) {
    case 'text': // Render a text input
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

    case 'textarea': // Render a textarea
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

    case 'password': // Render a password input with toggle visibility
      return (
        <FormControl>
          <div className="relative">
            <Input
              placeholder={placeholder}
              type={isPasswordVisible ? 'text' : 'password'}
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

    case 'file': // Render a file uploader
      return (
        <FormControl>
          <FileUploader
            fieldChange={field.onChange}
            mediaUrl={post?.imageUrl}
          />
        </FormControl>
      )

    case 'mentions': // Render a mention search with list and selected users
      return (
        <FormControl>
          <div className="flex flex-col gap-5">
            <div className="text-light-primary">
              {/* Input field for search */}
              <Input
                placeholder="Search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className={clsx(
                  'h-10 bg-dark-secondary border-none text-light-primary placeholder:text-light-muted focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-muted',
                  className
                )}
              />

              {/* Display selected mentioned users */}
              <div className="flex items-center gap-2 mt-4 border border-dark-secondary rounded-md p-2 h-16 overflow-x-scroll scrollbar-styled">
                {field.value.length > 0 ? (
                  field.value.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-dark-secondary p-2 rounded-md min-w-fit"
                    >
                      <img
                        src={user?.avatar_url}
                        alt={user?.username}
                        className="size-5 rounded-full"
                      />
                      <p className="text-xs text-light-muted leading-none">
                        @{user?.username}
                      </p>
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

              {/* Render search results */}
              {isLoading ? (
                <MentionSearchListSkeleton />
              ) : (
                <div className="flex flex-col gap-2 mt-4 shadow-lg h-60 overflow-auto scrollbar-styled">
                  {searchResults?.length > 0 ? (
                    searchResults.map((user: User) => (
                      <>
                        <div
                          key={user.id}
                          onClick={() => {
                            const mentionedUsers = field.value.map(
                              (u: User) => u.id
                            )
                            if (!mentionedUsers.includes(user.id)) {
                              field.onChange([...field.value, user])
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
                        {hasSearchedNextPage && <div ref={observerRef} />}
                        {isFetchingSearchedNextPage && (
                          <div className="flex items-center justify-center w-full">
                            <Loader2
                              size={40}
                              className="animate-spin text-accent-coral text-center"
                            />
                          </div>
                        )}
                      </>
                    ))
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

// Main component that renders the field based on its configuration
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
          {label && (
            <FormLabel className={clsx('text-light-secondary', labelClassName)}>
              {label}
            </FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className={clsx(messageClassName)} />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
