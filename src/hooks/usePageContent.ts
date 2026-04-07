import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
          if (!hasIncomingTs && !hasExistingTs) {
            latestBySection.set(row.section_key, row);
          }
        });
        const dbContent: PageContent = {};
        latestBySection.forEach((row) => {
          const val = row.content_value;
          dbContent[row.section_key] = val ? val : '';
        });
        setContent(dbContent);
        return true;
      }
      return false;
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


    // Use a unique channel name for each effect run to avoid Supabase join errors
    const uniqueId = Math.random().toString(36).substring(2, 10) + Date.now();
    const channelName = `page_content:${pageSlug}:${locale}:${uniqueId}`;

    let channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
        },
        (payload: RealtimePostgresChangesPayload<RealtimePageContentRow>) => {
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
            setContent((prev) => ({
              ...prev,
              [payload.new.section_key]: payload.new.content_value ?? fallbackContent[payload.new.section_key] ?? '',
            }));
          }
        }
      );
    channel.subscribe();

    return () => {
      if (channel) {
        channel.unsubscribe && channel.unsubscribe();
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, [pageSlug, locale, fallbackContent]);

  return { content, isLoading };
}
