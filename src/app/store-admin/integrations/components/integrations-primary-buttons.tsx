import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddIntegrationDialog } from './add-integration-dialog'

export function IntegrationsPrimaryButtons() {
  return (
    <div className='flex gap-2'>
      <Button variant='outline' asChild>
        <Link href='/store-admin/integrations/ai-use-cases'>
          <Sparkles className='mr-2 h-4 w-4' />
          AI Use Cases
        </Link>
      </Button>
      <AddIntegrationDialog />
    </div>
  )
}
