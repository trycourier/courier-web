import { CourierToast, type CourierToastTheme } from '@trycourier/courier-react';
import PhotoShootStage from './PhotoShootStage';
import { toastFrameStyle, useDemoToast } from './PhotoShootToast';

const FONT = 'Poppins';

const themedToast: CourierToastTheme = {
  item: {
    backgroundColor: '#F5F3FF',
    border: '1px solid #DDD6FE',
    borderRadius: '14px',
    title: { family: FONT, size: '15px', weight: '600', color: '#5B21B6' },
    body: { family: FONT, size: '14px', color: '#6B6580' },
    // Filled accent buttons, matching the themed inbox shoot.
    actions: {
      backgroundColor: '#8B5CF6',
      hoverBackgroundColor: '#7C4DEF',
      activeBackgroundColor: '#6D3EE0',
      border: 'none',
      borderRadius: '8px',
      font: { family: FONT, size: '13px', weight: '500', color: '#FFFFFF' },
    },
    // No leading icon: a checkmark reads as "done" next to a message that is
    // asking for a decision.
    icon: { visible: false },
  },
};

/** Photo shoot: "A Courier toast with a custom theme" */
export default function PhotoShootToastTheme() {

  const showDemoToast = useDemoToast('photo-shoot-toast-themed');

  return (
    <PhotoShootStage fileName="courier-toast-theme">
      <div style={toastFrameStyle}>
        <CourierToast
          mode="light"
          lightTheme={themedToast}
          autoDismiss={false}
          onReady={showDemoToast}
        />
      </div>
    </PhotoShootStage>
  );

}
