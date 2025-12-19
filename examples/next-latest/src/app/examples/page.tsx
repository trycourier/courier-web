'use client'

import Link from 'next/link';

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

      <section
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Inbox examples */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExampleCard to="/examples/inbox" title="Inbox — Default">
            Minimal inbox with default styling and message click handling.
          </ExampleCard>
          <ExampleCard to="/examples/inbox-custom-feed" title="Inbox — Custom Feed">
            Inbox configured with multiple custom feeds (All, Jobs, My Posts, Mentions).
          </ExampleCard>
          <ExampleCard to="/examples/inbox-custom-tabs" title="Inbox — Custom Tabs">
            Inbox with a single feed containing multiple filtering tabs (All, Unread, Read, Important, Archived).
          </ExampleCard>
          <ExampleCard to="/examples/inbox-custom-height" title="Inbox — Custom Height">
            Inbox constrained to a custom height with a tailored layout.
          </ExampleCard>
          <ExampleCard to="/examples/inbox-theme" title="Inbox — Themed (React)">
            Inbox themed via React with Poppins typography and accent colors.
          </ExampleCard>
          <ExampleCard to="/examples/inbox-header" title="Inbox — Custom Header">
            Inbox with a fully custom header driven by feed and tab state.
          </ExampleCard>
          <ExampleCard to="/examples/inbox-list-item" title="Inbox — Custom List Item">
            Inbox rendering each message as a custom list item component.
          </ExampleCard>
          <ExampleCard to="/examples/inbox-actions" title="Inbox — Actions">
            Inbox with custom header action menu using Courier React.
          </ExampleCard>
        </div>

        {/* Popup inbox examples */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExampleCard
            to="/examples/inbox-popup-menu"
            title="Popup — Default Menu Button"
          >
            Popup inbox menu with default appearance and interactions.
          </ExampleCard>
          <ExampleCard
            to="/examples/inbox-popup-menu-custom-feed"
            title="Popup — Custom Feed"
          >
            Popup inbox menu with multiple custom feeds and tabs (All, Jobs, My Posts, Mentions, Other).
          </ExampleCard>
          <ExampleCard
            to="/examples/inbox-popup-menu-button"
            title="Popup — Custom Menu Button"
          >
            Popup inbox menu using a fully custom trigger button.
          </ExampleCard>
          <ExampleCard
            to="/examples/inbox-popup-list-item"
            title="Popup — Custom List Item"
          >
            Popup rendering messages with a custom list item component.
          </ExampleCard>
          <ExampleCard
            to="/examples/inbox-popup-menu-theme"
            title="Popup — Themed (React)"
          >
            Popup inbox menu themed via React with Poppins typography and accent colors.
          </ExampleCard>
          <ExampleCard
            to="/examples/inbox-popup-everything-else"
            title="Popup — Custom States"
          >
            Popup with custom loading, empty, error, and pagination states.
          </ExampleCard>
          <ExampleCard to="/examples/alignment" title="Popup — Alignment & Position">
            Demonstrates alignment and positioning options for the popup menu.
          </ExampleCard>
        </div>

        {/* React-only examples */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExampleCard to="/examples/element-ref" title="Element Ref">
            Access the underlying inbox element via React refs.
          </ExampleCard>
          <ExampleCard to="/examples/markdown" title="Markdown List Item">
            Render inbox messages using a custom markdown list item component.
          </ExampleCard>
          <ExampleCard to="/examples/hooks" title="Hooks-only Usage">
            Use Courier React hooks directly without JSX components.
          </ExampleCard>
        </div>

        {/* Toast examples */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ExampleCard to="/examples/toast-basic" title="Toast — Basic">
            Toast notifications using the default Courier Toast theme.
          </ExampleCard>
          <ExampleCard to="/examples/toast-themed" title="Toast — Themed">
            Toast notifications using a Poppins-based custom theme.
          </ExampleCard>
          <ExampleCard to="/examples/toast-custom" title="Toast — Custom">
            Toast notifications rendered with a fully custom React component.
          </ExampleCard>
        </div>
      </section>
    </main>
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
      href={to}
      style={{
        display: 'block',
        padding: '10px 12px',
        margin: '10px 0',
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

