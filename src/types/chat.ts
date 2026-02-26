export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
};

export type ArtifactUpdate = {
  type: string;
  data: Record<string, unknown>;
};
