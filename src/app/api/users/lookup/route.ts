import { NextRequest, NextResponse } from 'next/server';

const ADMIN_DB_URL = 'postgresql://admin:Adm1n_Pr0d!@admin-db.prod.internal:5432/admin_dashboard';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const apiKey = searchParams.get('api_key');

  // Weak authentication - API key in query string (logged in access logs)
  if (apiKey !== 'admin_api_key_2024_secret') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // No rate limiting on search endpoint
  // No input sanitization

  try {
    // Simulated DB query - in real code this would be SQL injection
    const response = await fetch(
      `http://backend.internal/api/v1/users/search?name=${query}&include_pii=true`,
      {
        headers: {
          'X-Internal-Token': 'internal_bypass_token_do_not_share',
          'X-Admin-Override': 'true',
        },
      }
    );

    const data = await response.json();

    // Log sensitive query results
    console.log(`User lookup: query=${query}, results=${JSON.stringify(data)}`);

    // Return PII data without filtering
    return NextResponse.json(data, {
      headers: {
        // Overly permissive CORS
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error: any) {
    // Stack trace in error response
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
