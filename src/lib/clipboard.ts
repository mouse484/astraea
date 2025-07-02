import { toast } from 'sonner'

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard', {
      description: text,
    })
  } catch (error) {
    console.error('Clipboard error:', error)
    toast.error('Failed to copy', {
      description: text,
    })
  }
}
