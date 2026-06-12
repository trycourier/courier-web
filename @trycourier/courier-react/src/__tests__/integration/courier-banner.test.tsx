import { act, render } from '@testing-library/react';
import { CourierBanner } from '../../components/courier-banner';
import { CourierBanner as CourierBannerElement } from '@trycourier/courier-ui-banner';
import React from 'react';

describe('CourierBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function flushMicrotasks() {
    await act(async () => {
      await Promise.resolve();
    });
  }

  describe('Component Rendering', () => {
    it('should render component with default props when no props are provided', () => {
      const { container } = render(<CourierBanner />);
      expect(container.querySelector('courier-banner')).toBeDefined();
    });

    it('should reflect layout and position props as attributes', () => {
      const { container } = render(<CourierBanner layout="popup" position="top" />);
      const el = container.querySelector('courier-banner');
      expect(el?.getAttribute('layout')).toEqual('popup');
      expect(el?.getAttribute('position')).toEqual('top');
    });
  });

  describe('forwardRef', () => {
    it('should set user-defined ref to the CourierBanner Web Component', () => {
      const ref = React.createRef<CourierBannerElement>();
      render(<CourierBanner ref={ref} />);

      expect(ref.current).toBeDefined();
      expect((ref as React.RefObject<CourierBannerElement | null>).current).not.toBeNull();

      // We can access the CourierBanner Web Component's properties/methods
      expect((ref as React.RefObject<CourierBannerElement | null>).current?.setBannerItem).toBeDefined();
      expect((ref as React.RefObject<CourierBannerElement | null>).current?.setLayout).toBeDefined();
    });
  });

  describe('onReady', () => {
    it('should call onReady once when onReady updates parent state', async () => {
      function ParentWithStateUpdateOnReady() {
        const [readyCount, setReadyCount] = React.useState(0);

        return (
          <div>
            <span data-testid="ready-count">{readyCount}</span>
            <CourierBanner
              onReady={() => setReadyCount(prev => prev + 1)}
              renderBannerItemContent={() => <div>Test</div>}
            />
          </div>
        );
      }

      const { getByTestId } = render(<ParentWithStateUpdateOnReady />);
      await flushMicrotasks();

      expect(getByTestId('ready-count').textContent).toEqual('1');
    });
  });
});
