import { CheckCircle, XCircle, Loader2, CircleDashed, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { ValidationStatus } from '../data/integration-details'

interface ValidationStatusBannerProps {
  status: ValidationStatus
  message?: string
  validatedAt?: string
  onClose?: () => void
}

const statusConfig = {
  connected: {
    icon: CheckCircle,
    title: 'Connected',
    className:
      'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950',
    iconClassName: 'text-green-600 dark:text-green-400',
  },
  issue: {
    icon: XCircle,
    title: 'Issue',
    className: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
    iconClassName: 'text-red-600 dark:text-red-400',
  },
  not_tested: {
    icon: Loader2,
    title: 'Not Tested',
    className:
      'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950',
    iconClassName: 'text-yellow-600 dark:text-yellow-400',
  },
  not_connected: {
    icon: CircleDashed,
    title: 'Not Connected',
    className:
      'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900',
    iconClassName: 'text-gray-500 dark:text-gray-400',
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function ValidationStatusBanner({
  status,
  message,
  validatedAt,
  onClose,
}: ValidationStatusBannerProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Alert className={`${config.className} relative`}>
      <Icon className={`h-4 w-4 ${config.iconClassName}`} />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>
        <div className='flex flex-col gap-1'>
          {validatedAt && (
            <p className='text-muted-foreground text-sm'>
              Last validated: {formatDate(validatedAt)}
            </p>
          )}
          {message && <p className='text-sm'>{message}</p>}
        </div>
      </AlertDescription>
      {onClose && (
        <Button
          variant='ghost'
          size='sm'
          className='absolute top-2 right-2 h-6 w-6 p-0'
          onClick={onClose}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </Button>
      )}
    </Alert>
  )
}
