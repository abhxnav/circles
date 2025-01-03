import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Form,
} from '@/components/ui'
import { CustomFormField } from '@/components'
import { PostFormSchema } from '@/lib/validations'
import { uploadFileToSupabase } from '@/actions/posts.actions'

const PostForm = ({ post }: { post: Post | null }) => {
  const form = useForm<z.infer<typeof PostFormSchema>>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      caption: post ? post?.content : '',
      image: post ? post?.image_url : '',
      mentions: post ? post?.mentions : [],
    },
  })

  const onSubmit = async (values: z.infer<typeof PostFormSchema>) => {
    try {
      let imageUrl: string | undefined = values.image as string

      if (Array.isArray(values.image) && values.image[0] instanceof File) {
        const {
          data: uploadedUrl,
          success,
          message,
        } = await uploadFileToSupabase(values.image[0])

        if (!success || !uploadedUrl) throw new Error(message)
        imageUrl = uploadedUrl
      }

      const payload = {
        caption: values.caption,
        image: imageUrl,
        mentions: values.mentions,
      }

      console.log('Final Post Data:', payload)
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <CustomFormField
          control={form.control}
          fieldType="textarea"
          name="caption"
          label="Caption"
        />
        <CustomFormField
          control={form.control}
          fieldType="file"
          name="image"
          label="Add image"
          post={post}
        />
        <Dialog>
          <DialogTrigger className="flex items-center gap-2 w-fit border-none hover:opacity-70 py-2 px-4">
            <img
              src="/assets/icons/user-search.svg"
              alt="user"
              width={18}
              height={18}
            />
            <p className="text-light-secondary text-sm">Mention People</p>
          </DialogTrigger>
          <DialogContent className="bg-dark-primary border-dark-muted">
            <CustomFormField
              control={form.control}
              fieldType="mentions"
              name="mentions"
            />
          </DialogContent>
        </Dialog>

        <div className="flex gap-2 items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            className="text-light-secondary !border-none !outline-none hover:opacity-70 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-accent-coral hover:bg-accent-coral/70 text-dark-primary !border-none !outline-none font-bold"
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
