--  Add default admin user and role with permission to access admin panel and create the default account

-- Enable uuid-ossp extension for uuid_generate_v4() function
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE PROCEDURE createUserWithRole()
LANGUAGE plpgsql
AS $$
DECLARE 
  admin_role_id UUID;
  admin_permission_id UUID;
  user_id UUID;
  account_id UUID;
BEGIN
  -- Create Role
  INSERT INTO "Role" (id, name, "createdAt", "updatedAt")
  VALUES (uuid_generate_v4(), 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING "id" INTO admin_role_id;

  -- Create Permission
  INSERT INTO "Permission" (id, name, "createdAt", "updatedAt")
  VALUES (uuid_generate_v4(), 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING "id" INTO admin_permission_id;

  -- Connect role with permission
  INSERT INTO "_PermissionToRole" ("A", "B")
  VALUES (admin_permission_id, admin_role_id);

  -- Create a user named "Satoshi Nakamoto" with username "satoshi"
  INSERT INTO "User" (id, name, username, "createdAt", "updatedAt")
  VALUES (uuid_generate_v4(), 'Satoshi Nakamoto', 'satoshi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING "id" INTO user_id;

  -- Connect user with admin role
  INSERT INTO "_RoleToUser" ("A", "B")
  VALUES (admin_role_id, user_id);

  -- Create a password for the user
  INSERT INTO "Password" (hash, "userId")
  VALUES ('$2a$10$4Medc9f4b2gOmHTTcoLzA.PcLJcmKHcoD2zeGVdaAm8VPZel5Stim', user_id);

  -- Create an account for the user
  INSERT INTO "Account" (id, name, "ownerId", "createdAt", "updatedAt")
  VALUES (uuid_generate_v4(), 'Initial Account', user_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  RETURNING "id" INTO account_id;
END;
$$;

-- Call the stored procedure
CALL createUserWithRole();

-- Drop the stored procedure after calling it
DROP PROCEDURE createUserWithRole();
