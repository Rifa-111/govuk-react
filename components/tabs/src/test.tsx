import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Tabs } from '.';

const ExampleTabs: React.FC = () => {
  const [selected, setSelected] = React.useState(0);
  return (
    <Tabs>
      <Tabs.List aria-label="Example tabs">
        {['First', 'Second', 'Third'].map((label, index) => (
          <Tabs.Tab
            key={label}
            href={`#panel-${index}`}
            selected={selected === index}
            onClick={(event) => {
              event.preventDefault();
              setSelected(index);
            }}
          >
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {[0, 1, 2].map((index) => (
        <Tabs.Panel key={index} id={`panel-${index}`} selected={selected === index}>
          {index} content
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

describe('tabs keyboard accessibility', () => {
  it('exposes a tablist and only the selected tab in sequential keyboard navigation', () => {
    const { getAllByRole, getByRole } = render(<ExampleTabs />);
    expect(getByRole('tablist')).toHaveAttribute('aria-label', 'Example tabs');
    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  it('moves focus with arrow keys without selecting until activated', () => {
    const { getAllByRole } = render(<ExampleTabs />);
    const tabs = getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

    fireEvent.keyDown(tabs[1], { key: 'Enter' });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
  });

  it('wraps focus and supports Home, End and Space activation', () => {
    const { getAllByRole } = render(<ExampleTabs />);
    const tabs = getAllByRole('tab');
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' });
    expect(tabs[2]).toHaveFocus();
    fireEvent.keyDown(tabs[2], { key: 'Home' });
    expect(tabs[0]).toHaveFocus();
    fireEvent.keyDown(tabs[0], { key: 'End' });
    expect(tabs[2]).toHaveFocus();
    fireEvent.keyDown(tabs[2], { key: ' ' });
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });
});
