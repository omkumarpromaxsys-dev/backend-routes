CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'student';

CREATE INDEX idx_users_role ON users(role);

SELECT * from users;

DELETE FROM users where name = 'Test Provider';

CREATE TABLE provider_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_name VARCHAR(150) NOT NULL,
  description TEXT,
  contact_phone VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);

SELECT * from provider_profiles;

Update users
SET role = 'admin'
where email = 'admin@example.com'







CREATE TABLE pgs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    total_rooms INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO pgs (id, name, address, city, owner_id, total_rooms, is_verified)
VALUES
('pg_1a2b3c', 'Sai PG', 'Wakad Phase 2', 'Pune', 'user_101', 25, TRUE),
('pg_2b3c4d', 'Shiv Residency PG', 'Rajarampuri 4th Lane', 'Kolhapur', 'user_102', 18, TRUE);


SELECT * FROM pgs;

CREATE TABLE rooms (
    id TEXT PRIMARY KEY,
    pg_id TEXT NOT NULL,
    room_number TEXT,
    type TEXT,
    price INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (pg_id) REFERENCES pgs(id) ON DELETE CASCADE
);


INSERT INTO rooms (id, pg_id, room_number, type, price, is_available)
VALUES
('room_101a', 'pg_1a2b3c', '101', 'Single', 8000, TRUE),
('room_102a', 'pg_1a2b3c', '102', 'Double', 6000, TRUE),
('room_103a', 'pg_1a2b3c', '103', 'Triple', 5000, FALSE);


select * from rooms;

