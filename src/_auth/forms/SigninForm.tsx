import { CustomFormField, FormSubmitButton, Logo } from '@/components'
import { Form } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import { SigninFormSchema } from '@/lib/validations'
import { useLogin } from '@/react-query/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { mutateAsync: login, isPending: isLoading } = useLogin()

  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof SigninFormSchema>) => {
    try {
      const { success, message } = await login(values)

      if (!success) {
        toast({ variant: 'destructive', description: message })
        throw new Error(message)
      }

      navigate('/')
      toast({ description: message })
    } catch (error: any) {
      console.error('Error logging in: ', error)
      toast({ variant: 'destructive', description: error.message })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-[420px] flex flex-col items-center justify-center">
        <Logo className="h-20" />
        <h2 className="text-2xl md:text-3xl font-bold py-20 text-light-primary">
          Log into your account
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <CustomFormField
            control={form.control}
            fieldType="text"
            name="username"
            label="Username"
            placeholder="Enter your username"
          />
          <CustomFormField
            control={form.control}
            fieldType="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          <FormSubmitButton
            isLoading={isLoading}
            loadingText="Loggin in..."
            text="Login"
            className="mt-4 text-base h-10"
          />

          <div className="flex items-center justify-center gap-2">
            <span className="text-light-secondary">New to circles?</span>
            <Link
              to="/sign-up"
              className="text-accent-coral cursor-pointer hover:underline hover:text-accent-coral"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
