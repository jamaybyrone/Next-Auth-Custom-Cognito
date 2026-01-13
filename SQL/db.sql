CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            uuid UUID UNIQUE,
            full_name VARCHAR(25) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            provider VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL
);

CREATE TABLE logged_in_history (
             id SERIAL PRIMARY KEY,
             user_id INT NOT NULL REFERENCES Users(ID) ON DELETE CASCADE,
             session_id VARCHAR(50),
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             deleted_at TIMESTAMP NULL
);