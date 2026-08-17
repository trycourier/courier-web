import { useCallback } from 'react';
import { CourierToast, useCourier } from '@trycourier/courier-react';
import { createJobInviteMessage } from './previewMessages';
import PhotoShootStage from './PhotoShootStage';

/**
 * Shows the week's opening message as a toast; no sign-in or network involved.
 * It has to wait for `onReady` — the element mounts an effect later than this
 * page does, and a message added before then never reaches it.
 */
export function useDemoToast(messageId: string) {
  const courier = useCourier();

  return useCallback((ready: boolean) => {
    if (!ready) return;
    const invite = createJobInviteMessage();
    courier.toast.addMessage({
      ...invite,
      messageId,
      body: invite.preview,
    });
  }, [messageId]);
}

/** Photo shoot: "A Courier toast appearing for a new message" */
export default function PhotoShootToast() {

  const showDemoToast = useDemoToast('photo-shoot-toast');

  return (
    <PhotoShootStage fileName="courier-toast">
      <div style={{ position: 'relative', height: '100%' }}>
        <CourierToast
          mode="light"
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
