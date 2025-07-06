import { EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn-ui/components/ui/dialog'
import { Input } from '@/shadcn-ui/components/ui/input'
import { Label } from '@/shadcn-ui/components/ui/label'
import { cn } from '@/shadcn-ui/utils'

interface Props {
  value: false | true | string
  onChange: (value: false | true | string) => void
}

export default function ContentWarningForm({
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  const currentReason = typeof value === 'string' ? value : ''

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (newOpen) {
          setReason(currentReason)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className={cn(
            value !== false && 'bg-accent! text-accent-foreground!',
          )}
          variant="outline"
          onClick={() => {
            const newValue = value === false ? (currentReason || true) : false
            onChange(newValue)
          }}
        >
          <EyeOff />
          Content Warning
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Mark this content as warning?
          </DialogTitle>
          <DialogDescription>
            <a
              href="https://github.com/nostr-protocol/nips/blob/master/36.md"
              rel="noopener noreferrer"
              target="_blank"
            >
              NIP-36
            </a>
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="content-warning-reason">Reason (optional)</Label>
          <Input
            id="content-warning-reason"
            placeholder="sensitive, violence..."
            value={reason}
            onChange={event => setReason(event.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setReason(currentReason)
                setOpen(false)
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => {
              onChange(reason.length > 0 ? reason : true)
              setOpen(false)
            }}
          >
            Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
