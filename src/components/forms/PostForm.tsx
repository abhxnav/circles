import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Form,
} from '@/components/ui'
import { CustomFormField, FormSubmitButton } from '@/components'
import { PostFormSchema } from '@/lib/validations'
import {
  deleteFileFromSupabase,
  uploadFileToSupabase,
} from '@/actions/posts.actions'
import {
  useCreateMentions,
  useCreatePost,
  useDeletePost,
} from '@/react-query/mutations'
import { useToast } from '@/hooks/use-toast'
import { useUserContext } from '@/context/UserContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PostForm = ({ post }: { post: Post | null }) => {
  const { toast } = useToast() // Toast notifications
  const { user } = useUserContext() // Logged-in user's data
  const navigate = useNavigate() // Navigation

  // Mutations for creating posts, mentions, and deleting posts
  const {
    mutateAsync: createPost,
    isPending: postLoading,
    error: postError,
  } = useCreatePost()
  const {
    mutateAsync: createMentions,
    isPending: mentionLoading,
    error: mentionError,
  } = useCreateMentions()
  const { mutateAsync: deletePost } = useDeletePost()

  const [uploadLoading, setUploadLoading] = useState(false) // Upload loading state

  // React Hook Form setup with Zod validation schema
  const form = useForm<z.infer<typeof PostFormSchema>>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      caption: post ? post?.content : '',
      image: post ? post?.image_url : '',
      mentions: post ? post?.mentionedUsers : [],
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof PostFormSchema>) => {
    let uploadedFilePath: string | undefined
    let postId: string | undefined

    try {
      let imageUrl: string | undefined = values.image as string

      // Upload image to Supabase if it's a new file
      if (Array.isArray(values.image) && values.image[0] instanceof File) {
        setUploadLoading(true)

        const {
          data: uploadedUrl,
          success,
          message,
        } = await uploadFileToSupabase(values.image[0])

        if (!success || !uploadedUrl) throw new Error(message)

        imageUrl = uploadedUrl
        uploadedFilePath = values.image[0].name
        setUploadLoading(false)
      }

      // Prepare post input data
      const postInput = {
        content: values.caption,
        image_url: imageUrl,
        author_id: user.id,
      }

      // Create post
      const postData = await createPost({ postInput })
      if (postError) throw new Error(postError.message)

      // Extract post ID
      postId = postData.insertIntopostsCollection.records[0].id

      // Create mentions if users are mentioned
      const mentionedUsersId = values.mentions?.map((user) => user.id)
      if (mentionedUsersId?.length) {
        const mentionsInput = {
          mentioned_users_id: mentionedUsersId,
          post_id: postId,
        }
        await createMentions({ mentions: [mentionsInput] })
        if (mentionError) throw new Error(mentionError.message)
      }

      // Success feedback
      toast({ description: 'Post created successfully' })
      // navigate('/')
    } catch (error) {
      console.error('Error creating post:', error)

      // Rollback uploaded file or post if an error occurs
      if (uploadedFilePath) await deleteFileFromSupabase(uploadedFilePath)
      if (postId) await deletePost(postId)

      // Error feedback
      toast({ description: 'Failed to create post', variant: 'destructive' })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        {/* Caption input field */}
        <CustomFormField
          control={form.control}
          fieldType="textarea"
          name="caption"
          label="Caption"
        />

        {/* Image upload field */}
        <CustomFormField
          control={form.control}
          fieldType="file"
          name="image"
          label="Add image"
          post={post}
        />

        {/* Mention people dialog */}
        <Dialog>
          <DialogTrigger className="flex items-center gap-2 w-fit border-none hover:opacity-70 py-2 px-4 bg-transparent">
            <img
              src="/assets/icons/user-search.svg"
              alt="user"
              width={18}
              height={18}
            />
            <p className="text-light-secondary text-sm">Mention People</p>
          </DialogTrigger>
          <DialogContent className="bg-dark-primary border-dark-muted rounded-md w-[90vw]">
            <DialogTitle className="text-light-secondary text-xl">
              Mention People
            </DialogTitle>
            <DialogDescription>
              Search for people you want to mention in this post
            </DialogDescription>
            <CustomFormField
              control={form.control}
              fieldType="mentions"
              name="mentions"
            />
          </DialogContent>
        </Dialog>

        {/* Form action buttons */}
        <div className="flex gap-2 items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            className="text-light-secondary !border-none !outline-none hover:opacity-70 font-bold"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <FormSubmitButton
            isLoading={postLoading || mentionLoading || uploadLoading}
            loadingText="Posting..."
            text="Post"
            className="text-base h-9"
          />
        </div>
      </form>
    </Form>
  )
}

export default PostForm
