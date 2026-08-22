import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TripSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  title: z.string().min(1, "Trip title is required").max(100, "Trip title is too long"),
  destination: z.string().min(1, "Destination is required"),
  description: z.string().max(500).optional(),
  startDate: z.string(),
  endDate: z.string(),
  travelers: z.number().int().min(1),
  budget: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  coverImage: z.string().url().optional(),
  interests: z.array(z.string()).default([]),
  status: z.enum(["planning", "upcoming", "ongoing", "completed"]).default("planning"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const CountrySchema = z.object({
  code: z.string().length(2),
  name: z.string(),
  region: z.string().optional(),
});

export const CitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  countryCode: z.string().length(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const ActivitySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Activity title is required"),
  description: z.string().optional(),
  cityId: z.string().uuid(),
  durationMinutes: z.number().positive().optional(),
  estimatedCost: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
});
