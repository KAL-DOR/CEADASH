
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'demo@ceadash.com',
  '$2a$10$rHPqQZJQVVVVVVVVVVVVVuu7i5ZqKh5vu5Q7h0J3Q5J3Q5J3Q5J3Q', -- hashed "demo123"
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Usuario Demo"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);

-- Step 2: Ensure the profile exists and links to demo org
INSERT INTO public.profiles (id, organization_id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'demo@ceadash.com',
  'Usuario Demo',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  organization_id = '00000000-0000-0000-0000-000000000001',
  email = 'demo@ceadash.com',
  full_name = 'Usuario Demo',
  role = 'admin';

-- Step 3: Verify it was created
SELECT 'Demo user created!' as message;
SELECT id, email, role FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000002';
SELECT id, email, organization_id FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000002';

