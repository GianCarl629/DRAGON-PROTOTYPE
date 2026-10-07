# Dragon Treasure Project Architecture & Rules

## System Overview
Dragon Treasure Transient & Condotel Property Management & Online Booking System.

## Primary System Objectives
1. **Centralized Live Calendar**: Automatically update room availability in real-time, preventing double-booking conflicts across both short-term transient and long-term dormitory stays.
2. **Automate the Billing Process**: Automatically compute rental rates and utility readings (water and electricity meters), ensuring accurate invoice generation for all occupants without manual calculation.
3. **Integrate an AI Chat Assistant**: Provide a 24/7 virtual assistant that instantly handles inquiries regarding room rates, availability, and property policies.
4. **Build a Unified User Dashboard**: Single, integrated portal where all clients can monitor their booking status, inspect automated bills, and upload online payment proofs, paired with a secure administrative portal.

## Technical Architecture
- **Database**: Supabase PostgreSQL with real-time replication and double-booking protection.
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS with high-DPI custom cursor system.
- **Backend**: Express API server with Google Gemini 3.5 Flash Lite assistant endpoint.
- **Security**: Strict environment isolation, masked secrets, and Row Level Security (RLS) enforcement.