import { Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CredentialFieldProps {
  label: string
  configured: boolean
  lastUpdated?: string
  lastUpdatedBy?: string
  placeholder?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function CredentialField({
  label,
  configured,
  lastUpdated,
  placeholder = 'Enter new value to update',
}: CredentialFieldProps) {
  return (
    <div className='grid gap-2'>
      <Label>{label}</Label>
      <Input
        type='password'
        placeholder={configured ? '••••••••••••••••••••••' : placeholder}
      />
      <div className='flex items-center gap-2 text-sm'>
        {configured ? (
          <>
            <Check className='h-3 w-3 text-green-600' />
            <span className='text-muted-foreground'>
              Configured
              {lastUpdated && ` • Last updated ${formatDate(lastUpdated)}`}
            </span>
          </>
        ) : (
          <>
            <X className='h-3 w-3 text-gray-400' />
            <span className='text-muted-foreground'>Not configured</span>
          </>
        )}
      </div>
    </div>
  )
}
