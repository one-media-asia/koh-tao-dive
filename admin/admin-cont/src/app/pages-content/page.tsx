"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DiveSitePage = {
  id: string;
  slug: string;
  title: string;
  content: {
    overview: string;
    quickFacts: string[];
    whatYouCanSee: string;
    marineLifeHighlights: string[];
    divingTips: string;
  };
};

export default function PagesContentPage() {
  const [pages, setPages] = useState<DiveSitePage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("dive_site_pages")
        .select("*");
      if (error) {
        setError("Failed to fetch pages: " + error.message);
      } else {
        setPages(data || []);
      }
      setLoading(false);
    };
    fetchPages();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pages Content</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="space-y-8">
        {pages.map((page) => (
          <div key={page.id} className="border rounded p-4 bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">{page.title} <span className="text-gray-400 text-sm">({page.slug})</span></h2>
            <div className="mb-2">
              <strong>Overview:</strong>
              <div className="ml-2 text-gray-700">{page.content.overview}</div>
            </div>
            <div className="mb-2">
              <strong>Quick Facts:</strong>
              <ul className="ml-4 list-disc text-gray-700">
                {page.content.quickFacts.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <strong>What You Can See:</strong>
              <div className="ml-2 text-gray-700">{page.content.whatYouCanSee}</div>
            </div>
            <div className="mb-2">
              <strong>Marine Life Highlights:</strong>
              <ul className="ml-4 list-disc text-gray-700">
                {page.content.marineLifeHighlights.map((ml, i) => (
                  <li key={i}>{ml}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <strong>Diving Tips:</strong>
              <div className="ml-2 text-gray-700">{page.content.divingTips}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
