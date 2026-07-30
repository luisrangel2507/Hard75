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

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO app_settings (key, value)
VALUES ('lang', 'es')
ON CONFLICT (key) DO NOTHING;
