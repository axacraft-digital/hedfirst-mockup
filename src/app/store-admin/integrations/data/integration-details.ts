export type ValidationStatus =
  | "connected"
  | "not_connected"
  | "not_tested"
  | "issue"

export interface WebhookScenario {
  key: string
  name: string
  description: string
  enabled: boolean
  webhookUrl: string
}

export interface IntegrationCredential {
  key: string
  label: string
  configured: boolean
  lastUpdated?: string
  lastUpdatedBy?: string
}

export interface IntegrationConfig {
  key: string
  label: string
  type: "text" | "select" | "checkbox" | "textarea"
  value: string | boolean
  options?: { label: string; value: string }[]
  description?: string
  error?: string
}

// AI-specific interfaces
export interface AIUsageStats {
  requestsToday: number
  requestsThisMonth: number
  costToday: number // in cents
  costThisMonth: number // in cents
  avgLatency: number // in ms
  successRate: number // percentage
}

export interface AICostDataPoint {
  date: string
  cost: number // in cents
  requests: number
}

export interface AIRequest {
  id: string
  timestamp: string
  model: string
  useCase: string
  tokens: number
  cost: number // in cents
  latency: number // in ms
  status: "success" | "error"
}

export interface AICostControl {
  dailyLimit: number // in cents
  monthlyLimit: number // in cents
  alertThreshold: number // percentage
  alertEmail: string
}

export interface AISafety {
  hipaaCompliant: boolean
  baaStatus: "signed" | "pending" | "not_required"
  costControls: AICostControl
  clinicalUseCases: string[]
}

export interface AIMonitoring {
  stats: AIUsageStats
  costData: AICostDataPoint[]
  recentRequests: AIRequest[]
}

export interface IntegrationDetail {
  id: string
  name: string
  slug: string
  description: string
  enabled: boolean
  config: IntegrationConfig[]
  credentials: IntegrationCredential[]
  webhookScenarios?: WebhookScenario[]
  validation: {
    status: ValidationStatus
    message?: string
    validatedAt?: string
  }
  updatedAt: string
  updatedBy: string
  // AI-specific fields (optional)
  aiSafety?: AISafety
  aiMonitoring?: AIMonitoring
}

export const integrationDetails: Record<string, IntegrationDetail> = {
  dosespot: {
    id: "int_001",
    name: "DoseSpot",
    slug: "dosespot",
    description: "E-prescribing and medication management integration.",
    enabled: true,
    config: [
      {
        key: "clinicId",
        label: "Clinic ID",
        type: "text",
        value: "12345",
      },
      {
        key: "clinicName",
        label: "Clinic Name",
        type: "text",
        value: "Acme Health Clinic",
      },
    ],
    credentials: [
      {
        key: "clinicKey",
        label: "Clinic Key",
        configured: true,
        lastUpdated: "2025-12-01T14:30:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
      {
        key: "clinicSecret",
        label: "Clinic Secret",
        configured: true,
        lastUpdated: "2025-12-01T14:30:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "connected",
      message: "Connected to DoseSpot API successfully",
      validatedAt: "2025-12-03T10:45:00Z",
    },
    updatedAt: "2025-12-01T14:30:00Z",
    updatedBy: "admin@acme.com",
  },
  paytheory: {
    id: "int_002",
    name: "PayTheory",
    slug: "paytheory",
    description: "Payment processing for healthcare transactions.",
    enabled: true,
    config: [
      {
        key: "merchantId",
        label: "Merchant ID",
        type: "text",
        value: "mrc_acme_12345",
      },
      {
        key: "webhookUrl",
        label: "Webhook URL",
        type: "text",
        value: "https://api.teligant.com/webhooks/paytheory",
        error: "Webhook URL must use HTTPS and include a valid path",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "API Key",
        configured: true,
        lastUpdated: "2025-11-15T09:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
      {
        key: "apiSecret",
        label: "API Secret",
        configured: true,
        lastUpdated: "2025-11-15T09:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "issue",
      message:
        "Webhook validation failed - please check the webhook URL configuration",
      validatedAt: "2025-12-03T12:30:00Z",
    },
    updatedAt: "2025-11-15T09:00:00Z",
    updatedBy: "admin@acme.com",
  },
  shipstation: {
    id: "int_003",
    name: "ShipStation",
    slug: "shipstation",
    description: "Shipping and fulfillment for pharmacy orders.",
    enabled: false,
    config: [
      {
        key: "storeId",
        label: "Store ID",
        type: "text",
        value: "",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "API Key",
        configured: false,
      },
      {
        key: "apiSecret",
        label: "API Secret",
        configured: false,
      },
    ],
    validation: {
      status: "not_connected",
      message: "Integration has not been configured yet",
    },
    updatedAt: "2025-11-01T08:00:00Z",
    updatedBy: "admin@acme.com",
  },
  zoom: {
    id: "int_004",
    name: "Zoom",
    slug: "zoom",
    description: "Telemedicine video consultations platform.",
    enabled: true,
    config: [
      {
        key: "accountId",
        label: "Account ID",
        type: "text",
        value: "acme_zoom_001",
      },
      {
        key: "autoRecording",
        label: "Auto Recording",
        type: "checkbox",
        value: true,
        description: "Automatically record all consultations",
      },
    ],
    credentials: [
      {
        key: "clientId",
        label: "Client ID",
        configured: true,
        lastUpdated: "2025-11-20T16:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
      {
        key: "clientSecret",
        label: "Client Secret",
        configured: true,
        lastUpdated: "2025-11-20T16:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "not_tested",
      message: "Credentials have not been tested yet",
    },
    updatedAt: "2025-11-20T16:00:00Z",
    updatedBy: "admin@acme.com",
  },
  activecampaign: {
    id: "int_005",
    name: "ActiveCampaign",
    slug: "activecampaign",
    description: "Marketing automation and email campaigns.",
    enabled: true,
    config: [
      {
        key: "accountName",
        label: "Account Name",
        type: "text",
        value: "",
      },
      {
        key: "listId",
        label: "Default List ID",
        type: "text",
        value: "",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "API Key",
        configured: true,
        lastUpdated: "2025-11-28T10:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
      {
        key: "apiUrl",
        label: "API URL",
        configured: true,
        lastUpdated: "2025-11-28T10:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "not_tested",
      message:
        "Credentials configured but Account Name and List ID are required",
    },
    updatedAt: "2025-11-28T10:00:00Z",
    updatedBy: "admin@acme.com",
  },
  choosehealth: {
    id: "int_006",
    name: "ChooseHealth",
    slug: "choosehealth",
    description: "Lab services and diagnostic testing integration.",
    enabled: false,
    config: [
      {
        key: "partnerId",
        label: "Partner ID",
        type: "text",
        value: "acme_partner_001",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "API Key",
        configured: true,
        lastUpdated: "2025-11-25T11:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "connected",
      message: "Connected to ChooseHealth API successfully",
      validatedAt: "2025-12-02T09:00:00Z",
    },
    updatedAt: "2025-11-25T11:00:00Z",
    updatedBy: "admin@acme.com",
  },
  smartystreets: {
    id: "int_007",
    name: "SmartyStreets",
    slug: "smartystreets",
    description: "Address verification and validation service.",
    enabled: false,
    config: [
      {
        key: "licenseType",
        label: "License Type",
        type: "select",
        value: "us-street",
        options: [
          { label: "US Street", value: "us-street" },
          { label: "International", value: "international" },
        ],
      },
    ],
    credentials: [
      {
        key: "authId",
        label: "Auth ID",
        configured: true,
        lastUpdated: "2025-11-05T14:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
      {
        key: "authToken",
        label: "Auth Token",
        configured: true,
        lastUpdated: "2025-11-05T14:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "not_tested",
      message: "Credentials have not been tested yet",
    },
    updatedAt: "2025-11-05T14:00:00Z",
    updatedBy: "admin@acme.com",
  },
  "claude-ai": {
    id: "int_008",
    name: "Claude AI",
    slug: "claude-ai",
    description:
      "AI-powered assistant for clinical documentation and patient support.",
    enabled: true,
    config: [
      {
        key: "apiEndpoint",
        label: "API Endpoint",
        type: "select",
        value: "https://api.anthropic.com",
        options: [
          {
            label: "Production (api.anthropic.com)",
            value: "https://api.anthropic.com",
          },
          { label: "AWS Bedrock", value: "bedrock" },
        ],
      },
      {
        key: "defaultModel",
        label: "Default Model",
        type: "select",
        value: "claude-sonnet-4-5-20250514",
        options: [
          {
            label: "Claude Opus 4.5 (Most Capable)",
            value: "claude-opus-4-5-20250514",
          },
          {
            label: "Claude Sonnet 4.5 (Balanced)",
            value: "claude-sonnet-4-5-20250514",
          },
          {
            label: "Claude 3.5 Sonnet (Fast)",
            value: "claude-3-5-sonnet-20241022",
          },
          {
            label: "Claude 3.5 Haiku (Fastest)",
            value: "claude-3-5-haiku-20241022",
          },
        ],
      },
      {
        key: "maxTokens",
        label: "Max Output Tokens",
        type: "text",
        value: "4096",
        description: "Maximum number of tokens in the response",
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "select",
        value: "0.3",
        options: [
          { label: "0.0 (Deterministic)", value: "0.0" },
          { label: "0.3 (Recommended for clinical)", value: "0.3" },
          { label: "0.5 (Balanced)", value: "0.5" },
          { label: "1.0 (Creative)", value: "1.0" },
        ],
        description: "Lower values produce more consistent, factual responses",
      },
      {
        key: "systemPrompt",
        label: "Default System Prompt",
        type: "textarea",
        value:
          "You are a helpful clinical assistant. Provide accurate, evidence-based information. Always recommend human review for treatment decisions. Use professional, empathetic tone.",
        description: "Default instructions sent with every request",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "Anthropic API Key",
        configured: true,
        lastUpdated: "2025-12-01T10:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "connected",
      message: "Connected to Claude AI API successfully",
      validatedAt: "2025-12-05T14:30:00Z",
    },
    updatedAt: "2025-12-01T10:00:00Z",
    updatedBy: "admin@acme.com",
    aiSafety: {
      hipaaCompliant: true,
      baaStatus: "signed",
      costControls: {
        dailyLimit: 5000, // $50.00
        monthlyLimit: 50000, // $500.00
        alertThreshold: 80,
        alertEmail: "admin@acme.com",
      },
      clinicalUseCases: [
        "clinical_documentation",
        "patient_communication",
        "chart_summarization",
        "treatment_planning",
      ],
    },
    aiMonitoring: {
      stats: {
        requestsToday: 247,
        requestsThisMonth: 3842,
        costToday: 1834, // $18.34
        costThisMonth: 42567, // $425.67
        avgLatency: 1250,
        successRate: 99.2,
      },
      costData: [
        { date: "2025-11-30", cost: 4123, requests: 523 },
        { date: "2025-12-01", cost: 3654, requests: 445 },
        { date: "2025-12-02", cost: 2876, requests: 356 },
        { date: "2025-12-03", cost: 3987, requests: 489 },
        { date: "2025-12-04", cost: 4234, requests: 512 },
        { date: "2025-12-05", cost: 3876, requests: 467 },
        { date: "2025-12-06", cost: 4102, requests: 498 },
        { date: "2025-12-07", cost: 1834, requests: 247 },
      ],
      recentRequests: [
        {
          id: "req_001",
          timestamp: "2025-12-07T14:45:00Z",
          model: "claude-sonnet-4-5-20250514",
          useCase: "clinical_documentation",
          tokens: 2456,
          cost: 24,
          latency: 1123,
          status: "success",
        },
        {
          id: "req_002",
          timestamp: "2025-12-07T14:42:00Z",
          model: "claude-3-5-haiku-20241022",
          useCase: "patient_communication",
          tokens: 1234,
          cost: 12,
          latency: 576,
          status: "success",
        },
        {
          id: "req_003",
          timestamp: "2025-12-07T14:38:00Z",
          model: "claude-3-5-haiku-20241022",
          useCase: "chart_summarization",
          tokens: 3421,
          cost: 8,
          latency: 542,
          status: "success",
        },
        {
          id: "req_004",
          timestamp: "2025-12-07T14:35:00Z",
          model: "claude-sonnet-4-5-20250514",
          useCase: "treatment_planning",
          tokens: 5678,
          cost: 56,
          latency: 1987,
          status: "error",
        },
        {
          id: "req_005",
          timestamp: "2025-12-07T14:30:00Z",
          model: "claude-opus-4-5-20250514",
          useCase: "clinical_documentation",
          tokens: 4532,
          cost: 89,
          latency: 2134,
          status: "success",
        },
      ],
    },
  },
  openai: {
    id: "int_011",
    name: "OpenAI",
    slug: "openai",
    description: "GPT models for general AI tasks and content generation.",
    enabled: false,
    config: [
      {
        key: "apiEndpoint",
        label: "API Endpoint",
        type: "select",
        value: "https://api.openai.com/v1",
        options: [
          {
            label: "Production (api.openai.com)",
            value: "https://api.openai.com/v1",
          },
          { label: "Azure OpenAI", value: "azure" },
        ],
      },
      {
        key: "defaultModel",
        label: "Default Model",
        type: "select",
        value: "gpt-4o",
        options: [
          { label: "GPT-4o (Multimodal)", value: "gpt-4o" },
          { label: "GPT-4o Mini (Fast)", value: "gpt-4o-mini" },
          { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
          { label: "o1 (Reasoning)", value: "o1" },
        ],
      },
      {
        key: "maxTokens",
        label: "Max Output Tokens",
        type: "text",
        value: "4096",
        description: "Maximum number of tokens in the response",
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "select",
        value: "0.3",
        options: [
          { label: "0.0 (Deterministic)", value: "0.0" },
          { label: "0.3 (Recommended for clinical)", value: "0.3" },
          { label: "0.5 (Balanced)", value: "0.5" },
          { label: "1.0 (Creative)", value: "1.0" },
        ],
        description: "Lower values produce more consistent responses",
      },
      {
        key: "systemPrompt",
        label: "Default System Prompt",
        type: "textarea",
        value: "You are a helpful AI assistant for healthcare professionals.",
        description: "Default instructions sent with every request",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "OpenAI API Key",
        configured: false,
      },
    ],
    validation: {
      status: "not_connected",
      message: "Integration has not been configured yet",
    },
    updatedAt: "2025-12-01T08:00:00Z",
    updatedBy: "admin@acme.com",
    aiSafety: {
      hipaaCompliant: false,
      baaStatus: "not_required",
      costControls: {
        dailyLimit: 3000, // $30.00
        monthlyLimit: 30000, // $300.00
        alertThreshold: 80,
        alertEmail: "admin@acme.com",
      },
      clinicalUseCases: [],
    },
  },
  "google-ai": {
    id: "int_012",
    name: "Google AI",
    slug: "google-ai",
    description: "Gemini models for AI-powered insights and analysis.",
    enabled: false,
    config: [
      {
        key: "apiEndpoint",
        label: "API Endpoint",
        type: "select",
        value: "https://generativelanguage.googleapis.com",
        options: [
          {
            label: "Production (Google AI)",
            value: "https://generativelanguage.googleapis.com",
          },
          { label: "Vertex AI", value: "vertex" },
        ],
      },
      {
        key: "defaultModel",
        label: "Default Model",
        type: "select",
        value: "gemini-1.5-pro",
        options: [
          {
            label: "Gemini 2.0 Flash (Experimental)",
            value: "gemini-2.0-flash",
          },
          { label: "Gemini 1.5 Pro (Balanced)", value: "gemini-1.5-pro" },
          { label: "Gemini 1.5 Flash (Fast)", value: "gemini-1.5-flash" },
        ],
      },
      {
        key: "maxTokens",
        label: "Max Output Tokens",
        type: "text",
        value: "8192",
        description: "Maximum number of tokens in the response",
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "select",
        value: "0.3",
        options: [
          { label: "0.0 (Deterministic)", value: "0.0" },
          { label: "0.3 (Recommended for clinical)", value: "0.3" },
          { label: "0.5 (Balanced)", value: "0.5" },
          { label: "1.0 (Creative)", value: "1.0" },
        ],
        description: "Lower values produce more consistent responses",
      },
      {
        key: "systemPrompt",
        label: "Default System Prompt",
        type: "textarea",
        value: "You are a knowledgeable AI assistant in a healthcare setting.",
        description: "Default instructions sent with every request",
      },
    ],
    credentials: [
      {
        key: "apiKey",
        label: "Google AI API Key",
        configured: false,
      },
    ],
    validation: {
      status: "not_connected",
      message: "Integration has not been configured yet",
    },
    updatedAt: "2025-12-01T08:00:00Z",
    updatedBy: "admin@acme.com",
    aiSafety: {
      hipaaCompliant: false,
      baaStatus: "not_required",
      costControls: {
        dailyLimit: 2000, // $20.00
        monthlyLimit: 20000, // $200.00
        alertThreshold: 80,
        alertEmail: "admin@acme.com",
      },
      clinicalUseCases: [],
    },
  },
  slack: {
    id: "int_009",
    name: "Slack",
    slug: "slack",
    description: "Team notifications and alerts via webhooks.",
    enabled: true,
    config: [],
    credentials: [],
    webhookScenarios: [
      {
        key: "payment_failures",
        name: "Payment Failures",
        description: "Alert when a payment transaction fails or is declined",
        enabled: true,
        webhookUrl:
          "https://hooks.slack.com/services/WORKSPACE/CHANNEL/TOKEN_payment",
      },
      {
        key: "new_patient_signups",
        name: "New Patient Signups",
        description: "Alert when a new patient registers on the platform",
        enabled: true,
        webhookUrl:
          "https://hooks.slack.com/services/WORKSPACE/CHANNEL/TOKEN_signup",
      },
      {
        key: "appointment_no_shows",
        name: "Appointment No-Shows",
        description: "Alert when a patient misses a scheduled telehealth visit",
        enabled: false,
        webhookUrl: "",
      },
      {
        key: "prescription_issues",
        name: "Prescription Issues",
        description: "Alert when an e-prescription fails or requires attention",
        enabled: true,
        webhookUrl:
          "https://hooks.slack.com/services/WORKSPACE/CHANNEL/TOKEN_rx",
      },
      {
        key: "shipping_delays",
        name: "Shipping Delays",
        description: "Alert when order fulfillment encounters problems",
        enabled: false,
        webhookUrl: "",
      },
    ],
    validation: {
      status: "connected",
      message: "3 of 5 webhook scenarios configured",
      validatedAt: "2025-12-01T10:00:00Z",
    },
    updatedAt: "2025-12-01T10:00:00Z",
    updatedBy: "admin@acme.com",
  },
  aws: {
    id: "int_010",
    name: "AWS",
    slug: "aws",
    description: "Cloud services for S3, SES, and Pinpoint.",
    enabled: true,
    config: [
      {
        key: "region",
        label: "Region",
        type: "select",
        value: "us-east-1",
        options: [
          { label: "US East (N. Virginia)", value: "us-east-1" },
          { label: "US West (Oregon)", value: "us-west-2" },
          { label: "EU (Ireland)", value: "eu-west-1" },
        ],
      },
      {
        key: "s3Bucket",
        label: "S3 Bucket",
        type: "text",
        value: "acme-health-files",
      },
      {
        key: "sesEnabled",
        label: "SES Email",
        type: "checkbox",
        value: true,
        description: "Enable email sending via SES",
      },
      {
        key: "pinpointEnabled",
        label: "Pinpoint SMS",
        type: "checkbox",
        value: true,
        description: "Enable SMS notifications via Pinpoint",
      },
    ],
    credentials: [
      {
        key: "accessKeyId",
        label: "Access Key ID",
        configured: true,
        lastUpdated: "2025-11-10T12:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
      {
        key: "secretAccessKey",
        label: "Secret Access Key",
        configured: true,
        lastUpdated: "2025-11-10T12:00:00Z",
        lastUpdatedBy: "admin@acme.com",
      },
    ],
    validation: {
      status: "connected",
      message: "Connected to AWS services successfully",
      validatedAt: "2025-12-03T08:00:00Z",
    },
    updatedAt: "2025-11-10T12:00:00Z",
    updatedBy: "admin@acme.com",
  },
}
