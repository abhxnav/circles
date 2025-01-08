import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { envConfig } from '@/lib/envConfig'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(isSameOrBefore)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateAvatar = async (name: string): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Failed to create canvas context')

  const size = 256
  canvas.width = size
  canvas.height = size

  const bgColor = '#FF7F50'
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  const textColor = '#0C0C0C'

  const letter = name.charAt(0).toUpperCase()
  ctx.fillStyle = textColor
  ctx.font = 'bold 120px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(letter, size / 2, size / 2)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to create blob from canvas')
      resolve(blob)
    })
  })
}

// Supabase by default stores the auth token in the local storage with the key 'sb-<project_id>-auth-token'
export const getLocalStorageKey = () => {
  const projectId = envConfig.supabase.supabaseProjectId
  return `sb-${projectId}-auth-token`
}

export const getRelativeTime = (timestamp: string) => {
  const now = dayjs()
  const createdDate = dayjs.utc(timestamp).local()

  if (createdDate.isBefore(now.subtract(4, 'weeks'))) {
    return createdDate.format('D MMM YYYY') // Example: "10 Jan 2025"
  }

  return createdDate.fromNow()
}
