import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui'

interface FileUploaderProps {
  fieldChange: (files: File[]) => void // Function to update the parent field's value with the selected file(s)
  mediaUrl?: string // Optional initial media URL to display
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]) // State to store the uploaded file(s)
  const [fileUrl, setFileUrl] = useState('') // State to store the preview URL of the uploaded file

  // Handles file drop and updates state
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles) // Store the selected files
      fieldChange(acceptedFiles) // Pass the files to the parent via `fieldChange`
      setFileUrl(URL.createObjectURL(acceptedFiles[0])) // Generate a preview URL for the first file
    },
    [fieldChange] // Recreate the callback if `fieldChange` changes
  )

  // Set up the file drop area with react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // Handle file drop
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.svg'], // Accept only specific image formats
    },
  })

  // Removes the uploaded file and resets the preview URL
  const removeImage = () => {
    setFile([]) // Clear the file state
    setFileUrl('') // Clear the preview URL
  }

  return (
    <>
      {/* Main container for the file uploader */}
      <div
        {...getRootProps()} // Bind event handlers and attributes from react-dropzone
        className="flex flex-col items-center justify-center bg-dark-secondary rounded-xl cursor-pointer"
      >
        {/* Hidden file input */}
        <input {...getInputProps()} className="cursor-pointer" />

        {/* Display the uploaded image preview if available */}
        {fileUrl ? (
          <>
            {/* Preview the uploaded image */}
            <div className="flex flex-1 justify-center w-full p-5 pb-0 lg:p-10">
              <img
                src={fileUrl} // Use the generated preview URL
                alt="image"
                className="h-80 lg:h-[600px] w-full rounded-xl object-cover object-top"
              />
            </div>
            <p className="text-light-muted text-center text-sm w-full p-4">
              Click or drag another image to replace
            </p>
          </>
        ) : (
          // Display instructions and UI for uploading if no image is uploaded
          <div className="flex flex-col items-center justify-center p-7 h-80 lg:h-[600px] gap-4">
            {/* Icon for the upload area */}
            <img
              src="/assets/icons/image-stack.svg"
              alt="file-upload"
              width={80}
              height={80}
            />

            {/* Browse files button */}
            <Button
              type="button"
              className="border-dashed border-accent-coral hover:border-solid hover:border-accent-coral flex items-center justify-center gap-2 rounded-full"
            >
              <img
                src="/assets/icons/upload.svg"
                alt="upload"
                width={18}
                height={18}
              />
              <p className="text-accent-coral/90 font-semibold">Browse files</p>
            </Button>

            {/* Instructions for drag-and-drop */}
            <div className="flex items-center justify-center flex-col">
              <h3 className="font-medium text-light-muted mb-1">
                or drag and drop your image here to upload
              </h3>
              <p className="text-light-muted/50 text-xs">JPG, JPEG, PNG, SVG</p>
            </div>
          </div>
        )}
      </div>

      {/* Option to remove the uploaded image */}
      {fileUrl && (
        <p
          className="text-accent-coral/90 hover:underline cursor-pointer text-sm py-2"
          onClick={removeImage} // Handle image removal
        >
          Remove image
        </p>
      )}
    </>
  )
}

export default FileUploader
