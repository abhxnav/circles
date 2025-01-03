import { PostForm } from '@/components'
import { useState } from 'react'

const CreatePost = () => {
  const [post, setPost] = useState<Post | null>(null)

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 scrollbar-styled">
        <div className="max-2-5xl flex items-center justify-start gap-2 md:gap-3 w-full">
          <img
            src="/assets/icons/create.svg"
            alt="Create"
            className="size-6 md:size-9"
          />
          <h2 className="text-xl md:text-3xl font-bold text-left w-full text-light-primary">
            Create Post
          </h2>
        </div>
        <section>
          <PostForm post={post} />
        </section>
      </div>
    </div>
  )
}

export default CreatePost
