CREATE MIGRATION m1ddjhlddggyjppocdh7c5uqoa7tnymyudurphbndjbt7ezeihyarq
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.5';
  CREATE EXTENSION ai VERSION '1.0';
  CREATE TYPE default::Function {
      CREATE REQUIRED PROPERTY expression: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (.expression);
  };
};
