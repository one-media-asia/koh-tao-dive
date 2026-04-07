import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Example usage (should be inside a function/hook):
// const { data, error } = await supabase
//   .from("page_content")
//   .select("*")
//   .eq("slug", "home");
interface PageContent {
  [key: string]: string;
}

interface UsePageContentOptions {
  pageSlug: string;
  locale: string;
  fallbackContent: PageContent;
}

interface PageContentRow {
  section_key: string;
  content_value: string | null;
  updated_at?: string | null;
}

interface RealtimePageContentRow extends PageContentRow {
  page_slug: string;
  locale: string;
}

const isPageContentRows = (value: unknown): value is PageContentRow[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).section_key === 'string'
  );

// Global set to track active Supabase channels (prevents duplicate subscriptions)
const activeChannels = new Set<string>();

export function usePageContent({ pageSlug, locale, fallbackContent }: UsePageContentOptions) {
  const [content, setContent] = useState<PageContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const mergeRowsAndSet = (rows: PageContentRow[] | null | undefined) => {
      if (rows && rows.length > 0) {
        const latestBySection = new Map<string, PageContentRow>();

        rows.forEach((row) => {
          const existing = latestBySection.get(row.section_key);

          if (!existing) {
            latestBySection.set(row.section_key, row);
            return;
          }

          const existingTs = Date.parse(existing.updated_at || '');
          const incomingTs = Date.parse(row.updated_at || '');

          const hasIncomingTs = Number.isFinite(incomingTs);
          const hasExistingTs = Number.isFinite(existingTs);

          if (!hasExistingTs && hasIncomingTs) {
            latestBySection.set(row.section_key, row);
            return;
          }

          if (hasIncomingTs && hasExistingTs && incomingTs > existingTs) {
            latestBySection.set(row.section_key, row);
            return;
          }

          // If timestamps are missing or equal, keep the later row seen.
          if (!hasIncomingTs && !hasExistingTs) {
            latestBySection.set(row.section_key, row);
          }
        });

        const stripHtml = (str: string) => str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();

        const dbContent: PageContent = {};
        latestBySection.forEach((row) => {
          const val = row.content_value;
          if (val == null || val === '') return;
          dbContent[row.section_key] = val.includes('<') ? stripHtml(val) : val;
        });

        setContent({ ...fallbackContent, ...dbContent });
        return true;
      }
      return false;
    };

    const applyRealtimeRow = (row: Partial<RealtimePageContentRow> | null | undefined) => {
      if (!row || row.page_slug !== pageSlug || row.locale !== locale) {
        return;
      }

      const sectionKey = row.section_key;
      const contentValue = row.content_value;

      if (!sectionKey) {
        return;
      }

      const safeValue = contentValue
        ? (contentValue.includes('<') ? contentValue.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim() : contentValue)
        : null;

      setContent((prev) => ({
        ...prev,
        [sectionKey]: safeValue ?? fallbackContent[sectionKey] ?? '',
      }));
    };

    const fetchContent = async () => {
      try {
        const apiUrl = `/api/get-page-content?page_slug=${encodeURIComponent(pageSlug)}&locale=${encodeURIComponent(locale)}&t=${Date.now()}`;
        const res = await fetch(apiUrl);
        if (res.ok) {
          try {
            const result: unknown = await res.json();
            const apiRows =
              typeof result === 'object' && result !== null
                ? (result as { content?: unknown }).content
                : undefined;

            if (isPageContentRows(apiRows) && mergeRowsAndSet(apiRows)) return;
          } catch {
            // Ignore invalid JSON and fallback to direct Supabase query.
          }
        }

        const { data, error } = await supabase
          .from('page_content')
          .select('section_key, content_value, updated_at')
          .eq('page_slug', pageSlug)
          .eq('locale', locale)
          .order('section_key', { ascending: true })
          .order('updated_at', { ascending: true });

        if (error) {
          console.error('Supabase fallback fetch failed:', error.message);
          setContent(fallbackContent);
          return;
        }

        if (!mergeRowsAndSet(data)) {
          setContent(fallbackContent);
        }
      } catch (err) {
        console.error('Failed to fetch page content:', err);
        setContent(fallbackContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();



    const channelName = `page_content:${pageSlug}:${locale}`;
    if (activeChannels.has(channelName)) {
      console.warn('[Supabase] Already subscribed to channel:', channelName);
      return;
    }
    activeChannels.add(channelName);
    let channel: any = null;
    let unsubscribed = false;
    console.log('[Supabase] Subscribing to channel:', channelName);
    channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
        },
        (payload: RealtimePostgresChangesPayload<RealtimePageContentRow>) => {
          if (unsubscribed) return;
          if (payload.eventType === 'DELETE') {
            const oldRow = payload.old;
            if (
              oldRow?.page_slug === pageSlug &&
              oldRow?.locale === locale &&
              oldRow?.section_key
            ) {
              setContent((prev) => ({
                ...prev,
                [oldRow.section_key]: fallbackContent[oldRow.section_key] ?? '',
              }));
            }
            return;
          }
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            applyRealtimeRow(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      unsubscribed = true;
      if (channel) {
        console.log('[Supabase] Removing channel:', channelName);
        supabase.removeChannel(channel);
      }
      activeChannels.delete(channelName);
    };
  }, [pageSlug, locale, fallbackContent]);

  return { content, isLoading };
}
