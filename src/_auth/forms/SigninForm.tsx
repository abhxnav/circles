import { CustomFormField, FormSubmitButton, Logo } from '@/components'
import { Form } from '@/components/ui'
import { SigninFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof SigninFormSchema>) => {
    // const newUser = await createUserAccount(values)
    console.log('values', values)
  }

  return (
    <Form {...form}>
      <div className="sm:w-[420px] flex flex-col items-center justify-center">
        <Logo className="h-20" />
        <h2 className="text-2xl md:text-3xl font-bold pt-5 sm:pt-12 text-light-primary">
          Log into your account
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <CustomFormField
            control={form.control}
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
          />
          <CustomFormField
            control={form.control}
            name="password"
            label="Password"
            type="password"
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
