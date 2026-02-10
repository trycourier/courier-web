import { act, render } from '@testing-library/react';
import { CourierToast } from '../../components/courier-toast';
import { CourierToast as CourierToastElement } from '@trycourier/courier-ui-toast';
import React from 'react';

describe('CourierToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function flushMicrotasks() {
    await act(async () => {
      await Promise.resolve();
    });
  }

  describe('Component Rendering', () => {
    it('should render skeleton with default props when no props are provided', () => {
      const { container } = render(<CourierToast />);

      // The component should render
      expect(container.querySelector('courier-toast')).toBeDefined();
    });
  });

  describe('forwardRef', () => {
    it('should set user-defined ref to CourierToast Web Component', () => {
      const ref = React.createRef<CourierToastElement>();
      render(<CourierToast ref={ref} />);

      expect(ref.current).toBeDefined();
      expect((ref as React.RefObject<CourierToastElement | null>).current).not.toBeNull();

      // We can access the CourierToasts Web Component's properties/methods
      expect((ref as React.RefObject<CourierToastElement | null>).current?.setToastItem).toBeDefined();
    });
  });

  describe('renderToastItemContent', () => {
    it('should not re-register custom content on resize re-renders', async () => {
      const setToastItemContentSpy = jest.spyOn(CourierToastElement.prototype, 'setToastItemContent');

      function ResizeAwareToast() {
        const [resizeCount, setResizeCount] = React.useState(0);

        React.useEffect(() => {
          const handleResize = () => {
            setResizeCount(prev => prev + 1);
          };

          window.addEventListener('resize', handleResize);
          return () => {
            window.removeEventListener('resize', handleResize);
          };
        }, []);

        return <CourierToast renderToastItemContent={() => <div>Test {resizeCount}</div>} />;
      }

      render(<ResizeAwareToast />);
      await flushMicrotasks();

      await act(async () => {
        for (let i = 0; i < 5; i += 1) {
          window.dispatchEvent(new Event('resize'));
        }
      });
      await flushMicrotasks();

      expect(setToastItemContentSpy).toHaveBeenCalledTimes(1);

      setToastItemContentSpy.mockRestore();
    });

    it('should call onReady once when onReady updates parent state', async () => {
      function ParentWithStateUpdateOnReady() {
        const [readyCount, setReadyCount] = React.useState(0);

        return (
          <div>
            <span data-testid="ready-count">{readyCount}</span>
            <CourierToast
              onReady={() => setReadyCount(prev => prev + 1)}
              renderToastItemContent={() => <div>Test</div>}
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
