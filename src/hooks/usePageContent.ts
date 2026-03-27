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
  page_slug: string;
  locale: string;
  section_key: string;
  content_value: string | null;
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
        const dbContent: PageContent = {};
        rows.forEach((row) => {
          dbContent[row.section_key] = row.content_value;
        });
        setContent({ ...fallbackContent, ...dbContent });
        return true;
      }
      return false;
    };

    const applyRealtimeRow = (row: Partial<PageContentRow> | null | undefined) => {
      if (!row || row.page_slug !== pageSlug || row.locale !== locale) {
        return;
      }

      const sectionKey = row.section_key;
      const contentValue = row.content_value;

      if (!sectionKey) {
        return;
      }

      setContent((prev) => ({
        ...prev,
        [sectionKey]: contentValue ?? fallbackContent[sectionKey] ?? '',
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
          .select('section_key, content_value')
          .eq('page_slug', pageSlug)
          .eq('locale', locale)
          .order('section_key', { ascending: true });

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

    const channel = supabase
      .channel(`page_content:${pageSlug}:${locale}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
        },
        (payload: RealtimePostgresChangesPayload<PageContentRow>) => {
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
      supabase.removeChannel(channel);
    };
  }, [pageSlug, locale, fallbackContent]);

  return { content, isLoading };
}
