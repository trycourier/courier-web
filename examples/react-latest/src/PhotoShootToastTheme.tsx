import { CourierToast } from '@trycourier/courier-react';
import PhotoShootStage from './PhotoShootStage';
import { useDemoToast } from './PhotoShootToast';
import { toastTheme } from './photoShootThemes';

/** Photo shoot: "A Courier toast with a custom theme" */
export default function PhotoShootToastTheme() {

  const showDemoToast = useDemoToast('photo-shoot-toast-themed');

  return (
    <PhotoShootStage fileName="courier-toast-theme">
      {/* No backdrop of its own — the stage colour, same as every other shoot. */}
      <div style={{ position: 'relative', height: '100%' }}>
        <CourierToast
          mode="light"
          lightTheme={toastTheme}
          // The shoot holds the toast open, which would otherwise pin the
          // dismiss button — it only appears on hover in normal use.
          autoDismiss={false}
          dismissButton="hidden"
          onReady={showDemoToast}
          // Centered in the frame, and absolute rather than the toast's usual
          // fixed: fixed would anchor it to the page instead of to this frame.
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </PhotoShootStage>
  );

}
