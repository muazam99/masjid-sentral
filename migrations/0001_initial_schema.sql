-- ─────────────────────────────────────────
-- REFERENCE TABLES
-- ─────────────────────────────────────────

-- Destructive reset for Cloudflare D1.
-- Run this only when you want to remove the previous Supabase-shaped tables.
PRAGMA foreign_keys = OFF;

DROP VIEW IF EXISTS mosque_list_view;
DROP TABLE IF EXISTS mosque_social_links;
DROP TABLE IF EXISTS mosques;
DROP TABLE IF EXISTS districts;

DROP TABLE IF EXISTS masjid_event_images;
DROP TABLE IF EXISTS masjid_events;
DROP TABLE IF EXISTS masjid_reviews;
DROP TABLE IF EXISTS masjid_contacts;
DROP TABLE IF EXISTS masjid_facilities;
DROP TABLE IF EXISTS masjid_images;
DROP TABLE IF EXISTS masjids;
DROP TABLE IF EXISTS masjid_types;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS countries;

PRAGMA foreign_keys = ON;

CREATE TABLE countries (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE  -- 'MY', 'SG', 'BN', 'ID'
);

CREATE TABLE states (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  country_id TEXT NOT NULL REFERENCES countries(id)
);
CREATE INDEX idx_states_country ON states(country_id);

CREATE TABLE cities (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  state_id TEXT NOT NULL REFERENCES states(id)
);
CREATE INDEX idx_cities_state ON cities(state_id);

CREATE TABLE masjid_types (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL UNIQUE,
  name_en TEXT
);

-- ─────────────────────────────────────────
-- CORE
-- ─────────────────────────────────────────

CREATE TABLE masjids (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  type_id          TEXT NOT NULL REFERENCES masjid_types(id),

  lat              REAL NOT NULL,
  lng              REAL NOT NULL,
  geohash          TEXT NOT NULL,

  city_id          TEXT REFERENCES cities(id),
  state_id         TEXT NOT NULL REFERENCES states(id),
  country_id       TEXT NOT NULL REFERENCES countries(id),

  address          TEXT,
  description      TEXT,

  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'deleted')),
  deleted_at       TEXT,

  jumaat_available INTEGER NOT NULL DEFAULT 0,
  telephone        TEXT,
  email            TEXT,
  google_url       TEXT,

  source           TEXT NOT NULL DEFAULT 'manual',

  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_masjids_geohash  ON masjids(geohash);
CREATE INDEX idx_masjids_lat_lng  ON masjids(lat, lng);
CREATE INDEX idx_masjids_city     ON masjids(city_id);
CREATE INDEX idx_masjids_state    ON masjids(state_id);
CREATE INDEX idx_masjids_country  ON masjids(country_id);
CREATE INDEX idx_masjids_status   ON masjids(status);
CREATE INDEX idx_masjids_type     ON masjids(type_id);

-- ─────────────────────────────────────────
-- EXTENDED TABLES
-- ─────────────────────────────────────────

CREATE TABLE masjid_images (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  masjid_id     INTEGER NOT NULL REFERENCES masjids(id) ON DELETE CASCADE,
  path          TEXT NOT NULL,
  is_thumbnail  INTEGER NOT NULL DEFAULT 0,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_masjid_images_masjid ON masjid_images(masjid_id);

CREATE TABLE masjid_facilities (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  masjid_id INTEGER NOT NULL REFERENCES masjids(id) ON DELETE CASCADE,
  facility  TEXT NOT NULL
);
CREATE INDEX idx_masjid_facilities_masjid ON masjid_facilities(masjid_id);

CREATE TABLE masjid_contacts (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  masjid_id INTEGER NOT NULL REFERENCES masjids(id) ON DELETE CASCADE,
  type      TEXT NOT NULL CHECK (type IN ('facebook','instagram','twitter','youtube','whatsapp','tiktok','threads')),
  value     TEXT NOT NULL
);
CREATE INDEX idx_masjid_contacts_masjid ON masjid_contacts(masjid_id);

CREATE TABLE masjid_reviews (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  masjid_id      INTEGER NOT NULL REFERENCES masjids(id) ON DELETE CASCADE,
  rating         INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
  message        TEXT,
  source_app     TEXT NOT NULL,
  source_user_id TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_masjid_reviews_masjid ON masjid_reviews(masjid_id);

CREATE TABLE masjid_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  masjid_id   INTEGER NOT NULL REFERENCES masjids(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  start_at    TEXT NOT NULL,
  end_at      TEXT,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'cancelled', 'completed')),
  rrule          TEXT,            -- RFC 5545 recurrence rule; null = one-time event
  source_app     TEXT NOT NULL,
  source_user_id TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_masjid_events_masjid ON masjid_events(masjid_id);
CREATE INDEX idx_masjid_events_start  ON masjid_events(start_at);

CREATE TABLE masjid_event_images (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id     INTEGER NOT NULL REFERENCES masjid_events(id) ON DELETE CASCADE,
  path         TEXT NOT NULL,
  is_thumbnail INTEGER NOT NULL DEFAULT 0,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_masjid_event_images_event ON masjid_event_images(event_id);

-- ─────────────────────────────────────────
-- SEED: REFERENCE DATA
-- ─────────────────────────────────────────

INSERT INTO countries VALUES ('my', 'Malaysia',  'MY');
INSERT INTO countries VALUES ('sg', 'Singapore', 'SG');
INSERT INTO countries VALUES ('bn', 'Brunei',    'BN');
INSERT INTO countries VALUES ('id', 'Indonesia', 'ID');

INSERT INTO masjid_types VALUES ('masjid',  'masjid',  'Mosque');
INSERT INTO masjid_types VALUES ('surau',   'surau',   'Prayer Room');
INSERT INTO masjid_types VALUES ('musolla', 'musolla', 'Musolla');

INSERT INTO states VALUES ('my-jhr', 'Johor',              'my');
INSERT INTO states VALUES ('my-kdh', 'Kedah',              'my');
INSERT INTO states VALUES ('my-ktn', 'Kelantan',           'my');
INSERT INTO states VALUES ('my-mlk', 'Melaka',             'my');
INSERT INTO states VALUES ('my-nsn', 'Negeri Sembilan',    'my');
INSERT INTO states VALUES ('my-phg', 'Pahang',             'my');
INSERT INTO states VALUES ('my-prk', 'Perak',              'my');
INSERT INTO states VALUES ('my-pls', 'Perlis',             'my');
INSERT INTO states VALUES ('my-png', 'Pulau Pinang',       'my');
INSERT INTO states VALUES ('my-sbh', 'Sabah',              'my');
INSERT INTO states VALUES ('my-swk', 'Sarawak',            'my');
INSERT INTO states VALUES ('my-sgr', 'Selangor',           'my');
INSERT INTO states VALUES ('my-trg', 'Terengganu',         'my');
INSERT INTO states VALUES ('my-kul', 'W.P. Kuala Lumpur',  'my');
INSERT INTO states VALUES ('my-lbn', 'W.P. Labuan',        'my');
INSERT INTO states VALUES ('my-pjy', 'W.P. Putrajaya',     'my');
-- Destructive reset for Cloudflare D1.
-- Run this only when you want to remove the previous Supabase-shaped tables.
PRAGMA foreign_keys = OFF;

DROP VIEW IF EXISTS mosque_list_view;
DROP TABLE IF EXISTS mosque_social_links;
DROP TABLE IF EXISTS mosques;
DROP TABLE IF EXISTS districts;

DROP TABLE IF EXISTS masjid_event_images;
DROP TABLE IF EXISTS masjid_events;
DROP TABLE IF EXISTS masjid_reviews;
DROP TABLE IF EXISTS masjid_contacts;
DROP TABLE IF EXISTS masjid_facilities;
DROP TABLE IF EXISTS masjid_images;
DROP TABLE IF EXISTS masjids;
DROP TABLE IF EXISTS masjid_types;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS countries;

PRAGMA foreign_keys = ON;
