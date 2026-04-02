/**
 * AI Apps Plugin - AI-Powered Generation Capabilities
 *
 * Sets up the AI Apps plugin with text, image, video, and audio generation providers.
 * Configures the dock order to show AI Apps at the top and adds
 * AI-generated content history to asset libraries.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/plugin-ai-apps-web
 * npm install @imgly/plugin-ai-image-generation-web
 * npm install @imgly/plugin-ai-text-generation-web
 * npm install @imgly/plugin-ai-video-generation-web
 * npm install @imgly/plugin-ai-audio-generation-web
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { AiAppsConfig } from './plugins/ai-app/ai-apps';
 * import { createAIProviders } from './plugins/ai-app/ai-providers';
 *
 * const providers = createAIProviders('Design');
 * await cesdk.addPlugin(new AiAppsConfig(providers, 'Design'));
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import AiApps from '@imgly/plugin-ai-apps-web';

import { getSelectedProviders, type AIProviders } from './ai-providers';

/**
 * AI Apps configuration plugin.
 *
 * Provides AI-powered generation capabilities including text, image,
 * video, and audio generation with configurable providers.
 *
 * @public
 */
export class AiAppsConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   */
  name = 'cesdk-ai-apps';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * AI provider configuration.
   */
  private providers: AIProviders;

  /**
   * Editor mode (Design, Video, or Photo).
   */
  private mode: 'Design' | 'Video' | 'Photo';

  /**
   * Create a new AI Apps configuration plugin.
   *
   * @param providers - The AI provider configuration
   * @param mode - The editor mode ('Design' or 'Video')
   */
  constructor(providers: AIProviders, mode: 'Design' | 'Video' | 'Photo') {
    this.providers = providers;
    this.mode = mode;
  }

  /**
   * Initialize the AI Apps configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up dock order, canvas menu, AI providers, and asset library history.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) return;

    // ============================================================================
    // Configure Dock with AI Apps at top
    // ============================================================================

    const currentDockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      'ly.img.ai/apps.dock',
      ...currentDockOrder.filter((item) => item.key !== 'ly.img.templates')
    ]);

    // ============================================================================
    // Configure Canvas Menu with AI Options
    // ============================================================================

    const currentCanvasMenuOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.canvas.menu',
      when: { editMode: 'Transform' }
    });
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.canvas.menu', when: { editMode: 'Transform' } },
      [
        'ly.img.ai.text.canvasMenu',
        'ly.img.ai.image.canvasMenu',
        'ly.img.separator',
        ...currentCanvasMenuOrder
      ]
    );

    // Note: Preview and Placeholder features are disabled in the respective
    // editor config features.ts files, not here in the AI plugin.

    // ============================================================================
    // Add AI Apps Plugin
    // ============================================================================

    const providerConfig = getSelectedProviders(this.providers);
    await cesdk.addPlugin(AiApps({ providers: providerConfig }));

    // ============================================================================
    // Add AI Generation History to Asset Libraries
    // Using function-based sourceIds for cleaner code
    // ============================================================================

    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [
        ...currentIds,
        'ly.img.ai.image-generation.history'
      ]
    });

    // Video mode: add video and audio AI history
    if (this.mode === 'Video') {
      cesdk.ui.updateAssetLibraryEntry('ly.img.video', {
        sourceIds: ({ currentIds }) => [
          ...currentIds,
          'ly.img.ai.video-generation.history'
        ]
      });

      cesdk.ui.updateAssetLibraryEntry('ly.img.audio', {
        sourceIds: ({ currentIds }) => [
          ...currentIds,
          'ly.img.ai.audio-generation.history'
        ]
      });
    }
  }
}
