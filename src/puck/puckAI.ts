// Puck AI Integration Guide
// Puck AI is currently in beta and requires separate setup via Puck Cloud

export const PUCK_AI_SETUP = `
# Puck AI Setup Guide

Puck AI enables AI-powered content generation within the visual editor. It's currently in beta.

## Prerequisites
1. Sign up at https://cloud.puckeditor.com/sign-up
2. Create a Puck AI project
3. Get your API key and configuration

## Installation
npm install @puckeditor/plugin-ai

## Configuration

import { Puck } from "@puckeditor/core"
import { aiPlugin } from "@puckeditor/plugin-ai"

export function Editor() {
  return (
    <Puck
      config={puckConfig}
      plugins={[
        aiPlugin({
          apiKey: process.env.NEXT_PUBLIC_PUCK_AI_KEY,
          apiUrl: "https://api.cloud.puckeditor.com",
        })
      ]}
    />
  )
}

## AI Constraints

Define what the AI can and cannot generate:

const aiConstraints = {
  components: ["HeadingBlock", "TextBlock", "CTABlock"],
  allowedFields: ["headline", "content"],
  restrictions: {
    maxLength: 500,
    tone: "professional",
    language: "en",
  }
}

## Business Context

Provide context for better AI outputs:

const businessContext = {
  brand: "Sons of Mountains",
  description: "Adventure travel and mountain guiding company",
  voice: "Adventurous, professional, inspiring",
  targetAudience: "Adventure seekers, outdoor enthusiasts",
  values: ["Safety", "Sustainability", "Excellence"],
}

## Headless Generation

Generate pages programmatically:

import { generatePage } from "@puckeditor/plugin-ai"

const page = await generatePage({
  prompt: "Create a hero section for mountain climbing tours",
  config: puckConfig,
  constraints: aiConstraints,
  context: businessContext,
})

## Next Steps
1. Apply for Puck AI beta access
2. Configure API credentials
3. Set up AI constraints and business context
4. Test generation with sample prompts
`

export const AI_PLUGIN_TODO = {
  steps: [
    "1. Sign up for Puck AI beta at cloud.puckeditor.com",
    "2. Install @puckeditor/plugin-ai package",
    "3. Add API key to environment variables (NEXT_PUBLIC_PUCK_AI_KEY)",
    "4. Configure AI constraints and business context",
    "5. Add aiPlugin to Puck plugins array",
    "6. Test AI content generation in editor",
  ],
  estimatedTime: "30-45 minutes",
  requires: "Puck AI beta access",
}
