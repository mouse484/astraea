import { EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn-ui/components/ui/dialog'
import { Input } from '@/shadcn-ui/components/ui/input'
import { Label } from '@/shadcn-ui/components/ui/label'
import { Toggle } from '@/shadcn-ui/components/ui/toggle'

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
      <DialogTrigger>
        <Toggle
          variant="outline"
          pressed={value !== false}
          onPressedChange={(pressed) => {
            onChange(pressed ? (currentReason || true) : false)
          }}
        >
          <EyeOff />
          Content Warning
        </Toggle>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Mark this content as warning?
          </DialogTitle>
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
