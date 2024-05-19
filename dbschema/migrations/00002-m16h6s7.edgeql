CREATE MIGRATION m16h6s7negx72tb6le3plwnd6otmo66gpfpdk54bppltwt5yp4of4q
    ONTO m13gtnecxfzuz7shjg7aq5x3zmdoznhe3tjxmjlcbtuj4gvzypck2q
{
  ALTER TYPE default::User {
      CREATE MULTI LINK favourites: default::Function;
  };
};
