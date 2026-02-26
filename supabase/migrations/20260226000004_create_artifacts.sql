-- Dashboard artifacts (live cards)
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_artifacts_idea_id ON artifacts(idea_id);

-- RLS
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view artifacts of own ideas"
  ON artifacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ideas WHERE ideas.id = artifacts.idea_id AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create artifacts for own ideas"
  ON artifacts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas WHERE ideas.id = artifacts.idea_id AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update artifacts of own ideas"
  ON artifacts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM ideas WHERE ideas.id = artifacts.idea_id AND ideas.user_id = auth.uid()
    )
  );
