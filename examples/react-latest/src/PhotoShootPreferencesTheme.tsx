import PhotoShootStage from './PhotoShootStage';

/**
 * Photo shoot: "The preferences center with a custom theme, in light and dark
 * mode."
 *
 * Each mode renders in its own iframe for the same reason as the themed inbox
 * shoot: a component's styles are injected once per document.
 */
export default function PhotoShootPreferencesTheme() {
  return (
    <PhotoShootStage fileName="courier-preferences-theme">
      <div style={{ height: '100%', display: 'flex' }}>
        <iframe
          src="/examples/photo-shoot/frame/preferences-light"
          title="Preferences with a custom theme, light mode"
          style={{ width: '50%', height: '100%', border: 'none', display: 'block' }}
        />
        <iframe
          src="/examples/photo-shoot/frame/preferences-dark"
          title="Preferences with a custom theme, dark mode"
          style={{ width: '50%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </PhotoShootStage>
  );
}
