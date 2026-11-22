


export interface Conversation {
  _id: string;
  title?: string;
  createdAt?: string;
}

export interface UserData {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ArtifactFile {
  name: string;
  content: string;
}

export interface GeneratedArtifact {
  title: string;
  files: ArtifactFile[];
}

export interface Message {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  images: string[];
  artifacts?: GeneratedArtifact[];
  createdAt?: string;
}
