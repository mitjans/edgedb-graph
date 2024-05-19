CREATE MIGRATION m1c2sgxwik64eeeiqx66fx6deu2vuxuycl67pl2letunuioci2tppq
    ONTO m16h6s7negx72tb6le3plwnd6otmo66gpfpdk54bppltwt5yp4of4q
{
  ALTER TYPE default::User {
      ALTER LINK favourites {
          RENAME TO favorites;
      };
  };
};
