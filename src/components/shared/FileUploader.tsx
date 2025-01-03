import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui'

interface FileUploaderProps {
  fieldChange: (files: File[]) => void
  mediaUrl?: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState('')

  const onDrop = useCallback(
    (aceptedFiles: FileWithPath[]) => {
      setFile(aceptedFiles)
      fieldChange(aceptedFiles)
      setFileUrl(URL.createObjectURL(aceptedFiles[0]))
    },
    [file]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.svg'],
    },
  })

  const removeImage = () => {
    setFile([])
    setFileUrl('')
  }

  return (
    <>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center bg-dark-secondary rounded-xl cursor-pointer"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        {fileUrl ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 pb-0 lg:p-10">
              <img
                src={fileUrl}
                alt="image"
                className="h-80 lg:h-[600px] w-full rounded-xl object-cover object-top"
              />
            </div>
            <p className="text-light-muted text-center text-sm w-full p-4">
              Click or drag another image to replace
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-7 h-80 lg:h-[600px] gap-4">
            <img
              src="/assets/icons/image-stack.svg"
              alt="file-upload"
              width={80}
              height={80}
            />

            <Button className="border-dashed border-accent-coral hover:border-solid hover:border-accent-coral flex items-center justify-center gap-2 rounded-full">
              <img
                src="/assets/icons/upload.svg"
                alt="upload"
                width={18}
                height={18}
              />
              <p className="text-accent-coral/90 font-semibold">Browse files</p>
            </Button>

            <div className="flex items-center justify-center flex-col">
              <h3 className="font-medium text-light-muted mb-1">
                or drag and drop your image here to upload
              </h3>
              <p className="text-light-muted/50 text-xs">JPG, JPEG, PNG, SVG</p>
            </div>
          </div>
        )}
      </div>
      {fileUrl && (
        <p
          className="text-accent-coral/90 hover:underline cursor-pointer text-sm py-2"
          onClick={removeImage}
        >
          Remove image
        </p>
      )}
    </>
  )
}

export default FileUploader
