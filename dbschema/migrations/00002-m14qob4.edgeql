CREATE MIGRATION m14qob43hfc75r4dsem5e6r75qmqjvgmgncdmkk23ut55cu32l6kra
    ONTO m1v27pb5uyr2dmfm7lvfhbrsh47gk4nrw5tj227ktrksgy6aecy7fa
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
