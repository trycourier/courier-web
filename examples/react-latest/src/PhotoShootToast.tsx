import { useCallback, type CSSProperties } from 'react';
import { CourierToast, useCourier } from '@trycourier/courier-react';
import { createJobInviteMessage } from './previewMessages';
import PhotoShootStage from './PhotoShootStage';

/**
 * The toast pins itself to the viewport, so the stage needs a containing block
 * for it — a transform makes this wrapper one, keeping the toast in frame.
 */
export const toastFrameStyle: CSSProperties = {
  position: 'relative',
  height: '100%',
  transform: 'translateZ(0)',
};

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
      {/* Toasts dismiss themselves by default, which would empty the frame. */}
      <div style={toastFrameStyle}>
        <CourierToast mode="light" autoDismiss={false} onReady={showDemoToast} />
      </div>
    </PhotoShootStage>
  );

}
