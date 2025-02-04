"use client";

import Table from './components/Table';

export default function Home() {

  return (
    <div>
      <section className="section">
        <div className="container">
          <h1 className="title">
            Test app
          </h1>
          <p className="subtitle">
            Countries and currencies 
          </p>
        </div>
      </section>
      <Table />
    </div>
  );
}
