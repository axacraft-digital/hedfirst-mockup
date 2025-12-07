export interface AIUseCase {
  id: string
  name: string
  description: string
  enabled: boolean
  selectedProvider: string
  availableProviders: { label: string; value: string }[]
  recommendedModel: string
}

export const aiUseCases: AIUseCase[] = [
  {
    id: "clinical_documentation",
    name: "Clinical Documentation",
    description:
      "Generate SOAP notes, progress notes, and clinical summaries from provider consultations.",
    enabled: true,
    selectedProvider: "claude-ai",
    availableProviders: [
      { label: "Claude AI (Anthropic)", value: "claude-ai" },
      { label: "OpenAI", value: "openai" },
      { label: "Google AI", value: "google-ai" },
    ],
    recommendedModel: "Claude Sonnet 4.5",
  },
  {
    id: "patient_communication",
    name: "Patient Communication",
    description:
      "Draft personalized messages, care instructions, and follow-up communications for patients.",
    enabled: true,
    selectedProvider: "claude-ai",
    availableProviders: [
      { label: "Claude AI (Anthropic)", value: "claude-ai" },
      { label: "OpenAI", value: "openai" },
      { label: "Google AI", value: "google-ai" },
    ],
    recommendedModel: "Claude Haiku 3.5",
  },
  {
    id: "chart_summarization",
    name: "Chart Summarization",
    description:
      "Summarize patient medical history, lab results, and treatment plans for provider review.",
    enabled: true,
    selectedProvider: "claude-ai",
    availableProviders: [
      { label: "Claude AI (Anthropic)", value: "claude-ai" },
      { label: "OpenAI", value: "openai" },
      { label: "Google AI", value: "google-ai" },
    ],
    recommendedModel: "Claude Sonnet 4.5",
  },
  {
    id: "treatment_planning",
    name: "Treatment Planning",
    description:
      "Assist providers with treatment options, medication selection, and care pathway recommendations.",
    enabled: true,
    selectedProvider: "claude-ai",
    availableProviders: [
      { label: "Claude AI (Anthropic)", value: "claude-ai" },
      { label: "OpenAI", value: "openai" },
    ],
    recommendedModel: "Claude Opus 4.5",
  },
  {
    id: "medication_guidance",
    name: "Medication Guidance",
    description:
      "Provide drug interaction checks, dosing recommendations, and medication education content.",
    enabled: false,
    selectedProvider: "claude-ai",
    availableProviders: [
      { label: "Claude AI (Anthropic)", value: "claude-ai" },
      { label: "OpenAI", value: "openai" },
    ],
    recommendedModel: "Claude Sonnet 4.5",
  },
  {
    id: "lab_interpretation",
    name: "Lab Result Interpretation",
    description:
      "Analyze lab results, flag abnormal values, and suggest clinical significance for provider review.",
    enabled: false,
    selectedProvider: "openai",
    availableProviders: [
      { label: "Claude AI (Anthropic)", value: "claude-ai" },
      { label: "OpenAI", value: "openai" },
      { label: "Google AI", value: "google-ai" },
    ],
    recommendedModel: "GPT-4o",
  },
]
