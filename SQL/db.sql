CREATE TABLE Users (
            ID SERIAL PRIMARY KEY,
            UUID UUID UNIQUE,
            FullName VARCHAR(25) NOT NULL,
            Email VARCHAR(255) NOT NULL UNIQUE,
            Provider VARCHAR(50),
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            DeletedAt TIMESTAMP NULL
);

CREATE TABLE LoggedInHistory (
             ID SERIAL PRIMARY KEY,
             UserId INT NOT NULL REFERENCES Users(ID) ON DELETE CASCADE,
             SessionId VARCHAR(50),
             ForceSignOut BOOLEAN DEFAULT FALSE,
             CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             DeletedAt TIMESTAMP NULL
);