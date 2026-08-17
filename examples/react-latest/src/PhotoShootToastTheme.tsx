import PhotoShootStage from './PhotoShootStage';

/**
 * Photo shoot: "A Courier toast with a custom theme" — light beside dark, the
 * same pairing as the themed inbox and preferences shoots.
 *
 * Each mode renders in its own iframe: a component's styles are injected once
 * per document, so two toasts in one page would share a single theme.
 */
export default function PhotoShootToastTheme() {
  return (
    <PhotoShootStage fileName="courier-toast-theme">
      <div style={{ height: '100%', display: 'flex' }}>
        <iframe
          src="/examples/photo-shoot/frame/toast-light"
          title="Toast with a custom theme, light mode"
          style={{ width: '50%', height: '100%', border: 'none', display: 'block' }}
        />
        <iframe
          src="/examples/photo-shoot/frame/toast-dark"
          title="Toast with a custom theme, dark mode"
          style={{ width: '50%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </PhotoShootStage>
  );
}
