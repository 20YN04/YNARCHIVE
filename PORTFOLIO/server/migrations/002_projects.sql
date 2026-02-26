-- Portfolio projecten (Work-pagina + rotor)
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(191) PRIMARY KEY COMMENT 'slug, bv. atlas-commerce',
  title VARCHAR(255) NOT NULL,
  year SMALLINT UNSIGNED NOT NULL,
  category VARCHAR(64) NOT NULL COMMENT 'E-commerce, SaaS, Landing Pages',
  url VARCHAR(512) DEFAULT NULL,
  image_url VARCHAR(512) NOT NULL,
  tags JSON DEFAULT NULL COMMENT 'array van strings',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
