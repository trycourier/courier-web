import PhotoShootStage from './PhotoShootStage';

/**
 * Photo shoot: "A Courier Inbox with a custom theme" — light beside dark.
 *
 * Each mode renders in its own iframe: the SDK injects a component's styles once
 * per document, so two inboxes in one page would share (and fight over) a single
 * theme. The export descends into same-origin iframes, so the shot is unaffected.
 */
export default function PhotoShootTheme() {
  return (
    <PhotoShootStage fileName="courier-inbox-theme">
      <div style={{ height: '100%', display: 'flex' }}>
        <iframe
          src="/examples/photo-shoot/frame/inbox-light"
          title="Inbox with a custom theme, light mode"
          style={{ width: '50%', height: '100%', border: 'none', display: 'block' }}
        />
        <iframe
          src="/examples/photo-shoot/frame/inbox-dark"
          title="Inbox with a custom theme, dark mode"
          style={{ width: '50%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </PhotoShootStage>
  );
}
