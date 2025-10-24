-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read donations (for leaderboard)
CREATE POLICY "Anyone can view donations"
ON public.donations
FOR SELECT
USING (true);

-- Allow anyone to insert donations
CREATE POLICY "Anyone can add donations"
ON public.donations
FOR INSERT
WITH CHECK (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_donations_amount ON public.donations (amount DESC, created_at DESC);