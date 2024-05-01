using extension ai;

module default {
  type Function {
    required expression: str {
      constraint exclusive;
    };
    deferred index
      ext::ai::index(embedding_model := 'text-embedding-3-small') on (.expression);
  }
}
