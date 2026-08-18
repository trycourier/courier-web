import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { domToPng } from 'modern-screenshot';
import { type CourierInboxTheme } from '@trycourier/courier-react';
import { COMPONENT_BORDER } from './photoShootThemes';

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

/** The CSS size of the frame every shot is composed inside. */
const STAGE_WIDTH = 788;
const STAGE_HEIGHT = 444;

/**
 * Device-pixel multiplier for the export. The stage is vector — copy, borders,
 * and the components' inline SVG icons all re-render at this density rather than
 * being scaled up — so the ceiling is the one raster the shots contain: the
 * sender photos in [previewPeople], requested at a size that covers this value.
 */
const EXPORT_SCALE = 4;

/**
 * The inset between the stage edge and a card sitting inside it, on all four
 * sides — the shots used to carry a different gap on each axis.
 */
const STAGE_GUTTER = 24;

type PhotoShootStageProps = {
  /** Name of the exported file, without an extension. */
  fileName: string;
  children: ReactNode;
};

/**
 * A card inset from the stage by [STAGE_GUTTER] on every side — 740x396 inside
 * the 788x444 frame.
 *
 * The height is fixed here rather than left to the content, which is the part
 * that makes the gutter even: a card that sizes to its own content can only be
 * centred, so its top and bottom gaps come out at whatever the content leaves
 * over, and match the sides only by coincidence. Give the child `height="100%"`
 * so it fills the card the frame guarantees.
 */
export function PhotoShootCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        padding: `${STAGE_GUTTER}px`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          border: `1px solid ${COMPONENT_BORDER}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

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
      const dataUrl = await domToPng(stage, { scale: EXPORT_SCALE, backgroundColor: '#eef0f4' });
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
      <div style={{ width: `${STAGE_WIDTH}px`, display: 'flex', justifyContent: 'flex-end' }}>
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
          {exporting
            ? 'Exporting…'
            : `Export PNG (${STAGE_WIDTH * EXPORT_SCALE}x${STAGE_HEIGHT * EXPORT_SCALE})`}
        </button>
      </div>

      {/* The outline lives on this wrapper, not on the stage — only the stage
          node is captured, so the export comes out as clean 788x444 content. */}
      <div style={{ flexShrink: 0, fontSize: 0, boxShadow: '0 0 0 1px #d5d8de' }}>
        <div
          ref={stageRef}
          style={{
            width: `${STAGE_WIDTH}px`,
            height: `${STAGE_HEIGHT}px`,
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
