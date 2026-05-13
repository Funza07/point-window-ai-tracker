CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE titles (
  id UUID PRIMARY KEY,
  external_id VARCHAR(120) NOT NULL,
  source VARCHAR(40) NOT NULL,
  title VARCHAR(255) NOT NULL,
  alt_title VARCHAR(255),
  type VARCHAR(20) NOT NULL,
  status VARCHAR(40),
  total_count INT,
  count_type VARCHAR(20),
  rating DECIMAL(3,1),
  genres JSONB DEFAULT '[]'::jsonb,
  synopsis TEXT,
  cover_url TEXT,
  banner_url TEXT,
  year INT,
  popularity INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_library (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title_id UUID REFERENCES titles(id),
  status VARCHAR(40),
  progress INT DEFAULT 0,
  score DECIMAL(3,1),
  notes TEXT,
  saved_link TEXT,
  last_opened_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  favorite_genres JSONB DEFAULT '[]'::jsonb,
  disliked_genres JSONB DEFAULT '[]'::jsonb,
  preferred_types JSONB DEFAULT '[]'::jsonb,
  spoiler_free BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title_id UUID REFERENCES titles(id),
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
