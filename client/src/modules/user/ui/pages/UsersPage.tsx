'use client';

import { useState } from 'react';

export function UsersPage(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Users Module</h1>
        <p className="text-gray-600 mb-4">Pending implementation</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Count: {count}
        </button>
      </div>
    </main>
  );
}
