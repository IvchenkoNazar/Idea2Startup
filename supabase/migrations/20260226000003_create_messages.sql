-- Chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_idea_id ON messages(idea_id);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of own ideas"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ideas WHERE ideas.id = messages.idea_id AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for own ideas"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas WHERE ideas.id = messages.idea_id AND ideas.user_id = auth.uid()
    )
  );
