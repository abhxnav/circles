import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui'
import { SignupFormSchema } from '@/lib/validations'
import { CustomFormField, FormSubmitButton, Logo } from '@/components'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useSignUpUser } from '@/react-query/mutations'

const SignupForm = () => {
  const { toast } = useToast() // Toast notifications

  const { mutateAsync: signUpUser, isPending: isLoading } = useSignUpUser() // Signup mutation hook

  // React Hook Form setup with Zod validation schema
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: '', // Default name field value
      username: '', // Default username field value
      email: '', // Default email field value
      password: '', // Default password field value
    },
  })

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof SignupFormSchema>) => {
    try {
      const { success, message } = await signUpUser(values) // Execute signup mutation

      if (!success) {
        toast({ variant: 'destructive', description: message }) // Show error toast
        throw new Error(message)
      }

      form.reset() // Reset the form on success
      toast({ description: message }) // Show success toast
    } catch (error: any) {
      console.error('Error signing up: ', error.message) // Log error details
      toast({ variant: 'destructive', description: error.message }) // Show error toast
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-[420px] flex flex-col items-center justify-center">
        {/* App Logo */}
        <Logo className="h-20" />
        <h2 className="text-2xl md:text-3xl font-bold py-20 text-light-primary">
          Create a new account
        </h2>

        {/* Signup form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {/* Name input */}
          <CustomFormField
            control={form.control}
            name="name"
            label="Name"
            type="text"
            placeholder="Enter your name"
          />
          {/* Username input */}
          <CustomFormField
            control={form.control}
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
          />
          {/* Email input */}
          <CustomFormField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />
          {/* Password input */}
          <CustomFormField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          {/* Submit button */}
          <FormSubmitButton
            isLoading={isLoading}
            loadingText="Signing up..."
            text="Sign up"
            className="mt-4 text-base h-10"
          />

          {/* Login link */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-light-secondary">
              Already have an account?
            </span>
            <Link
              to="/sign-in"
              className="text-accent-coral cursor-pointer hover:underline hover:text-accent-coral"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
