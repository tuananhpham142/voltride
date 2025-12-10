// src/types/profile.types.ts

export interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeCount?: number;
}

export interface BasicDetails {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | null;
}

export interface ContactDetails {
  mobileNumber: string;
  email: string;
}

export interface PersonalDetails {
  weight?: number;
  height?: number;
}

export interface ProfileFormData extends BasicDetails, ContactDetails, PersonalDetails {
  avatar?: string;
}

export type GenderOption = 'male' | 'female';

export const GENDER_OPTIONS: { label: string; value: GenderOption }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];
