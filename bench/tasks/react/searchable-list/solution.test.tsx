import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchableList } from './solution';

const ITEMS = ['Apple', 'Banana', 'Grape', 'Pineapple'];

describe('SearchableList', () => {
  it('shows all items initially', () => {
    render(<SearchableList items={ITEMS} />);
    const lis = screen.getAllByRole('listitem');
    expect(lis).toHaveLength(4);
  });

  it('filters case-insensitively', () => {
    render(<SearchableList items={ITEMS} />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'app' } });
    const lis = screen.getAllByRole('listitem');
    const texts = lis.map((li) => li.textContent);
    expect(texts).toEqual(['Apple', 'Pineapple']);
  });

  it('wraps the matched substring in a <mark> preserving original casing', () => {
    const { container } = render(<SearchableList items={['Pineapple']} />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'apple' } });
    const li = screen.getByRole('listitem');
    const mark = within(li).getByText('apple', { selector: 'mark' });
    expect(mark.tagName).toBe('MARK');
    expect(mark.textContent).toBe('apple');
    expect(li.textContent).toBe('Pineapple');
    expect(container.querySelectorAll('mark')).toHaveLength(1);
  });

  it('only marks the first occurrence', () => {
    render(<SearchableList items={['ababab']} />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'ab' } });
    const li = screen.getByRole('listitem');
    expect(within(li).getAllByText('ab', { selector: 'mark' })).toHaveLength(1);
    expect(li.textContent).toBe('ababab');
  });

  it('shows "No results" and no list when nothing matches', () => {
    render(<SearchableList items={ITEMS} />);
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'zzz' } });
    expect(screen.getByText('No results')).toBeTruthy();
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders no <mark> when the query is empty', () => {
    const { container } = render(<SearchableList items={ITEMS} />);
    expect(container.querySelectorAll('mark')).toHaveLength(0);
  });
});
