-- Startdata voor portfolio (alleen als er nog geen projecten zijn)
INSERT INTO projects (id, title, year, category, url, image_url, tags)
SELECT * FROM (
  SELECT 'atlas-commerce' AS id, 'Atlas Commerce' AS title, 2026 AS year, 'E-commerce' AS category, 'https://example.com' AS url, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80' AS image_url, '["Web","UI","Shop"]' AS tags
  UNION ALL SELECT 'nova-saas', 'Nova Platform', 2025, 'SaaS', 'https://example.com', 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1800&q=80', '["Dashboard","SaaS","Product"]'
  UNION ALL SELECT 'spline-landing', 'Spline Campaign', 2025, 'Landing Pages', 'https://example.com', 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1800&q=80', '["Launch","Motion","Brand"]'
  UNION ALL SELECT 'district-store', 'District Storefront', 2024, 'E-commerce', 'https://example.com', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1800&q=80', '["Checkout","CMS","Shop"]'
  UNION ALL SELECT 'pulse-suite', 'Pulse Suite', 2024, 'SaaS', 'https://example.com', 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1800&q=80', '["B2B","Data","UX"]'
  UNION ALL SELECT 'mono-launch', 'Mono Launch System', 2023, 'Landing Pages', 'https://example.com', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80', '["Landing","Design","Performance"]'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);
