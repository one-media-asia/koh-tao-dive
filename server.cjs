const express = require('express');
const { requireAdmin } = require('./api/_lib/auth');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const 
PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));


const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const mutateFieldsForUnknown = (fields, unknownField) => {
  if (!unknownField || !Object.prototype.hasOwnProperty.call(fields, unknownField)) return null;

  const nextFields = { ...fields };
  const aliases = WRITE_ALIASES[unknownField] || [];
  const aliasTarget = aliases.find((alias) => !Object.prototype.hasOwnProperty.call(nextFields, alias));

  if (aliasTarget) {
    nextFields[aliasTarget] = nextFields[unknownField];
    delete nextFields[unknownField];
    return nextFields;
  }

  delete nextFields[unknownField];
  return nextFields;
};

const mapBooking = (record) => {
  const fields = record?.fields || {};

  const pickField = (keys = []) => {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(fields, key) && fields[key] !== undefined && fields[key] !== null) {
        return fields[key];
      }
    }
    return null;
  };

  const toNumberOr = (value, fallback = 0) => {
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  };

  const addonsTotal = pickField(['addons_total', 'Add-ons total', 'addonsTotal']);
  const subtotalAmount = pickField(['subtotal_amount', 'Subtotal amount', 'subtotalAmount']);
  const totalPayableNow = pickField(['total_payable_now', 'Total payable now', 'totalPayableNow']);

  return {
    id: pickField(['id']) || record.id,
    name: pickField(['name', 'Name']) || '',
    email: pickField(['email', 'Email']) || '',
    phone: pickField(['phone', 'Phone']),
    item_type: pickField(['item_type', 'Item type', 'itemType']),
    course_title: pickField(['course_title', 'Course/Dive', 'courseTitle']) || '',
    preferred_date: pickField(['preferred_date', 'Preferred Date', 'preferredDate']),
    experience_level: pickField(['experience_level', 'Experience Level', 'experienceLevel']),
    addons: pickField(['addons', 'Add-ons', 'addOns']),
    addons_json: pickField(['addons_json', 'Add-ons JSON', 'addonsJson']),
    addons_total: toNumberOr(addonsTotal, 0),
    subtotal_amount: subtotalAmount === null ? null : toNumberOr(subtotalAmount, 0),
    total_payable_now: totalPayableNow === null ? null : toNumberOr(totalPayableNow, 0),
    internal_notes: pickField(['internal_notes', 'Internal Notes', 'internalNotes']),
    message: pickField(['message', 'Message']),
    status: pickField(['status', 'Status']) || 'pending',
    created_at: pickField(['created_at', 'Created At', 'createdAt']),
    updated_at: pickField(['updated_at', 'Updated At', 'updatedAt']),
  };
};

const mapAffiliateClick = (record) => {
  const fields = record?.fields || {};
  return {
    id: fields.id || record.id,
    hotel_name: fields.hotel_name || '',
    hotel_url: fields.hotel_url || '',
    affiliate_id: fields.affiliate_id || null,
    clicked_at: fields.clicked_at || null,
    referrer: fields.referrer || null,
    user_agent: fields.user_agent || null,
  };
};

const findBookingRecordById = async (id) => {
  const escapedId = escapeFormulaValue(id);
  const runLookup = async (formula) => {
    const params = new URLSearchParams();
    params.set('maxRecords', '1');
    params.set('filterByFormula', formula);

    return { response, payload };
  };

  let { response, payload } = await runLookup(`OR({id}='${escapedId}',RECORD_ID()='${escapedId}')`);

  if (!response.ok && String(payload?.error?.message || '').includes('Unknown field name: "id"')) {
    ({ response, payload } = await runLookup(`RECORD_ID()='${escapedId}'`));
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Failed to query booking');
  }
  return payload.records?.[0] || null;
};

// Routes

app.get('/api/bookings', async (req, res) => {
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  if (!ensureAirtable(res)) return;
  const {
    id,
    name,
    email,
    phone,
    item_type
  } = req.body;

  // Compose fields for Airtable
  const fields = { id, name, email, phone, item_type };
  try {
    let response, payload;
    // Attempt to create booking, retry if unknown field error
    for (let attempts = 0; attempts < 3; attempts++) {
      response = await fetch(airtableUrl(BOOKINGS_TABLE), {
        method: 'POST',
        headers: airtableHeaders(),
        body: JSON.stringify({ fields }),
      });
      payload = await response.json();
      if (response.ok) {
        return res.status(201).json(mapBooking(payload));
      }
      const unknownField = parseUnknownFieldName(payload?.error?.message || '');
      const nextFields = mutateFieldsForUnknown(fields, unknownField);
      if (!nextFields) {
        return res.status(response?.status || 500).json({ error: payload?.error?.message || 'Failed to create booking' });
      }
      Object.assign(fields, nextFields);
    }
    return res.status(response?.status || 500).json({ error: payload?.error?.message || 'Failed to create booking' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  if (!ensureAirtable(res)) return;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'paid'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const record = await findBookingRecordById(id);
    if (!record) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const response = await fetch(`${airtableUrl(BOOKINGS_TABLE)}/${record.id}`, {
      method: 'PATCH',
      headers: airtableHeaders(),
      body: JSON.stringify({ fields: { status, updated_at: new Date().toISOString() } }),
    });
    const payload = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.error?.message || 'Failed to update status' });
    }

    return res.json({ message: 'Status updated', booking: mapBooking(payload) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


app.post('/api/bookings', async (req, res) => {
  const body = req.body;
  if (!body.name || !body.email) {
    return res.status(400).json({ error: 'Missing required fields: name and email' });
  }
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([body])
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/affiliate-clicks', async (req, res) => {
  if (!ensureAirtable(res)) return;
  try {
    const affiliateId = req.query?.affiliate_id;
    const limit = Number(req.query?.limit || 500);

    const paramsWithSort = new URLSearchParams();
    paramsWithSort.set('maxRecords', String(Number.isFinite(limit) ? Math.max(1, Math.min(limit, 1000)) : 500));
    paramsWithSort.set('sort[0][field]', 'clicked_at');
    paramsWithSort.set('sort[0][direction]', 'desc');

    if (affiliateId) {
      paramsWithSort.set('filterByFormula', `{affiliate_id}='${escapeFormulaValue(affiliateId)}'`);
    }

    let response = await fetch(airtableUrl(AFFILIATE_CLICKS_TABLE, paramsWithSort.toString()), {
      method: 'GET',
      headers: airtableHeaders(),
    });
    let payload = await response.json();

    if (!response.ok && payload?.error?.message?.includes('Unknown field name: "clicked_at"')) {
      const paramsNoSort = new URLSearchParams();
      paramsNoSort.set('maxRecords', String(Number.isFinite(limit) ? Math.max(1, Math.min(limit, 1000)) : 500));
      if (affiliateId) {
        paramsNoSort.set('filterByFormula', `{affiliate_id}='${escapeFormulaValue(affiliateId)}'`);
      }

      response = await fetch(airtableUrl(AFFILIATE_CLICKS_TABLE, paramsNoSort.toString()), {
        method: 'GET',
        headers: airtableHeaders(),
      });
      payload = await response.json();
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.error?.message || 'Failed to fetch affiliate clicks' });
    }

    return res.json((payload.records || []).map(mapAffiliateClick));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/affiliate-clicks', async (req, res) => {
  if (!ensureAirtable(res)) return;
  try {
    const { id, hotel_name, hotel_url, affiliate_id, referrer, user_agent, clicked_at } = req.body || {};
    if (!hotel_name || !hotel_url) {
      return res.status(400).json({ error: 'Missing required fields: hotel_name and hotel_url' });
    }

    const response = await fetch(airtableUrl(AFFILIATE_CLICKS_TABLE), {
      method: 'POST',
      headers: airtableHeaders(),
      body: JSON.stringify({
        fields: {
          id: id || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`),
          hotel_name,
          hotel_url,
          affiliate_id: affiliate_id || '',
          referrer: referrer || '',
          user_agent: user_agent || '',
          clicked_at: clicked_at || new Date().toISOString(),
        },
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.error?.message || 'Failed to create affiliate click' });
    }

    return res.status(201).json(mapAffiliateClick(payload));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Catch-all handler: send back index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});