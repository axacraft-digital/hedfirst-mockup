import { Bell, CheckCircle, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { WebhookScenario } from '../data/integration-details'

interface WebhookScenariosProps {
  scenarios: WebhookScenario[]
}

export function WebhookScenarios({ scenarios }: WebhookScenariosProps) {
  return (
    <div className='space-y-4'>
      {scenarios.map((scenario) => (
        <div
          key={scenario.key}
          className='rounded-lg border p-4'
        >
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-start gap-3'>
              <div className='bg-muted mt-0.5 flex h-8 w-8 items-center justify-center rounded-md'>
                <Bell className='h-4 w-4' />
              </div>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-medium'>{scenario.name}</h4>
                  {scenario.webhookUrl ? (
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  ) : (
                    <XCircle className='h-4 w-4 text-gray-400' />
                  )}
                </div>
                <p className='text-muted-foreground text-sm'>
                  {scenario.description}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                id={`${scenario.key}-enabled`}
                defaultChecked={scenario.enabled}
                disabled={!scenario.webhookUrl}
              />
              <Label
                htmlFor={`${scenario.key}-enabled`}
                className='text-muted-foreground text-sm'
              >
                {scenario.enabled ? 'On' : 'Off'}
              </Label>
            </div>
          </div>
          <div className='mt-4'>
            <Label
              htmlFor={`${scenario.key}-url`}
              className='text-muted-foreground text-xs'
            >
              Webhook URL
            </Label>
            <Input
              id={`${scenario.key}-url`}
              type='url'
              defaultValue={scenario.webhookUrl}
              placeholder='https://hooks.slack.com/services/...'
              className='mt-1 font-mono text-sm'
            />
          </div>
        </div>
      ))}
    </div>
  )
}
