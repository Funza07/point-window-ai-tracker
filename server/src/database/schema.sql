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
