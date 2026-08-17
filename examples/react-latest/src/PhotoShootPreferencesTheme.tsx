import { useMemo } from 'react';
import { CourierPreferences } from '@trycourier/courier-react';
import { createPreviewPreferences } from './previewPreferences';
import PhotoShootStage from './PhotoShootStage';
import { preferencesTheme } from './photoShootThemes';

/** Photo shoot: "The preferences center with a custom theme" */
export default function PhotoShootPreferencesTheme() {

  const previewData = useMemo(() => createPreviewPreferences(), []);

  return (
    <PhotoShootStage fileName="courier-preferences-theme">
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '620px' }}>
          <CourierPreferences
            mode="light"
            lightTheme={preferencesTheme}
            previewData={previewData}
          />
        </div>
      </div>
    </PhotoShootStage>
  );

}
