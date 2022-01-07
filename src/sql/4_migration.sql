DROP TABLE votes;
CREATE TABLE votes (
  optionID TEXT NOT NULL,
  ksuid TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,

  FOREIGN KEY(optionID) REFERENCES options(ksuid) ON DELETE CASCADE,
  FOREIGN KEY(token) REFERENCES stills(token) ON DELETE CASCADE,
  UNIQUE(optionID, token)
);
