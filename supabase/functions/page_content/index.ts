// Supabase Edge Function: CRUD for page_content table
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY');

function getIdFromUrl(url: string) {
  // Matches /page_content or /page_content/{id}
  const parts = url.split('/').filter(Boolean);
  const idx = parts.indexOf('page_content');
  if (idx !== -1 && parts.length > idx + 1) {
    return parts[idx + 1];
  }
  return null;
}

serve(async (req) => {
  const url = new URL(req.url);
  const id = getIdFromUrl(url.pathname);

  if (req.method === 'GET') {
    try {
      // Support filtering by id, page_slug, and locale
      const urlParams = new URL(req.url).searchParams;
      let fetchUrl = `${SUPABASE_URL}/rest/v1/page_content`;
      const filters = [];
      if (id) {
        filters.push(`id=eq.${id}`);
      }
      const pageSlug = urlParams.get('page_slug') || urlParams.get('id');
      const locale = urlParams.get('locale');
      if (pageSlug) {
        filters.push(`page_slug=eq.${pageSlug}`);
      }
      if (locale) {
        filters.push(`locale=eq.${locale}`);
      }
      if (filters.length > 0) {
        fetchUrl += '?' + filters.join('&');
      }
      const res = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
      });
      const text = await res.text();
      if (!res.ok) {
        return new Response(JSON.stringify({ error: text || 'Fetch failed' }), { status: res.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
      }
      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
    }
  }

  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization',
      },
    });
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      if (!body.created_at) body.created_at = new Date().toISOString();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/page_content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      if (!res.ok) {
        // Log error details for debugging
        console.error('Supabase POST error:', {
          status: res.status,
          statusText: res.statusText,
          response: text,
          sentBody: body
        });
        return new Response(JSON.stringify({ error: text || 'Insert failed', debug: { status: res.status, statusText: res.statusText, response: text, sentBody: body } }), { status: res.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
      }
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' },
      });
    } catch (err) {
      // Log error details for debugging
      console.error('Edge Function POST handler error:', err);
      return new Response(JSON.stringify({ error: err.message, debug: err }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
    }
  }

  if (req.method === 'PATCH') {
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing content id in URL' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
    }
    try {
      const body = await req.json();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/page_content?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      if (!res.ok) {
        return new Response(JSON.stringify({ error: text || 'Update failed' }), { status: res.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
      }
      return new Response(text, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization' } });
});
