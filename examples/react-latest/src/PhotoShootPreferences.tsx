import { useMemo } from 'react';
import { CourierPreferences } from '@trycourier/courier-react';
import { createPreviewPreferences } from './previewPreferences';
import PhotoShootStage from './PhotoShootStage';

/** Photo shoot: "The Courier preferences center with the default look" */
export default function PhotoShootPreferences() {

  const previewData = useMemo(() => createPreviewPreferences(), []);

  return (
    <PhotoShootStage fileName="courier-preferences">
      <div
        style={{
          height: '100%',
          boxSizing: 'border-box',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '620px' }}>
          <CourierPreferences mode="light" previewData={previewData} />
        </div>
      </div>
    </PhotoShootStage>
  );

}
