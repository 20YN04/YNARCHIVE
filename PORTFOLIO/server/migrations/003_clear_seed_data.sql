-- Verwijder voorbeeldprojecten als die ooit zijn toegevoegd (schone DB)
DELETE FROM projects WHERE id IN (
  'atlas-commerce', 'nova-saas', 'spline-landing',
  'district-store', 'pulse-suite', 'mono-launch'
);
