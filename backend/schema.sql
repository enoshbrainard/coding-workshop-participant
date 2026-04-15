CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL -- Admin, Manager, Employee
);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    leader_id INT
);

CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    team_id INT REFERENCES teams(id),
    manager_id INT REFERENCES members(id)
);

ALTER TABLE teams ADD CONSTRAINT fk_leader FOREIGN KEY (leader_id) REFERENCES members(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id),
    title VARCHAR(255),
    description TEXT,
    month VARCHAR(20)
);
