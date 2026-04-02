/**
 * CE.SDK AI Editor - Main App Component
 *
 * Uses the official CE.SDK React wrapper with AI generation capabilities.
 * Supports Design, Photo, and Video editing modes with configurable AI providers.
 */

import { useCallback, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import {
  createAIProviders,
  initAiDesignEditor,
  initAiPhotoEditor,
  initAiVideoEditor,
  type AIProviders
} from '../imgly';
import { DEFAULT_PHOTO_URL, SCENE_URLS } from './constants';

import { Sidebar } from './Sidebar/Sidebar';
import { Topbar } from './Topbar/Topbar';
import styles from './App.module.css';

// ============================================================================
// Editor Mode Type
// ============================================================================

/**
 * Available editor modes for the AI Editor.
 */
export type EditorMode = 'Design' | 'Video' | 'Photo';

/**
 * All available editor modes.
 */
const EDITOR_MODES: readonly EditorMode[] = ['Design', 'Video', 'Photo'];

// ============================================================================
// Props
// ============================================================================

interface AppProps {
  /**
   * CE.SDK configuration object.
   * Passed to the CreativeEditor component.
   */
  config: Partial<Configuration>;
}

// ============================================================================
// URL Parameter Handling
// ============================================================================

function getInitialMode(): EditorMode {
  const url = new URL(window.location.href);
  const modeParam = url.searchParams.get('mode') as EditorMode | null;
  if (modeParam && EDITOR_MODES.includes(modeParam)) {
    return modeParam;
  }
  return 'Design';
}

// ============================================================================
// App Component
// ============================================================================

export default function App({ config }: AppProps) {
  const [currentMode, setCurrentMode] = useState<EditorMode>(getInitialMode);
  const [currentProviders, setCurrentProviders] = useState<AIProviders>(() =>
    createAIProviders(getInitialMode())
  );

  // Track initialization key to force re-mount of CreativeEditor
  const [editorKey, setEditorKey] = useState(0);

  /**
   * Initialize CE.SDK via the CreativeEditor component's init callback.
   */
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // Debug access (remove in production)
      (window as any).cesdk = cesdk;

      // Initialize the appropriate editor based on current mode
      switch (currentMode) {
        case 'Design':
          await initAiDesignEditor(cesdk, currentProviders, SCENE_URLS.Design);
          break;
        case 'Photo':
          await initAiPhotoEditor(cesdk, currentProviders, DEFAULT_PHOTO_URL);
          break;
        case 'Video':
          await initAiVideoEditor(cesdk, currentProviders, SCENE_URLS.Video);
          break;
        default:
          await initAiDesignEditor(cesdk, currentProviders, SCENE_URLS.Design);
      }
    },
    [currentMode, currentProviders]
  );

  /**
   * Handle mode change from the topbar selector.
   */
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setCurrentMode(newMode);

    // Create new providers for the mode
    const newProviders = createAIProviders(newMode);
    setCurrentProviders(newProviders);

    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url.toString());

    // Force re-mount of CreativeEditor to reinitialize with new mode
    setEditorKey((prev) => prev + 1);
  }, []);

  /**
   * Handle provider changes from the sidebar.
   */
  const handleProviderChange = useCallback((newProviders: AIProviders) => {
    setCurrentProviders(newProviders);

    // Force re-mount of CreativeEditor to reinitialize with new providers
    setEditorKey((prev) => prev + 1);
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Topbar
          modes={EDITOR_MODES}
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
      </div>
      <div className={styles.editorRow}>
        <CreativeEditor
          key={editorKey}
          className={styles.editor}
          config={config}
          init={handleInit}
        />
        <Sidebar
          providers={currentProviders}
          onApplyChanges={handleProviderChange}
        />
      </div>
    </div>
  );
}
