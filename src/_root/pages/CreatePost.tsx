import { Header, PostForm } from '@/components'
import { useState } from 'react'

const CreatePost = () => {
  const [post, setPost] = useState<Post | null>(null)

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 scrollbar-styled">
        <Header title="Create Post" iconUrl="/assets/icons/create.svg" />
        <section>
          <PostForm post={post} />
        </section>
      </div>
    </div>
  )
}

export default CreatePost
