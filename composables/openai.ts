export const useOpenAi = () => {
  const key = useLocalStorage<string>('openai', '');

  const fetchEmbedding = async (text: string) => {
    if (key.value === null) return;

    const { data } = await $fetch<{ data: { embedding: number[] }[] }>('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key.value}` },
      body: {
        input: text,
        model: 'text-embedding-3-small',
      },
    });

    return data[0].embedding;
  };

  return {
    key,
    fetchEmbedding,
  };
};
