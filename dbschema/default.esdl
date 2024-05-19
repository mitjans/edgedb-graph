using extension ai;
using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required identity: ext::auth::Identity {
      constraint exclusive;
    };
    multi favorites: Function;
  }

  type Function {
    required expression: str {
      constraint exclusive;
    };
    deferred index
      ext::ai::index(embedding_model := 'text-embedding-3-small') on (.expression);
  }
}
