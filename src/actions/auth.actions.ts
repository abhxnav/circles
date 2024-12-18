import { supabase } from '@/lib/supabase/config'
import { generateAvatar } from '@/lib/utils'
import { SigninFormSchema, SignupFormSchema } from '@/lib/validations'
import { z } from 'zod'

export const signUpUser = async (values: z.infer<typeof SignupFormSchema>) => {
  const { name, username, email, password } = values // destructure individual values from values object

  try {
    // Check if the username is available
    const { data: existingUsername, error: usernameError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle()

    if (existingUsername)
      throw new Error('Username is already taken. Try another one.')
    if (usernameError && usernameError.code !== 'PGRST116')
      throw new Error(usernameError.message)

    // Check if the email is already registered
    const { data: existingEmail, error: emailError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (existingEmail) {
      throw new Error('Email is already registered. Try logging in instead.')
    }
    if (emailError && emailError.code !== 'PGRST116') {
      throw new Error(emailError.message)
    }

    // Sign up user in Supabase Auth
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, username },
      },
    })

    if (signUpError) {
      throw new Error(signUpError.message)
    }

    return {
      success: true,
      message: `We have sent a verification email to ${email}. Verify your email to continue...`,
    }
  } catch (error: any) {
    console.error('Error signing up: ', error)
    return {
      success: false,
      message: error.message || 'An error occurred during signup.',
    }
  }
}

export const addUserToDatabase = async () => {
  try {
    // Get authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    if (sessionError || !session?.user)
      throw new Error('User is not authenticated')

    const user = session.user

    // Check if user already exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // If user exists, skip insertion
    if (existingUser) return { success: true, message: 'User already exists' }
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message)
    }

    // Retrieve name and username from metadata
    const name = user.user_metadata?.name || ''
    const username = user.user_metadata?.username || ''
    if (!name || !username) {
      throw new Error('Missing name or username in user metadata.')
    }

    // Generate avatar
    const avatarBlob = await generateAvatar(name)
    const avatarFileName = `avatars/${user.id}.png`

    // Uploading avatar to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarFileName, avatarBlob, { contentType: 'image/png' })

    const defaultAvatar =
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' // default avatar if upload fails
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(avatarFileName)

    const avatarUrl = uploadError ? defaultAvatar : publicUrl

    // Insert user into 'users' table
    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      name,
      username,
      email: user.email,
      avatar_url: avatarUrl,
    })
    if (insertError) throw new Error(insertError.message)

    return { success: true, message: 'User profile created successfully.' }
  } catch (error: any) {
    console.error('Error adding user to database: ', error)
    return { success: false, message: error.message }
  }
}

export const login = async (values: z.infer<typeof SigninFormSchema>) => {
  const { username, password } = values

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('username', username)
      .single()

    if (userError) {
      throw new Error('Username not found')
    }

    const email = user.email

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      throw new Error('Invalid password')
    }

    return { success: true, message: 'Logged in successfully!' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)

    return { success: true, message: 'Logged out successfully!' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
