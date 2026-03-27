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

export function usePageContent({ pageSlug, locale, fallbackContent }: UsePageContentOptions) {
  const [content, setContent] = useState<PageContent>(fallbackContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const mergeRowsAndSet = (rows: any[] | null | undefined) => {
      if (rows && rows.length > 0) {
        const dbContent: PageContent = {};
        rows.forEach((row: any) => {
          dbContent[row.section_key] = row.content_value;
        });
        setContent({ ...fallbackContent, ...dbContent });
        return true;
      }
      return false;
    };

    const applyRealtimeRow = (row: any) => {
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
            const result = await res.json();
            if (mergeRowsAndSet(result?.content)) return;
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
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as any;
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
            applyRealtimeRow(payload.new as any);
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
