import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { envConfig } from '@/lib/envConfig'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { fetchRecentPosts } from '@/actions/posts.actions'

// Extend Day.js with additional plugins for time formatting
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(isSameOrBefore)

// Utility function to merge Tailwind CSS classes genrated by Shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a placeholder avatar with the user's initials
export const generateAvatar = async (name: string): Promise<Blob> => {
  const canvas = document.createElement('canvas') // Create a canvas element
  const ctx = canvas.getContext('2d') // Get the canvas context

  if (!ctx) throw new Error('Failed to create canvas context')

  const size = 256 // Avatar size
  canvas.width = size
  canvas.height = size

  // Background and text settings
  const bgColor = '#FF7F50'
  const textColor = '#0C0C0C'

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size) // Fill the background color

  const letter = name.charAt(0).toUpperCase() // Extract the first letter
  ctx.fillStyle = textColor
  ctx.font = 'bold 120px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(letter, size / 2, size / 2) // Draw the initial

  // Convert the canvas to a Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to create blob from canvas')
      resolve(blob)
    })
  })
}

// Get the local storage key used by Supabase for authentication tokens
export const getLocalStorageKey = () => {
  const projectId = envConfig.supabase.supabaseProjectId
  return `sb-${projectId}-auth-token`
}

// Format timestamps to show relative time or full date
export const getRelativeTime = (timestamp: string) => {
  const now = dayjs() // Current time
  const createdDate = dayjs.utc(timestamp).local() // Convert timestamp to local time

  if (createdDate.isBefore(now.subtract(4, 'weeks'))) {
    return createdDate.format('D MMM YYYY') // Show full date if older than 4 weeks
  }

  return createdDate.fromNow() // Show relative time for recent dates
}

// Truncate text to a specified maximum length
export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}
