import { Link } from 'react-router-dom';

export default function Examples() {
  return (
    <main
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '24px 16px 40px',
        boxSizing: 'border-box',
      }}
    >
      <header
        style={{
          marginBottom: '24px',
          borderBottom: '1px solid #dddddd',
          paddingBottom: '12px',
        }}
      >
        <h1 style={{ margin: '0 0 6px', fontSize: '22px' }}>
          Courier React Inbox & Toast Examples
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#555555' }}>
          Explore inbox, popup, toast, and React-only examples built with
          `@trycourier/courier-react`.
        </p>
      </header>

      <ExampleSection title="Photo Shoot">
        <ExampleCard to="/examples/photo-shoot/inbox" title="Inbox Card">
          The inbox as a centered card on a 788x444 stage.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/popup" title="Popup Menu">
          Popup opening centered beneath its button on a 788x444 stage.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/split" title="Inbox + Popup Split">
          Inbox filling the left half, popup centered in the right half.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/delivered" title="Delivered Message">
          A message delivered to the Courier Inbox after a send.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/theme" title="Inbox Custom Theme">
          A Courier Inbox with a custom theme.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/custom-render" title="Custom Header + Items">
          An inbox with a custom header and custom list items, while the SDK still manages the list.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/toast" title="Toast">
          A Courier toast appearing for a new message.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/toast-theme" title="Toast Custom Theme">
          A Courier toast with a custom theme.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/preferences" title="Preferences">
          The Courier preferences center with the default look.
        </ExampleCard>
        <ExampleCard to="/examples/photo-shoot/preferences-theme" title="Preferences Custom Theme">
          The preferences center with a custom theme.
        </ExampleCard>
      </ExampleSection>

      <ExampleSection title="Inbox">
        <ExampleCard to="/examples/inbox" title="Default">
          Minimal inbox with default styling and message click handling.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-custom-feed" title="Custom Feed">
          Inbox configured with multiple custom feeds (All, Jobs, My Posts, Mentions).
        </ExampleCard>
        <ExampleCard to="/examples/inbox-custom-tabs" title="Custom Tabs">
          Inbox with a single feed containing multiple filtering tabs (All, Unread, Read, Important, Archived).
        </ExampleCard>
        <ExampleCard to="/examples/inbox-custom-height" title="Custom Height">
          Inbox constrained to a custom height with a tailored layout.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-theme" title="Themed">
          Inbox themed via React with Poppins typography and accent colors.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-header" title="Custom Header">
          Inbox with a fully custom header driven by feed and tab state.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-list-item" title="Custom List Item">
          Inbox rendering each message as a custom list item component.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-actions" title="Actions">
          Inbox with custom header action menu using Courier React.
        </ExampleCard>
      </ExampleSection>

      <ExampleSection title="Popup Menu">
        <ExampleCard to="/examples/inbox-popup-menu" title="Default Menu Button">
          Popup inbox menu with default appearance and interactions.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-popup-menu-custom-feed" title="Custom Feed">
          Popup inbox menu with multiple custom feeds and tabs (All, Jobs, My Posts, Mentions, Other).
        </ExampleCard>
        <ExampleCard to="/examples/inbox-popup-menu-button" title="Custom Menu Button">
          Popup inbox menu using a fully custom trigger button.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-popup-list-item" title="Custom List Item">
          Popup rendering messages with a custom list item component.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-popup-menu-theme" title="Themed">
          Popup inbox menu themed via React with Poppins typography and accent colors.
        </ExampleCard>
        <ExampleCard to="/examples/inbox-popup-everything-else" title="Custom States">
          Popup with custom loading, empty, error, and pagination states.
        </ExampleCard>
        <ExampleCard to="/examples/alignment" title="Alignment & Position">
          Demonstrates alignment and positioning options for the popup menu.
        </ExampleCard>
      </ExampleSection>

      <ExampleSection title="React-only">
        <ExampleCard to="/examples/element-ref" title="Element Ref">
          Access the underlying inbox element via React refs.
        </ExampleCard>
        <ExampleCard to="/examples/markdown" title="Markdown List Item">
          Render inbox messages using a custom markdown list item component.
        </ExampleCard>
        <ExampleCard to="/examples/hooks" title="Hooks-only Usage">
          Use Courier React hooks directly without JSX components.
        </ExampleCard>
      </ExampleSection>

      <ExampleSection title="Toast">
        <ExampleCard to="/examples/toast-basic" title="Basic">
          Toast notifications using the default Courier Toast theme.
        </ExampleCard>
        <ExampleCard to="/examples/toast-themed" title="Themed">
          Toast notifications using a Poppins-based custom theme.
        </ExampleCard>
        <ExampleCard to="/examples/toast-custom" title="Custom">
          Toast notifications rendered with a fully custom React component.
        </ExampleCard>
        <ExampleCard to="/examples/toast-auto-dismiss" title="Auto-dismiss">
          Timed toasts with a countdown bar that pauses while hovered.
        </ExampleCard>
      </ExampleSection>

      <ExampleSection title="Preferences">
        <ExampleCard to="/examples/preferences" title="Default">
          Full notification preferences page with sections, toggles, and channel routing.
        </ExampleCard>
        <ExampleCard to="/examples/preferences-styled" title="Styled">
          Preferences themed with Poppins typography and a purple accent color.
        </ExampleCard>
      </ExampleSection>
    </main>
  );
}

type ExampleSectionProps = {
  title: string;
  children: React.ReactNode;
};

function ExampleSection({ title, children }: ExampleSectionProps) {
  return (
    <section style={{ marginBottom: '32px' }}>
      <h2
        style={{
          margin: '0 0 12px',
          paddingBottom: '6px',
          borderBottom: '1px solid #eeeeee',
          textAlign: 'left',
          textTransform: 'uppercase',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: '#777777',
        }}
      >
        {title}
      </h2>
      {/* Cards wrap left to right, filling the row before the next one starts. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '10px',
        }}
      >
        {children}
      </div>
    </section>
  );
}

type ExampleCardProps = {
  to: string;
  title: string;
  children: React.ReactNode;
};

function ExampleCard({ to, title, children }: ExampleCardProps) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '10px 12px',
        borderRadius: '4px',
        border: '1px solid #dddddd',
        textDecoration: 'none',
        color: 'inherit',
        background: '#fafafa',
        fontSize: '13px',
      }}
    >
      <strong style={{ display: 'block', fontSize: '14px', marginBottom: 6 }}>
        {title}
      </strong>
      <span style={{ display: 'block', color: '#666666' }}>{children}</span>
    </Link>
  );
}
