import { supabase } from '@/lib/supabase/config'
import { generateAvatar } from '@/lib/utils'
import { SigninFormSchema, SignupFormSchema } from '@/lib/validations'
import { z } from 'zod'

// Signs up a new user after checking for unique username and email
export const signUpUser = async (values: z.infer<typeof SignupFormSchema>) => {
  const { name, username, email, password } = values

  try {
    // Check if the username already exists
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

    // Sign up the user in Supabase Auth
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, username } },
    })

    if (signUpError) throw new Error(signUpError.message)

    return {
      success: true,
      message: `Verification email sent to ${email}. Verify your email to continue.`,
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Signup failed.' }
  }
}

// Adds a new user's profile to the database if not already present
export const addUserToDatabase = async () => {
  try {
    // Retrieve the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    if (sessionError || !session?.user)
      throw new Error('User not authenticated.')

    const user = session.user

    // Check if the user is already in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // If user exists, skip insertion
    if (existingUser) return { success: true, message: 'User already exists.' }
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

    // Insert user details into the 'users' table
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
    return { success: false, message: error.message }
  }
}

// Logs in a user by verifying their credentials
export const login = async (values: z.infer<typeof SigninFormSchema>) => {
  const { username, password } = values

  try {
    // Retrieve the email associated with the username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('username', username)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        throw new Error('Username not found. Please check your credentials.')
      }
      throw new Error(userError.message)
    }

    // Authenticate user with email and password
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    })

    if (loginError)
      throw new Error('Login failed. Please check your credentials.')

    return { success: true, message: `Logged in successfully as ${username}` }
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed.' }
  }
}

// Fetches the currently authenticated user's details
export const getCurrentUser = async () => {
  try {
    // Get user details from Auth
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)

    // Retrieve user details from the database
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single()
    if (fetchError) throw new Error(fetchError.message)

    return { success: true, message: 'User fetched successfully.', currentUser }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Logs out the currently authenticated user
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)

    return { success: true, message: 'Logged out successfully!' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
