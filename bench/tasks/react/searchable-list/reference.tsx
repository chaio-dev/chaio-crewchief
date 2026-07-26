import { useState } from 'react';

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}

export function SearchableList(props: { items: string[] }) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const shown = query ? props.items.filter((i) => i.toLowerCase().includes(q)) : props.items;

  return (
    <div>
      <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      {shown.length === 0 ? (
        <p>No results</p>
      ) : (
        <ul>
          {shown.map((item) => (
            <li key={item}>{highlight(item, query)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
