/**
 * AI Provider Plugin - Configure AI Generation Providers
 *
 * This file configures AI providers for text, image, video, and audio generation.
 * The starterkit uses public IMG.LY proxy servers for demonstration.
 *
 * For production, you should set up your own proxy servers to:
 * 1. Hold API keys securely on the server side
 * 2. Control rate limiting and access
 * 3. Monitor usage
 *
 * ## Environment Variables (Optional)
 *
 * ```env
 * VITE_FAL_AI_PROXY_URL=https://your-server.com/api/proxy/falai
 * VITE_ANTHROPIC_PROXY_URL=https://your-server.com/api/proxy/anthropic
 * VITE_OPENAI_PROXY_URL=https://your-server.com/api/proxy/openai
 * VITE_ELEVENLABS_PROXY_URL=https://your-server.com/api/proxy/elevenlabs
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 */

import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import OpenAIText from '@imgly/plugin-ai-text-generation-web/open-ai';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';

// ============================================================================
// Proxy URL Configuration
// ============================================================================
/**
 * Proxy URLs for AI providers.
 *
 * [DEMO] These are public IMG.LY proxy URLs for demonstration only.
 * For production, set up your own proxies and configure via environment variables.
 */
const FAL_AI_PROXY_URL =
  import.meta.env.VITE_FAL_AI_PROXY_URL ||
  'https://proxy.img.ly/api/proxy/falai';
const ANTHROPIC_PROXY_URL =
  import.meta.env.VITE_ANTHROPIC_PROXY_URL ||
  'https://imgly-proxy.vercel.app/api/proxy/anthropic';
const OPEN_AI_PROXY_URL =
  import.meta.env.VITE_OPENAI_PROXY_URL ||
  'https://proxy.img.ly/api/proxy/openai';
const ELEVENLABS_PROXY_URL =
  import.meta.env.VITE_ELEVENLABS_PROXY_URL ||
  'https://proxy.img.ly/api/proxy/elevenlabs';

// ============================================================================
// Provider Types
// ============================================================================

export interface AIProviderConfig {
  name: string;
  label: string;
  selected: boolean;
  provider: () => any;
}

export interface AIProviderCategory {
  name: string;
  /** Which editor modes this category is available in */
  supportedModes: ('Design' | 'Video' | 'Photo')[];
  providers: AIProviderConfig[];
}

export interface AIProviders {
  text2text?: AIProviderCategory;
  text2image?: AIProviderCategory;
  image2image?: AIProviderCategory;
  text2video?: AIProviderCategory;
  image2video?: AIProviderCategory;
  text2speech?: AIProviderCategory;
  text2sound?: AIProviderCategory;
}

// ============================================================================
// All Provider Definitions
// ============================================================================

/**
 * All available AI providers across all modes.
 */
const ALL_PROVIDERS: AIProviders = {
  // ============================================================================
  // Text to Text Providers (Design, Video, Photo)
  // ============================================================================
  text2text: {
    name: 'Text to Text',
    supportedModes: ['Design', 'Video', 'Photo'],
    providers: [
      {
        name: 'Claude Sonnet 4.5',
        label: 'Anthropic',
        selected: true,
        provider: () =>
          Anthropic.AnthropicProvider({
            proxyUrl: ANTHROPIC_PROXY_URL,
            model: 'claude-sonnet-4-5-20250929'
          })
      },
      {
        name: 'GPT-4.1 Nano',
        label: 'OpenAI',
        selected: true,
        provider: () =>
          OpenAIText.OpenAIProvider({
            proxyUrl: OPEN_AI_PROXY_URL,
            model: 'gpt-4.1-nano-2025-04-14'
          })
      }
    ]
  },

  // ============================================================================
  // Text to Image Providers (Design, Video, Photo)
  // ============================================================================
  text2image: {
    name: 'Text to Image',
    supportedModes: ['Design', 'Video', 'Photo'],
    providers: [
      {
        name: 'Recraft V3',
        label: 'Recraft',
        selected: true,
        provider: () => FalAiImage.RecraftV3({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Recraft 20B',
        label: 'Recraft',
        selected: false,
        provider: () => FalAiImage.Recraft20b({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Seedream V4',
        label: 'ByteDance',
        selected: true,
        provider: () => FalAiImage.SeedreamV4({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'NanoBanana Pro',
        label: 'Google',
        selected: true,
        provider: () => FalAiImage.NanoBananaPro({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'GPT Image 1',
        label: 'OpenAI',
        selected: true,
        provider: () =>
          OpenAiImage.GptImage1.Text2Image({ proxyUrl: OPEN_AI_PROXY_URL })
      },
      {
        name: 'Ideogram V3',
        label: 'Ideogram',
        selected: true,
        provider: () => FalAiImage.IdeogramV3({ proxyUrl: FAL_AI_PROXY_URL })
      }
    ]
  },

  // ============================================================================
  // Image to Image Providers (Design, Video, Photo)
  // ============================================================================
  image2image: {
    name: 'Image to Image',
    supportedModes: ['Design', 'Video', 'Photo'],
    providers: [
      {
        name: 'Gemini Flash Edit',
        label: 'Google',
        selected: true,
        provider: () =>
          FalAiImage.GeminiFlashEdit({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Seedream V4 Edit',
        label: 'ByteDance',
        selected: true,
        provider: () =>
          FalAiImage.SeedreamV4Edit({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'NanoBanana Pro Edit',
        label: 'Google',
        selected: true,
        provider: () =>
          FalAiImage.NanoBananaProEdit({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'GPT Image 1',
        label: 'OpenAI',
        selected: true,
        provider: () =>
          OpenAiImage.GptImage1.Image2Image({ proxyUrl: OPEN_AI_PROXY_URL })
      },
      {
        name: 'Flux Pro Kontext',
        label: 'Black Forest',
        selected: true,
        provider: () =>
          FalAiImage.FluxProKontextEdit({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Flux Pro Kontext Max',
        label: 'Black Forest',
        selected: true,
        provider: () =>
          FalAiImage.FluxProKontextMaxEdit({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Ideogram V3 Remix',
        label: 'Ideogram',
        selected: false,
        provider: () =>
          FalAiImage.IdeogramV3Remix({ proxyUrl: FAL_AI_PROXY_URL })
      }
    ]
  },

  // ============================================================================
  // Text to Video Providers (Video only)
  // ============================================================================
  text2video: {
    name: 'Text to Video',
    supportedModes: ['Video'],
    providers: [
      {
        name: 'Seedance V1 Pro',
        label: 'ByteDance',
        selected: true,
        provider: () =>
          FalAiVideo.ByteDanceSeedanceV1ProTextToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      },
      {
        name: 'Minimax Video-01 Live',
        label: 'Minimax',
        selected: true,
        provider: () =>
          FalAiVideo.MinimaxVideo01Live({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Pixverse V3.5',
        label: 'Pixverse',
        selected: false,
        provider: () =>
          FalAiVideo.PixverseV35TextToVideo({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Kling Video V2.1 Master',
        label: 'Kuaishou',
        selected: true,
        provider: () =>
          FalAiVideo.KlingVideoV21MasterTextToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      },
      {
        name: 'Veo 3',
        label: 'Google',
        selected: true,
        provider: () =>
          FalAiVideo.Veo3TextToVideo({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Veo 3.1',
        label: 'Google',
        selected: false,
        provider: () =>
          FalAiVideo.Veo31FastTextToVideo({ proxyUrl: FAL_AI_PROXY_URL })
      }
    ]
  },

  // ============================================================================
  // Image to Video Providers (Video only)
  // ============================================================================
  image2video: {
    name: 'Image to Video',
    supportedModes: ['Video'],
    providers: [
      {
        name: 'Seedance V1 Pro',
        label: 'ByteDance',
        selected: true,
        provider: () =>
          FalAiVideo.ByteDanceSeedanceV1ProImageToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      },
      {
        name: 'Minimax Video-01 Live',
        label: 'Minimax',
        selected: true,
        provider: () =>
          FalAiVideo.MinimaxVideo01LiveImageToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      },
      {
        name: 'Kling Video V2.1 Master',
        label: 'Kuaishou',
        selected: true,
        provider: () =>
          FalAiVideo.KlingVideoV21MasterImageToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      },
      {
        name: 'Hailuo 02 Standard',
        label: 'MiniMax',
        selected: true,
        provider: () =>
          FalAiVideo.MinimaxHailuo02StandardImageToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      },
      {
        name: 'Veo 3.1',
        label: 'Google',
        selected: false,
        provider: () =>
          FalAiVideo.Veo31FastImageToVideo({ proxyUrl: FAL_AI_PROXY_URL })
      },
      {
        name: 'Veo 3.1 First/Last Frame',
        label: 'Google',
        selected: false,
        provider: () =>
          FalAiVideo.Veo31FastFirstLastFrameToVideo({
            proxyUrl: FAL_AI_PROXY_URL
          })
      }
    ]
  },

  // ============================================================================
  // Text to Speech Providers (Video only)
  // ============================================================================
  text2speech: {
    name: 'Text to Speech',
    supportedModes: ['Video'],
    providers: [
      {
        name: 'Multilingual V2',
        label: 'ElevenLabs',
        selected: true,
        provider: () =>
          Elevenlabs.ElevenMultilingualV2({ proxyUrl: ELEVENLABS_PROXY_URL })
      }
    ]
  },

  // ============================================================================
  // Text to Sound Providers (Video only)
  // ============================================================================
  text2sound: {
    name: 'Text to Sound',
    supportedModes: ['Video'],
    providers: [
      {
        name: 'Sound Effects',
        label: 'ElevenLabs',
        selected: true,
        provider: () =>
          Elevenlabs.ElevenSoundEffects({ proxyUrl: ELEVENLABS_PROXY_URL })
      }
    ]
  }
};

// ============================================================================
// Provider Factory Functions
// ============================================================================

/**
 * Create AI providers filtered by editor mode.
 *
 * Returns providers for the specified mode. Each provider has a `selected`
 * property that controls whether it's enabled.
 *
 * @param mode - The editor mode to filter providers for (defaults to 'Design')
 * @returns Object containing provider configurations by category
 *
 * @example
 * ```typescript
 * const providers = createAIProviders('Video');
 * // Returns text2text, text2image, image2image, text2video, image2video, text2speech, text2sound
 * ```
 */
export function createAIProviders(
  mode: 'Design' | 'Video' | 'Photo' = 'Design'
): AIProviders {
  const filteredProviders: AIProviders = {};

  for (const [key, category] of Object.entries(ALL_PROVIDERS)) {
    if (category && category.supportedModes.includes(mode)) {
      // Deep clone the category to avoid mutating the original
      filteredProviders[key as keyof AIProviders] = {
        name: category.name,
        supportedModes: [...category.supportedModes],
        providers: category.providers.map((providerConfig) => ({
          name: providerConfig.name,
          label: providerConfig.label,
          selected: providerConfig.selected,
          provider: providerConfig.provider
        }))
      };
    }
  }

  return filteredProviders;
}

/**
 * Get selected providers from a provider configuration.
 * Only returns providers where `selected: true`.
 *
 * @param providers - The full provider configuration
 * @returns Provider config with only selected providers instantiated
 *
 * @example
 * ```typescript
 * const providers = createAIProviders('Design');
 * const selectedProviders = getSelectedProviders(providers);
 * // Pass to AiApps plugin
 * await cesdk.addPlugin(AiApps({ providers: selectedProviders }));
 * ```
 */
export function getSelectedProviders(
  providers: AIProviders
): Record<string, any[]> {
  const result: Record<string, any[]> = {};

  for (const [key, category] of Object.entries(providers)) {
    if (category && category.providers) {
      const selectedProviders = category.providers
        .filter((providerConfig) => providerConfig.selected)
        .map((providerConfig) => providerConfig.provider());

      if (selectedProviders.length > 0) {
        result[key] = selectedProviders;
      }
    }
  }

  return result;
}
