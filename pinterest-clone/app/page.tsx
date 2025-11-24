'use client'

import { useState } from "react";
import Feed from './components/Feed'
import Header from './components/Header'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={(q) => setSearchQuery(q)} />
      <main className="pt-20">
        <Feed searchQuery={searchQuery} />
      </main>
    </div>
  );
}
