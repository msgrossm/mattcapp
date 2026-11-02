import { NextResponse } from 'next/server';

/**
 * D09 outside call: tickets issued per year in Onondaga County, from
 * data.ny.gov "Traffic Tickets Issued: Four Year Window" (q4hy-kbtf).
 * Answers the PRD §3 open item ("have the data source, haven't run the
 * query"). Nothing on a page calls this yet.
 *
 * The SODA 3 endpoint refuses requests without an app token (403
 * authentication_required). The token is read from NY_OPEN_DATA_APP_TOKEN
 * here on the server only, so it never reaches the browser.
 */

export const runtime = 'nodejs';

const QUERY_URL = 'https://data.ny.gov/api/v3/views/q4hy-kbtf/query.json';
const SOURCE_URL = 'https://data.ny.gov/Transportation/Traffic-Tickets-Issued-Four-Year-Window/q4hy-kbtf';

/** Court names in this dataset start with the county: "Onondaga County, City of Syracuse". */
const ONONDAGA_BY_YEAR = `SELECT violation_year, count(*) AS tickets
WHERE court LIKE 'Onondaga County,%'
GROUP BY violation_year
ORDER BY violation_year`;

/** GET — Onondaga County ticket counts by year, straight from data.ny.gov. */
export async function GET() {
  const token = process.env.NY_OPEN_DATA_APP_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'missing_token', message: 'NY_OPEN_DATA_APP_TOKEN is not set in .env.local.' },
      { status: 500 },
    );
  }

  let response: Response;
  try {
    response = await fetch(QUERY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Token': token },
      body: JSON.stringify({ query: ONONDAGA_BY_YEAR, page: { pageNumber: 1, pageSize: 100 } }),
      cache: 'no-store',
    });
  } catch (error) {
    console.error('[ny-tickets] request failed', error);
    return NextResponse.json(
      { error: 'unreachable', message: "Couldn't reach data.ny.gov. Try again." },
      { status: 502 },
    );
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    console.error('[ny-tickets] data.ny.gov answered', response.status, body);
    return NextResponse.json(
      { error: 'upstream_error', upstreamStatus: response.status, detail: body },
      { status: 502 },
    );
  }

  return NextResponse.json({ county: 'Onondaga', source_url: SOURCE_URL, years: body });
}
