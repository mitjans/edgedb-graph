interface User {
  id: string;
  favorites: Array<{ id: string; expression: string }>;
}

export const useUser = () => {
  const user = useState<User | null>('user', () => null);

  return {
    user,
  };
};
