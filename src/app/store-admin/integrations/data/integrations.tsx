import { Plug2 } from 'lucide-react'
import type { ValidationStatus } from './integration-details'

export const integrations: {
  name: string
  slug: string
  logo: React.ReactNode
  enabled: boolean
  status: ValidationStatus
  desc: string
}[] = [
  {
    name: 'DoseSpot',
    slug: 'dosespot',
    logo: <Plug2 />,
    enabled: true,
    status: 'connected',
    desc: 'E-prescribing and medication management integration.',
  },
  {
    name: 'PayTheory',
    slug: 'paytheory',
    logo: <Plug2 />,
    enabled: true,
    status: 'issue',
    desc: 'Payment processing for healthcare transactions.',
  },
  {
    name: 'ShipStation',
    slug: 'shipstation',
    logo: <Plug2 />,
    enabled: false,
    status: 'not_connected',
    desc: 'Shipping and fulfillment for pharmacy orders.',
  },
  {
    name: 'Zoom',
    slug: 'zoom',
    logo: <Plug2 />,
    enabled: true,
    status: 'not_tested',
    desc: 'Telemedicine video consultations platform.',
  },
  {
    name: 'ActiveCampaign',
    slug: 'activecampaign',
    logo: <Plug2 />,
    enabled: true,
    status: 'not_tested',
    desc: 'Marketing automation and email campaigns.',
  },
  {
    name: 'ChooseHealth',
    slug: 'choosehealth',
    logo: <Plug2 />,
    enabled: false,
    status: 'connected',
    desc: 'Lab services and diagnostic testing integration.',
  },
  {
    name: 'SmartyStreets',
    slug: 'smartystreets',
    logo: <Plug2 />,
    enabled: false,
    status: 'not_tested',
    desc: 'Address verification and validation service.',
  },
  {
    name: 'Claude AI',
    slug: 'claude-ai',
    logo: <Plug2 />,
    enabled: true,
    status: 'connected',
    desc: 'AI-powered assistant for clinical documentation and patient support.',
  },
  {
    name: 'OpenAI',
    slug: 'openai',
    logo: <Plug2 />,
    enabled: false,
    status: 'not_connected',
    desc: 'GPT models for general AI tasks and content generation.',
  },
  {
    name: 'Google AI',
    slug: 'google-ai',
    logo: <Plug2 />,
    enabled: false,
    status: 'not_connected',
    desc: 'Gemini models for AI-powered insights and analysis.',
  },
  {
    name: 'Slack',
    slug: 'slack',
    logo: <Plug2 />,
    enabled: true,
    status: 'connected',
    desc: 'Team notifications and alerts via webhooks.',
  },
  {
    name: 'AWS',
    slug: 'aws',
    logo: <Plug2 />,
    enabled: true,
    status: 'connected',
    desc: 'Cloud services for S3, SES, and Pinpoint.',
  },
]
