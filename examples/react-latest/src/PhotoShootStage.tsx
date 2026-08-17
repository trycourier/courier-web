import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { domToPng } from 'modern-screenshot';
import { type CourierInboxTheme } from '@trycourier/courier-react';

/**
 * Scrollbars read as clutter in a still, so the shots hide them. The width feeds
 * `scrollbar-width`, so it takes that property's keyword rather than a length.
 */
export const photoShootTheme: CourierInboxTheme = {
  inbox: {
    list: {
      scrollbar: {
        width: 'none',
      },
    },
  },
};

type PhotoShootStageProps = {
  /** Name of the exported file, without an extension. */
  fileName: string;
  children: ReactNode;
};

/**
 * The 788x444 area the photo shoot examples are screenshotted from. Everything
 * a shot should contain lives inside it; the page chrome around it is not
 * captured — including the export button.
 */
export default function PhotoShootStage({ fileName, children }: PhotoShootStageProps) {

  const stageRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function exportPng(event: MouseEvent<HTMLButtonElement>) {
    const stage = stageRef.current;
    if (!stage) return;

    // The popup menu closes on any click that reaches the document, which would
    // empty the frame before it is captured. Keep the click local to the button.
    event.stopPropagation();

    setExporting(true);
    try {
      // The components draw their icons and buttons inside open shadow roots,
      // so the capture has to descend into them — modern-screenshot does.
      const dataUrl = await domToPng(stage, { scale: 2, backgroundColor: '#eef0f4' });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: '24px 16px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ width: '788px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={exportPng}
          disabled={exporting}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #dddddd',
            background: '#fafafa',
            fontSize: '13px',
            cursor: exporting ? 'default' : 'pointer',
          }}
        >
          {exporting ? 'Exporting…' : 'Export PNG (1576x888)'}
        </button>
      </div>

      {/* The outline lives on this wrapper, not on the stage — only the stage
          node is captured, so the export comes out as clean 788x444 content. */}
      <div style={{ flexShrink: 0, fontSize: 0, boxShadow: '0 0 0 1px #d5d8de' }}>
        <div
          ref={stageRef}
          style={{
            width: '788px',
            height: '444px',
            backgroundColor: '#eef0f4',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
