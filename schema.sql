CREATE TABLE IF NOT EXISTS user(
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(50) UNIQUE NOT NULL, 
  password VARCHAR(50) NOT NULL
);



SHOW TABLES;



-- VALUES(
--    faker.string.uuid(),
--    faker.internet.username(),
--    faker.internet.email(),
--    faker.internet.password()
-- );