CREATE MIGRATION m13gtnecxfzuz7shjg7aq5x3zmdoznhe3tjxmjlcbtuj4gvzypck2q
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.5';
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE EXTENSION ai VERSION '1.0';
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE TYPE default::Function {
      CREATE REQUIRED PROPERTY expression: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (.expression);
  };
};
