CREATE TABLE stills (
  token TEXT NOT NULL PRIMARY KEY,
  priority NUMBER NOT NULL,
  UNIQUE(token, priority)
)
