-- Seed data for users table
INSERT INTO users (name, company_name, plan_tier, usage_count, is_whale) VALUES
-- Whales (Enterprise, High Usage)
('Alice Sterling', 'Sterling Corp', 'Enterprise', 15420, TRUE),
('Robert Chen', 'Chen Dynamics', 'Enterprise', 12300, TRUE),
('Sarah Jenkins', 'Jenkins Global', 'Enterprise', 9800, TRUE),
('Michael Ross', 'Ross Logistics', 'Enterprise', 11250, TRUE),
('Emily Blunt', 'Blunt Innovations', 'Enterprise', 14500, TRUE),
('David Kim', 'Kim Industries', 'Enterprise', 10100, TRUE),
('Jessica Pearson', 'Pearson Hardman', 'Enterprise', 16700, TRUE),
('Harvey Specter', 'Specter Litt', 'Enterprise', 20000, TRUE),
('Louis Litt', 'Litt Wheeler', 'Enterprise', 13400, TRUE),
('Donna Paulsen', 'Paulsen Consulting', 'Enterprise', 18900, TRUE),

-- Students/Free Users (Low Usage)
('John Doe', 'University of Tech', 'Free', 45, FALSE),
('Jane Smith', 'State College', 'Free', 12, FALSE),
('Bob Johnson', 'City High', 'Free', 78, FALSE),
('Alice Cooper', 'Music Academy', 'Free', 34, FALSE),
('Charlie Brown', 'Peanuts Inc', 'Free', 56, FALSE),
('Diana Prince', 'Themyscira U', 'Free', 89, FALSE),
('Barry Allen', 'Central City U', 'Free', 23, FALSE),
('Hal Jordan', 'Coast City College', 'Free', 67, FALSE),
('Arthur Curry', 'Atlantis High', 'Free', 15, FALSE),
('Victor Stone', 'Cyborg Tech', 'Free', 92, FALSE);
