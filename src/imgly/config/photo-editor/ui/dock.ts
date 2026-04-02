/**
 * Dock Configuration - Left Side Photo Tools and Asset Panel
 *
 * Configure the dock to control which photo editing tools and asset libraries appear.
 *
 * ## `'ly.img.assetLibrary.dock'`
 *
 * A pre-defined component that opens a panel with asset libraries.
 *
 * - `id` - Component ID (e.g., `'ly.img.assetLibrary.dock'`)
 * - `key` - Unique identifier for this entry
 * - `label` - Translation key for the button label
 * - `icon` - Icon name (e.g., `'@imgly/Text'`, `'@imgly/Sticker'`)
 * - `entries` - Array of asset source IDs to display
 * - `onClick` - Custom click handler (overrides default behavior)
 * - `isSelected` - Boolean or function to control selected state
 * - `isDisabled` - Boolean or function to control disabled state
 * - `size` - Button size: `'normal'` | `'large'`
 * - `variant` - Button variant: `'regular'` | `'plain'`
 * - `color` - Button color: `'accent'` | `'danger'`
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/dock-cb916c/
 * @see https://img.ly/docs/cesdk/js/user-interface/appearance/icons-679e32/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the dock panel layout for photo editing.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupDock(cesdk: CreativeEditorSDK): void {
  const { engine, ui } = cesdk;

  // ============================================================================
  // DOCK APPEARANCE SETTINGS
  // Configure how the dock looks
  // ============================================================================

  // #region Dock Appearance
  // Show text labels under dock icons
  engine.editor.setSetting('dock/hideLabels', false);

  // Icon size: 'normal' or 'large'
  engine.editor.setSetting('dock/iconSize', 'large');
  // #endregion

  // ============================================================================
  // DOCK ORDER
  // Configure photo editing tools and asset libraries
  // ============================================================================

  // #region Register Custom Dock Components
  // Photo tools need custom components since they open inspector panels, not asset libraries

  ui.registerComponent('ly.img.crop.dock', ({ builder: { Button } }) => {
    const isCropMode = engine.editor.getEditMode() === 'Crop';
    Button('crop-button', {
      label: 'Crop',
      icon: '@imgly/Crop',
      isSelected: isCropMode,
      onClick: () => {
        const page = engine.scene.getCurrentPage();
        if (page == null) return;

        if (isCropMode) {
          engine.editor.setEditMode('Transform');
        } else {
          ui.closePanel('*');
          engine.block.select(page);
          engine.editor.setEditMode('Crop');
        }
      }
    });
  });

  ui.registerComponent('ly.img.adjustment.dock', ({ builder: { Button } }) => {
    const panelId = '//ly.img.panel/inspector/adjustments';
    const isOpen = ui.isPanelOpen(panelId);
    Button('adjustment-button', {
      label: 'Adjust',
      icon: '@imgly/Adjustments',
      isSelected: isOpen,
      onClick: () => {
        if (isOpen) {
          ui.closePanel(panelId);
          return;
        }
        const page = engine.scene.getCurrentPage();
        if (page == null) return;
        ui.closePanel('*');
        engine.editor.setEditMode('Transform');
        engine.block.select(page);
        ui.openPanel(panelId, { floating: true });
      }
    });
  });

  ui.registerComponent('ly.img.filter.dock', ({ builder: { Button } }) => {
    const panelId = '//ly.img.panel/inspector/filters';
    const isOpen = ui.isPanelOpen(panelId);
    Button('filter-button', {
      label: 'Filter',
      icon: '@imgly/Filter',
      isSelected: isOpen,
      onClick: () => {
        if (isOpen) {
          ui.closePanel(panelId);
          return;
        }
        const page = engine.scene.getCurrentPage();
        if (page == null) return;
        ui.closePanel('*');
        engine.editor.setEditMode('Transform');
        engine.block.select(page);
        ui.openPanel(panelId, { floating: true });
      }
    });
  });

  ui.registerComponent('ly.img.effects.dock', ({ builder: { Button } }) => {
    const panelId = '//ly.img.panel/inspector/effects';
    const isOpen = ui.isPanelOpen(panelId);
    Button('effects-button', {
      label: 'Effects',
      icon: '@imgly/Effects',
      isSelected: isOpen,
      onClick: () => {
        if (isOpen) {
          ui.closePanel(panelId);
          return;
        }
        const page = engine.scene.getCurrentPage();
        if (page == null) return;
        ui.closePanel('*');
        engine.editor.setEditMode('Transform');
        engine.block.select(page);
        ui.openPanel(panelId, { floating: true });
      }
    });
  });
  // #endregion

  // #region Dock Order
  ui.setComponentOrder({ in: 'ly.img.dock' }, [
    'ly.img.spacer',

    // Photo Editing Tools (custom components)
    'ly.img.crop.dock',
    'ly.img.adjustment.dock',
    'ly.img.filter.dock',
    'ly.img.effects.dock',

    'ly.img.separator',

    // Asset Libraries
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.text',
      icon: '@imgly/Text',
      label: 'libraries.ly.img.text.label',
      entries: ['ly.img.text']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.vector.shape',
      icon: '@imgly/Shapes',
      label: 'libraries.ly.img.vector.shape.label',
      entries: ['ly.img.vector.shape']
    },
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.sticker',
      icon: '@imgly/Sticker',
      label: 'libraries.ly.img.sticker.label',
      entries: ['ly.img.sticker']
    },

    'ly.img.spacer'
  ]);
  // #endregion
}
