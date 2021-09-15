PRAGMA foreign_keys = ON;

CREATE TABLE boxes (
  ksuid TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE options (
  ksuid TEXT NOT NULL PRIMARY KEY,
  content TEXT NOT NULL,
  boxID TEXT NOT NULL,

  FOREIGN KEY(boxID) REFERENCES boxes(ksuid) ON DELETE CASCADE,
  UNIQUE(content, boxID)
);

DROP TABLE stills;
CREATE TABLE stills (
  token TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  priority NUMBER NOT NULL,

  UNIQUE(token, email, priority)
);

CREATE TABLE votes (
  optionID TEXT NOT NULL,
  token TEXT NOT NULL,

  FOREIGN KEY(optionID) REFERENCES options(ksuid) ON DELETE CASCADE,
  FOREIGN KEY(token) REFERENCES stills(token) ON DELETE CASCADE,
  UNIQUE(optionID, token)
);
