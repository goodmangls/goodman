import { z } from 'zod';

// Shared shipment fields used by both authenticated and public forms
const shipmentFields = {
  serviceType: z.enum(['AIR_FREIGHT', 'OCEAN_FCL', 'OCEAN_LCL', 'PROJECT_CARGO']),
  shipmentType: z.enum(['IMPORT', 'EXPORT', 'CROSS_TRADE']),
  origin: z.string().min(2, 'Origin is required').max(200),
  destination: z.string().min(2, 'Destination is required').max(200),
  cargoDetails: z.string().min(5, 'Cargo details must be at least 5 characters').max(2000),
  weight: z.number().positive('Weight must be positive').optional(),
  dimensions: z.string().max(200).optional(),
  commodity: z.string().max(200).optional(),
};

// Authenticated partner quote request
export const quoteRequestSchema = z.object({
  ...shipmentFields,
});

// Public (unauthenticated) quote request — requires guest contact info
export const publicQuoteRequestSchema = z.object({
  ...shipmentFields,
  guestName: z.string().min(2, 'Name is required').max(100),
  guestEmail: z.string().email('Please enter a valid email address'),
  guestCompany: z.string().min(2, 'Company name is required').max(200),
  guestPhone: z.string().max(30).optional(),
});

// Admin response to a quote
export const quoteResponseSchema = z.object({
  quotedRate: z.number().positive('Rate must be positive'),
  currency: z.string().min(3, 'Currency is required').max(3),
  validUntil: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  notes: z.string().max(2000).optional(),
});

// Partner status update (accept / cancel)
export const quoteStatusUpdateSchema = z.object({
  status: z.enum(['ACCEPTED', 'CANCELLED']),
});

// Quote list query params
export const quoteListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['PENDING', 'QUOTED', 'ACCEPTED', 'EXPIRED', 'CANCELLED']).optional(),
  serviceType: z.enum(['AIR_FREIGHT', 'OCEAN_FCL', 'OCEAN_LCL', 'PROJECT_CARGO']).optional(),
  search: z.string().max(200).optional(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
export type PublicQuoteRequestFormData = z.infer<typeof publicQuoteRequestSchema>;
export type QuoteResponseFormData = z.infer<typeof quoteResponseSchema>;
export type QuoteStatusUpdateData = z.infer<typeof quoteStatusUpdateSchema>;
export type QuoteListQuery = z.infer<typeof quoteListQuerySchema>;
