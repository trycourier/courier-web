// Imports the courier-inbox web component
import '@trycourier/courier-ui-inbox';

export interface CourierInboxProps {
  height?: string;
  messageClick?: (props: any) => void;
  lightTheme?: any;
  darkTheme?: any;
  mode?: string;
}

export const CourierInbox: React.FC<CourierInboxProps> = ({
  height,
  messageClick,
  lightTheme,
  darkTheme,
  mode,
}) => {
  return (
    <courier-inbox
      height={height}
      message-click={messageClick ? 'true' : undefined}
      light-theme={lightTheme && JSON.stringify(lightTheme)}
      dark-theme={darkTheme && JSON.stringify(darkTheme)}
      mode={mode}
    />
  );
};