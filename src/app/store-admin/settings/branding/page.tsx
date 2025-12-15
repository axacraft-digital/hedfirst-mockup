"use client"

import { useState, type CSSProperties } from "react"
import chroma from "chroma-js"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentSection } from "../components/content-section"

// Tailwind-like palette generation using chroma-js
// Uses LCH color space for perceptually uniform gradients
function generatePalette(baseHex: string): Record<string, string> {
  // Target lightness values for each shade (mimics Tailwind's palette structure)
  const targetLightness: Record<string, number> = {
    "50": 97,
    "100": 94,
    "200": 86,
    "300": 77,
    "400": 66,
    "500": 55,
    "600": 45,
    "700": 37,
    "800": 29,
    "900": 21,
  }

  // Get the hue and chroma from the base color
  const base = chroma(baseHex)
  const [, baseChroma, baseHue] = base.lch()

  const palette: Record<string, string> = {}

  for (const [shade, lightness] of Object.entries(targetLightness)) {
    // Adjust chroma slightly for lighter/darker shades to maintain vibrancy
    // Lighter shades need less chroma, darker shades can have slightly more
    const shadeNum = parseInt(shade)
    let adjustedChroma = baseChroma

    if (shadeNum <= 100) {
      // Very light shades - reduce chroma significantly
      adjustedChroma = baseChroma * 0.3
    } else if (shadeNum <= 300) {
      // Light shades - reduce chroma moderately
      adjustedChroma = baseChroma * (0.4 + (shadeNum - 100) * 0.002)
    } else if (shadeNum >= 800) {
      // Dark shades - maintain or slightly reduce chroma
      adjustedChroma = baseChroma * 0.85
    }

    // Create color with target lightness, adjusted chroma, and original hue
    const color = chroma.lch(lightness, adjustedChroma, baseHue)
    palette[shade] = color.hex().toUpperCase()
  }

  return palette
}

const mockBrandingConfig = {
  identity: {
    name: "Hedfirst",
  },
  colors: {
    base: "#1A56DB",
  },
  logos: {
    primary: "/tenants/hedfirst/logo.svg",
    white: "/tenants/hedfirst/logo-white.svg",
    favicon: "/tenants/hedfirst/favicon.ico",
  },
}

const getReadableForeground = (hex: string) => {
  try {
    return chroma(hex).luminance() > 0.6 ? "#0F172A" : "#FFFFFF"
  } catch {
    return "#FFFFFF"
  }
}

export default function SettingsBrandingPage() {
  const [baseColor, setBaseColor] = useState(mockBrandingConfig.colors.base)
  const palette = generatePalette(baseColor)

  const handleColorChange = (value: string) => {
    // Validate hex format
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setBaseColor(value)
    }
  }

  return (
    <ContentSection
      title="Branding"
      desc="Configure your store's visual identity."
    >
      <div className="space-y-6">
        {/* Store Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Store Identity</CardTitle>
            <CardDescription>Your store's basic information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Store Name</Label>
              <p className="font-medium">{mockBrandingConfig.identity.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Primary Color */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Primary Color</CardTitle>
            <CardDescription>
              Your brand's main accent color. Used for buttons, links, and interactive elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Input */}
            <div className="space-y-2">
              <Label htmlFor="base-color">Base Color</Label>
              <div className="flex gap-2">
                <Input
                  id="base-color"
                  value={baseColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#1A56DB"
                  className="font-mono"
                />
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
                  className="h-9 w-12 cursor-pointer rounded border p-1"
                />
              </div>
            </div>

            {/* Generated Palette */}
            <div className="space-y-3">
              <Label>Generated Palette</Label>
              <div className="space-y-1">
                {Object.entries(palette).map(([shade, hex]) => (
                  <div
                    key={shade}
                    className="flex items-center gap-3 rounded border p-2"
                  >
                    <div
                      className="h-8 w-12 rounded"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-muted-foreground w-10 text-sm">{shade}</span>
                    <span className="font-mono text-sm">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Logos</CardTitle>
            <CardDescription>
              Upload your store logos for different contexts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Logo */}
            <div className="space-y-2">
              <Label>Primary Logo</Label>
              <p className="text-muted-foreground text-sm">Used on light backgrounds. SVG recommended.</p>
              <div className="flex items-center gap-4 rounded border p-4">
                <div className="bg-muted flex h-16 w-32 items-center justify-center rounded">
                  <span className="text-muted-foreground text-xs">Preview</span>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>

            {/* White Logo */}
            <div className="space-y-2">
              <Label>White Logo</Label>
              <p className="text-muted-foreground text-sm">Used on dark backgrounds.</p>
              <div className="flex items-center gap-4 rounded border p-4">
                <div className="flex h-16 w-32 items-center justify-center rounded bg-gray-800">
                  <span className="text-xs text-gray-400">Preview</span>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <Label>Favicon</Label>
              <p className="text-muted-foreground text-sm">Browser tab icon. 16x16 or 32x32 recommended.</p>
              <div className="flex items-center gap-4 rounded border p-4">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded">
                  <span className="text-muted-foreground text-[8px]">ICO</span>
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>
              See how your brand colors appear in the interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-6 rounded-lg border bg-card p-6"
              style={
                {
                  "--primary": palette["600"],
                  "--primary-foreground": getReadableForeground(palette["600"]),
                  "--accent": palette["100"],
                  "--accent-foreground": getReadableForeground(palette["600"]),
                  "--ring": palette["500"],
                  "--secondary": palette["100"],
                  "--secondary-foreground": getReadableForeground(palette["700"]),
                } as CSSProperties
              }
            >
            {/* Buttons */}
            <div className="space-y-2">
              <Label>Buttons</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Primary Button
                </button>
                <button
                  className="rounded border-2 px-4 py-2 text-sm font-medium"
                  style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
                >
                  Outlined Button
                </button>
              </div>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label>Link</Label>
              <p className="text-sm">
                This is a paragraph with a{" "}
                <span
                  className="cursor-pointer underline"
                  style={{ color: "var(--primary)" }}
                >
                  sample link
                </span>{" "}
                styled with your primary color.
              </p>
            </div>

            {/* Tabs */}
            <div className="space-y-2">
              <Label>Tabs</Label>
              <Tabs defaultValue="two" className="w-full">
                <TabsList>
                  <TabsTrigger value="one">Tab One</TabsTrigger>
                  <TabsTrigger value="two">Tab Two</TabsTrigger>
                  <TabsTrigger value="three">Tab Three</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Checkbox & Radio */}
            <div className="space-y-2">
              <Label>Form Controls</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" defaultChecked />
                  <label htmlFor="check1" className="text-sm">Checkbox selected</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check2" />
                  <label htmlFor="check2" className="text-sm">Checkbox unchecked</label>
                </div>
                <RadioGroup defaultValue="option1" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="radio1" />
                    <label htmlFor="radio1" className="text-sm">Radio selected</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="radio2" />
                    <label htmlFor="radio2" className="text-sm">Radio unchecked</label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Switch */}
            <div className="space-y-2">
              <Label>Switch</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="switch1" defaultChecked />
                  <label htmlFor="switch1" className="text-sm">Switch enabled</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="switch2" />
                  <label htmlFor="switch2" className="text-sm">Switch disabled</label>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <Label>Progress</Label>
              <Progress value={60} className="w-full" />
              <p className="text-muted-foreground text-sm">60% complete</p>
            </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </ContentSection>
  )
}
