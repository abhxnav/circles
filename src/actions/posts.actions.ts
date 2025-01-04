import { supabase } from '@/lib/supabase/config'

export const uploadFileToSupabase = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`

  try {
    const { error } = await supabase.storage
      .from('posts')
      .upload(fileName, file)

    if (error) throw new Error(error.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('posts').getPublicUrl(fileName)

    return {
      success: true,
      message: 'File uploaded successfully',
      data: publicUrl,
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export const deleteFileFromSupabase = async (filePath: string) => {
  try {
    const { error } = await supabase.storage.from('posts').remove([filePath])
    if (error) throw error
    return { success: true, message: 'File deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return { success: false, message: error.message }
  }
}
