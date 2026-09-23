CREATE TABLE IF NOT EXISTS challenge_days (
  id SERIAL PRIMARY KEY,
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number BETWEEN 1 AND 75),
  indoor_workout BOOLEAN DEFAULT FALSE,
  outdoor_workout BOOLEAN DEFAULT FALSE,
  diet BOOLEAN DEFAULT FALSE,
  book BOOLEAN DEFAULT FALSE,
  water_ml INTEGER DEFAULT 0,
  weight_kg NUMERIC(5,1),
  notes TEXT DEFAULT '',
  progress_photo_url TEXT,
  breakfast_photo_url TEXT,
  lunch_photo_url TEXT,
  dinner_photo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE challenge_days ADD COLUMN IF NOT EXISTS indoor_type TEXT;
ALTER TABLE challenge_days ADD COLUMN IF NOT EXISTS indoor_type_custom TEXT;
ALTER TABLE challenge_days ADD COLUMN IF NOT EXISTS outdoor_type TEXT;
ALTER TABLE challenge_days ADD COLUMN IF NOT EXISTS outdoor_type_custom TEXT;
ALTER TABLE challenge_days ADD COLUMN IF NOT EXISTS calories INTEGER;

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO app_settings (key, value)
VALUES ('lang', 'es')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  total_pages INTEGER,
  current_page INTEGER DEFAULT 0,
  cover_url TEXT,
  status TEXT DEFAULT 'reading',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  page INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
