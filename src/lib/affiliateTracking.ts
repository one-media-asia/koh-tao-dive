type AffiliateProvider = 'agoda' | 'booking' | 'trip';

type AffiliateClickInput = {
  provider: AffiliateProvider;
  destinationUrl: string;
  placement: 'hotel-card' | 'search-all';
  hotelName?: string;
  affiliateId?: string | null;
};

const SESSION_KEY = 'affiliate_click_session_id';

const getOrCreateSessionId = () => {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) {
      return existing;
    }

    const next = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return null;
  }
};

export const trackAffiliateClick = (input: AffiliateClickInput) => {
  const payload = {
    provider: input.provider,
    hotel_name: input.hotelName || null,
    hotel_url: input.destinationUrl,
    affiliate_id: input.affiliateId || null,
    placement: input.placement,
    page_path: window.location.pathname,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent || null,
    session_id: getOrCreateSessionId(),
    clicked_at: new Date().toISOString(),
  };

  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/affiliate-clicks', blob);
      return;
    }
  } catch {
    // Fall back to fetch below.
  }

  fetch('/api/affiliate-clicks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignore tracking failures so user navigation is never blocked.
  });
};
