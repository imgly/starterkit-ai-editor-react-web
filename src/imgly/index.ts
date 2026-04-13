/**
 * CE.SDK AI Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the AI editor.
 * Supports Design, Photo, and Video editing modes.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 * @see https://img.ly/docs/cesdk/js/plugins/ai-generation/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { AiAppsConfig } from './plugins/ai-app/ai-apps';
import type { AIProviders } from './plugins/ai-app/ai-providers';
import { DesignEditorConfig } from './config/design-editor/plugin';
import { PhotoEditorConfig } from './config/photo-editor/plugin';
import { VideoEditorConfig } from './config/video-editor/plugin';

// ============================================================================
// Plugins
// ============================================================================

// AI Apps Plugin
export { AiAppsConfig } from './plugins/ai-app/ai-apps';

// AI Providers
export {
  createAIProviders,
  getSelectedProviders
} from './plugins/ai-app/ai-providers';

export type {
  AIProviderCategory,
  AIProviderConfig,
  AIProviders
} from './plugins/ai-app/ai-providers';

// Editor Config Plugins
export { DesignEditorConfig } from './config/design-editor/plugin';
export { PhotoEditorConfig } from './config/photo-editor/plugin';
export { VideoEditorConfig } from './config/video-editor/plugin';

// ============================================================================
// Design Editor Initialization
// ============================================================================

/**
 * Initialize the AI Design Editor.
 *
 * Sets up CE.SDK with:
 * - Design editor configuration plugin
 * - Asset source plugins (images, shapes, text, etc.)
 * - AI apps for text and image generation
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param providers - AI provider configuration
 * @param sceneUrl - URL to the design scene archive
 */
export async function initAiDesignEditor(
  cesdk: CreativeEditorSDK,
  providers: AIProviders,
  sceneUrl: string
): Promise<void> {
  // Add design editor config plugin
  await cesdk.addPlugin(new DesignEditorConfig());

  // Add theme
  cesdk.ui.setTheme('light');

  // Add asset sources
  await Promise.all([
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource())
  ]);
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // Load design scene using instance method (handles auto-fit automatically)
  await cesdk.loadFromArchiveURL(sceneUrl);

  // Add AI apps plugin
  await cesdk.addPlugin(new AiAppsConfig(providers, 'Design'));
}

// ============================================================================
// Photo Editor Initialization
// ============================================================================

/**
 * Initialize the AI Photo Editor.
 *
 * Sets up CE.SDK with:
 * - Photo editor configuration plugin
 * - Asset source plugins (images, filters, effects, etc.)
 * - AI apps for text and image generation
 *
 * Photo mode creates a scene from an image rather than loading an archive.
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param providers - AI provider configuration
 * @param photoUrl - URL to the photo to edit
 */
export async function initAiPhotoEditor(
  cesdk: CreativeEditorSDK,
  providers: AIProviders,
  photoUrl: string
): Promise<void> {
  // Add photo editor config plugin
  await cesdk.addPlugin(new PhotoEditorConfig());

  // Add theme
  cesdk.ui.setTheme('dark');

  // Add asset sources
  await Promise.all([
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource())
  ]);
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // Create photo scene from image (Photo mode uses images, not archives)
  await cesdk.createFromImage(photoUrl);

  // Add AI apps plugin
  await cesdk.addPlugin(new AiAppsConfig(providers, 'Photo'));
}

// ============================================================================
// Video Editor Initialization
// ============================================================================

/**
 * Initialize the AI Video Editor.
 *
 * Sets up CE.SDK with:
 * - Video editor configuration plugin
 * - Asset source plugins (images, video, audio, etc.)
 * - AI apps for text, image, video, and audio generation
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param providers - AI provider configuration
 * @param sceneUrl - URL to the video scene archive
 */
export async function initAiVideoEditor(
  cesdk: CreativeEditorSDK,
  providers: AIProviders,
  sceneUrl: string
): Promise<void> {
  // Add video editor config plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add theme
  cesdk.ui.setTheme('light');

  // Add asset sources (including video/audio)
  await Promise.all([
    cesdk.addPlugin(new ColorPaletteAssetSource()),
    cesdk.addPlugin(new TypefaceAssetSource()),
    cesdk.addPlugin(new TextAssetSource()),
    cesdk.addPlugin(new TextComponentAssetSource()),
    cesdk.addPlugin(new VectorShapeAssetSource()),
    cesdk.addPlugin(new StickerAssetSource()),
    cesdk.addPlugin(new EffectsAssetSource()),
    cesdk.addPlugin(new FiltersAssetSource()),
    cesdk.addPlugin(new BlurAssetSource()),
    cesdk.addPlugin(new PagePresetsAssetSource()),
    cesdk.addPlugin(new CropPresetsAssetSource())
  ]);
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.video.*',
        'ly.img.audio.*'
      ]
    })
  );

  // Load video scene using instance method (handles auto-fit automatically)
  await cesdk.loadFromArchiveURL(sceneUrl);

  // Add AI apps plugin
  await cesdk.addPlugin(new AiAppsConfig(providers, 'Video'));
}
