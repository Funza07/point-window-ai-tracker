CREATE TABLE IF NOT EXISTS user_library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  title_id VARCHAR(150) NOT NULL,
  status ENUM('Planning','Watching','Reading','Completed','Dropped') DEFAULT 'Planning',
  progress INT DEFAULT 0,
  score DECIMAL(3,1) NULL,
  notes TEXT NULL,
  saved_link TEXT NULL,
  last_opened_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_title (user_id, title_id)
);

CREATE TABLE IF NOT EXISTS titles (
  id VARCHAR(150) PRIMARY KEY,
  external_id VARCHAR(100) NULL,
  source VARCHAR(50) DEFAULT 'mock',
  title VARCHAR(255) NOT NULL,
  alt_title VARCHAR(255) NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NULL,
  total_count INT DEFAULT 0,
  rating DECIMAL(3,1) NULL,
  genres JSON NULL,
  synopsis TEXT NULL,
  cover_url TEXT NULL,
  banner_url TEXT NULL,
  popularity INT DEFAULT 0,
  year INT DEFAULT 0,
  reason TEXT NULL,
  site_url TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
