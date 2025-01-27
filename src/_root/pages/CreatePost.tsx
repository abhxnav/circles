import { Header, PostForm } from '@/components'
import { useState } from 'react'

const CreatePost = () => {
  const [post, setPost] = useState<Post | null>(null) // Placeholder state for Post in case of editing a post

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col items-center w-full gap-6 md:gap-9">
        {/* Header */}
        <Header title="Create Post" iconUrl="/assets/icons/create.svg" />

        {/* Post Form */}
        <PostForm post={post} />
      </div>
    </div>
  )
}

export default CreatePost
