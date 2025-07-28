import { render } from '@testing-library/react';
import { CourierInbox } from '../../components/courier-inbox';
import { CourierInbox as CourierInboxElement } from '@trycourier/courier-ui-inbox';
import React from 'react';

describe('CourierInbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render skeleton with default props when no props are provided', () => {
      const { container } = render(<CourierInbox />);

      // The component should render (check title and skeleton items)
      expect(container.querySelector('courier-inbox-header-title')?.textContent).toBe('Inbox');
      expect(container.querySelectorAll('.skeleton-item').length).toBeGreaterThan(0);
    });
  });

  describe('forwardRef', () => {
    it('should set user-defined ref to CourierInbox Web Component', () => {
      const ref = React.createRef<CourierInboxElement>();
      render(<CourierInbox ref={ref} />);

      expect(ref.current).toBeDefined();
      expect((ref as React.RefObject<CourierInboxElement | null>).current).not.toBeNull();

      // We can access the CourierInbox Web Component's properties
      expect((ref as React.RefObject<CourierInboxElement | null>).current?.currentFeed).toBe('inbox');
    });
  });
});
