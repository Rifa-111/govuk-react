import * as React from 'react';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { spacing } from '@govuk-react/lib';
import { MEDIA_QUERIES } from '@govuk-react/constants';

const StyledTabList = styled('ul')(
  {
    margin: 0,
  },
  spacing.responsive({ size: 6, property: 'margin', direction: 'bottom' }),
  {
    padding: 0,
    listStyle: 'none',
    [MEDIA_QUERIES.TABLET]: {
      borderBottom: `1px solid ${BORDER_COLOUR}`,
      marginBottom: 0,
      '::after': {
        content: "''",
        display: 'block',
        clear: 'both',
      },
    },
  }
);

/**
 * Use a single tab stop in the list. Arrow keys move focus without changing
 * the selected panel; Enter or Space activates the focused tab.
 *
 * This follows the ARIA manual-activation tab pattern while preserving each
 * tab's existing click handler (including router-based tabs).
 */
const TabList: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ onKeyDown, ...props }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>): void => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const target = (event.target as HTMLElement).closest<HTMLElement>('[role="tab"]');
    if (!target || !event.currentTarget.contains(target)) return;

    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
    const currentIndex = tabs.indexOf(target);
    if (currentIndex < 0 || tabs.length === 0) return;

    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        target.click();
        return;
      default:
        return;
    }
    event.preventDefault();
    tabs[nextIndex].focus();
  };

  return <StyledTabList role="tablist" onKeyDown={handleKeyDown} {...props} />;
};

export default TabList;
