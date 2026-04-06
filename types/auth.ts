// types/auth.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  farmName: string;
  avatarInitials: string;
}
