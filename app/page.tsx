import Link from 'next/link';

export default function Home() {
  return (
    <main className="page">
      <h1 className="page__title">
        Ticket <span>FIX</span>
      </h1>

      <div className="scan">
        <h2>Got a New York traffic ticket?</h2>
        <p>
          Photograph it and we&apos;ll read the violation off it, then show the
          points and the cost range with the source for every number.
        </p>
        <p>
          <Link className="btn btn--dark" href="/scan">
            Scan my ticket
          </Link>{' '}
          <Link className="btn" href="/tickets">
            My tickets
          </Link>
        </p>
      </div>
    </main>
  );
}
