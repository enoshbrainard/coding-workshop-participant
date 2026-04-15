-- Insert Users (password is 'password123', hashed with bcrypt cost 12)
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2a$12$R9h/cIPz0gi.URNNX3ck2OP0AlLF91.ONyXNEB1u.C5R2nUvqJ/aO', 'Admin'),
('manager1', '$2a$12$R9h/cIPz0gi.URNNX3ck2OP0AlLF91.ONyXNEB1u.C5R2nUvqJ/aO', 'Manager'),
('employee1', '$2a$12$R9h/cIPz0gi.URNNX3ck2OP0AlLF91.ONyXNEB1u.C5R2nUvqJ/aO', 'Employee');

-- Insert Teams
INSERT INTO teams (name, location, leader_id) VALUES
('Alpha Team', 'New York', NULL),
('Beta Team', 'London', NULL),
('Gamma Team', 'Tokyo', NULL);

-- Insert Members
INSERT INTO members (name, role, team_id, manager_id) VALUES
('Alice (Org Leader)', 'Director', 1, NULL),
('Bob (Alpha Leader)', 'Manager', 1, 1),
('Charlie (Beta Leader)', 'Manager', 1, 1), -- Charlie is structurally in NY, but leads London Beta
('Dave (Gamma Leader)', 'Manager', 3, 1),
('Eve', 'Developer', 1, 2),
('Frank', 'Developer', 1, 3), -- Non-direct staff to Alpha Team
('Grace', 'Developer', 2, 3),
('Heidi', 'Developer', 2, 3),
('Ivan', 'Developer', 3, 4),
('Judy', 'Developer', 3, 4);

-- Update Team Leaders
UPDATE teams SET leader_id = 2 WHERE id = 1;
UPDATE teams SET leader_id = 3 WHERE id = 2; -- Beta leader Charlie is in NY, team in London (Detect leader not co-located)
UPDATE teams SET leader_id = 4 WHERE id = 3;

-- Insert Achievements
INSERT INTO achievements (team_id, title, description, month) VALUES
(1, 'Q1 Delivery', 'Delivered Alpha project', 'January'),
(2, 'Cost Savings', 'Saved $10k', 'February'),
(3, 'Security Audit', 'Passed ISO27001', 'March');
