import { Link } from 'react-router-dom';

export default function Examples() {
  return (
    <div
      style={{
        padding: '24px',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Courier Inbox & Toast Examples
      </h1>

      {/* Default examples */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Examples</h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '4px',
          }}
        >
          <li>
            <Link to="/inbox">Inbox Default</Link>
          </li>
          <li>
            <Link to="/inbox-popup-menu">Inbox Popup Menu Default</Link>
          </li>
          <li>
            <Link to="/inbox-custom-feed">Inbox Custom Feed</Link>
          </li>
          <li>
            <Link to="/inbox-popup-menu-custom-feed">
              Inbox Popup Menu Custom Feed
            </Link>
          </li>
        </ul>
      </section>

      {/* Themed examples */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
          Themed Examples
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '4px',
          }}
        >
          <li>
            <Link to="/inbox-custom-height">Inbox Custom Height</Link>
          </li>
          <li>
            <Link to="/inbox-theme">Inbox with theme (React)</Link>
          </li>
          {/* Additional themed inbox / popup menu variants are only in the Web JS examples */}
        </ul>
      </section>

      {/* Custom examples */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
          Custom Examples
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '4px',
          }}
        >
          <li>
            <Link to="/inbox-header">Custom Inbox Header</Link>
          </li>
          <li>
            <Link to="/inbox-list-item">Custom Inbox List Item</Link>
          </li>
          <li>
            <Link to="/inbox-popup-menu-button">
              Custom Inbox Popup Menu Button
            </Link>
          </li>
          <li>
            <Link to="/inbox-popup-list-item">
              Custom Inbox Popup List Item
            </Link>
          </li>
          <li>
            <Link to="/inbox-popup-everything-else">
              Custom Inbox Everything Else
            </Link>
          </li>
        </ul>
      </section>

      {/* Additional React-only examples */}
      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
          React-only Examples
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '4px',
          }}
        >
          <li>
            <Link to="/actions">Inbox Actions</Link>
          </li>
          <li>
            <Link to="/alignment">Alignment</Link>
          </li>
          <li>
            <Link to="/element-ref">Element Ref</Link>
          </li>
          <li>
            <Link to="/canvas">Canvas (advanced demo)</Link>
          </li>
          <li>
            <Link to="/markdown">Markdown List Item</Link>
          </li>
          <li>
            <Link to="/datastore-listener">Datastore Listener</Link>
          </li>
          <li>
            <Link to="/toast">Toast</Link>
          </li>
          <li>
            <Link to="/hooks">Hooks-Only Usage</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}


