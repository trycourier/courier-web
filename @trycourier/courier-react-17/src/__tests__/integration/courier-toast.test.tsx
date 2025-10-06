import { render } from '@testing-library/react';
import { CourierToast } from '../../components/courier-toast';
import { CourierToast as CourierToastElement } from '@trycourier/courier-ui-toast';
import React from 'react';

describe('CourierToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
});
