export interface MockFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "docx" | "code" | "spreadsheet" | "video" | "audio";
  size: number;
  path: string;
  tags: string[];
  embedding: number[];
  date: string;
  preview?: string;
}

const fileNames: { name: string; type: MockFile["type"]; tags: string[]; path: string }[] = [
  { name: "birthday_party_2024.jpg", type: "image", tags: ["birthday", "party", "cake", "celebration"], path: "/Photos/Events/" },
  { name: "family_reunion_beach.jpg", type: "image", tags: ["family", "beach", "summer", "group photo"], path: "/Photos/Family/" },
  { name: "machine_learning_notes.pdf", type: "pdf", tags: ["AI", "machine learning", "neural networks", "study"], path: "/Documents/Research/" },
  { name: "invoice_march_2024.pdf", type: "pdf", tags: ["invoice", "march", "finance", "payment"], path: "/Documents/Finance/" },
  { name: "project_proposal_v2.docx", type: "docx", tags: ["project", "proposal", "business", "draft"], path: "/Documents/Work/" },
  { name: "sunset_golden_gate.jpg", type: "image", tags: ["sunset", "bridge", "landscape", "travel"], path: "/Photos/Travel/" },
  { name: "quarterly_report_Q1.pdf", type: "pdf", tags: ["report", "quarterly", "finance", "Q1"], path: "/Documents/Reports/" },
  { name: "wedding_ceremony.jpg", type: "image", tags: ["wedding", "ceremony", "love", "celebration"], path: "/Photos/Events/" },
  { name: "python_data_analysis.py", type: "code", tags: ["python", "data", "analysis", "pandas"], path: "/Projects/DataScience/" },
  { name: "react_dashboard.tsx", type: "code", tags: ["react", "dashboard", "typescript", "frontend"], path: "/Projects/WebDev/" },
  { name: "budget_2024.xlsx", type: "spreadsheet", tags: ["budget", "finance", "2024", "planning"], path: "/Documents/Finance/" },
  { name: "team_photo_offsite.jpg", type: "image", tags: ["team", "offsite", "corporate", "group"], path: "/Photos/Work/" },
  { name: "deep_learning_paper.pdf", type: "pdf", tags: ["deep learning", "research", "paper", "neural networks"], path: "/Documents/Research/" },
  { name: "vacation_hawaii_snorkel.jpg", type: "image", tags: ["vacation", "hawaii", "snorkeling", "ocean"], path: "/Photos/Travel/" },
  { name: "api_documentation.md", type: "code", tags: ["API", "documentation", "markdown", "reference"], path: "/Projects/Backend/" },
  { name: "contract_client_abc.pdf", type: "pdf", tags: ["contract", "client", "legal", "agreement"], path: "/Documents/Legal/" },
  { name: "christmas_dinner_2023.jpg", type: "image", tags: ["christmas", "dinner", "family", "holiday"], path: "/Photos/Events/" },
  { name: "database_schema.sql", type: "code", tags: ["SQL", "database", "schema", "migration"], path: "/Projects/Backend/" },
  { name: "presentation_pitch.pptx", type: "docx", tags: ["presentation", "pitch", "startup", "slides"], path: "/Documents/Work/" },
  { name: "cat_sleeping_desk.jpg", type: "image", tags: ["cat", "pet", "cute", "desk"], path: "/Photos/Pets/" },
  { name: "tax_return_2023.pdf", type: "pdf", tags: ["tax", "return", "2023", "finance"], path: "/Documents/Finance/" },
  { name: "graduation_ceremony.jpg", type: "image", tags: ["graduation", "ceremony", "achievement", "university"], path: "/Photos/Events/" },
  { name: "server_config.yaml", type: "code", tags: ["server", "config", "yaml", "devops"], path: "/Projects/Infrastructure/" },
  { name: "meeting_notes_standup.docx", type: "docx", tags: ["meeting", "notes", "standup", "agile"], path: "/Documents/Work/" },
  { name: "mountain_hiking_trail.jpg", type: "image", tags: ["mountain", "hiking", "nature", "trail"], path: "/Photos/Travel/" },
  { name: "user_research_findings.pdf", type: "pdf", tags: ["UX", "research", "user", "findings"], path: "/Documents/Research/" },
  { name: "docker_compose.yml", type: "code", tags: ["docker", "compose", "containers", "devops"], path: "/Projects/Infrastructure/" },
  { name: "recipe_pasta_carbonara.docx", type: "docx", tags: ["recipe", "pasta", "cooking", "italian"], path: "/Documents/Personal/" },
  { name: "concert_live_music.jpg", type: "image", tags: ["concert", "music", "live", "entertainment"], path: "/Photos/Events/" },
  { name: "expense_report_feb.pdf", type: "pdf", tags: ["expense", "report", "february", "finance"], path: "/Documents/Finance/" },
  { name: "neural_network_model.h5", type: "code", tags: ["neural network", "model", "AI", "trained"], path: "/Projects/AI/" },
  { name: "product_roadmap_2024.docx", type: "docx", tags: ["roadmap", "product", "strategy", "2024"], path: "/Documents/Work/" },
  { name: "selfie_paris_eiffel.jpg", type: "image", tags: ["selfie", "paris", "eiffel tower", "travel"], path: "/Photos/Travel/" },
  { name: "kubernetes_deploy.yaml", type: "code", tags: ["kubernetes", "deploy", "k8s", "cloud"], path: "/Projects/Infrastructure/" },
  { name: "insurance_policy.pdf", type: "pdf", tags: ["insurance", "policy", "coverage", "legal"], path: "/Documents/Legal/" },
  { name: "dog_park_playing.jpg", type: "image", tags: ["dog", "park", "pet", "playing"], path: "/Photos/Pets/" },
  { name: "sales_forecast.xlsx", type: "spreadsheet", tags: ["sales", "forecast", "analytics", "business"], path: "/Documents/Finance/" },
  { name: "typescript_utils.ts", type: "code", tags: ["typescript", "utils", "helper", "functions"], path: "/Projects/WebDev/" },
  { name: "resume_2024_updated.pdf", type: "pdf", tags: ["resume", "CV", "career", "professional"], path: "/Documents/Personal/" },
  { name: "new_year_fireworks.jpg", type: "image", tags: ["new year", "fireworks", "celebration", "night"], path: "/Photos/Events/" },
  { name: "marketing_strategy.docx", type: "docx", tags: ["marketing", "strategy", "growth", "plan"], path: "/Documents/Work/" },
  { name: "podcast_episode_12.mp3", type: "audio", tags: ["podcast", "episode", "audio", "interview"], path: "/Media/Podcasts/" },
  { name: "tutorial_screencast.mp4", type: "video", tags: ["tutorial", "video", "screencast", "learning"], path: "/Media/Videos/" },
  { name: "logo_design_final.png", type: "image", tags: ["logo", "design", "branding", "final"], path: "/Design/Branding/" },
  { name: "competitor_analysis.pdf", type: "pdf", tags: ["competitor", "analysis", "market", "research"], path: "/Documents/Research/" },
];

function generateEmbedding(): number[] {
  return Array.from({ length: 8 }, () => Math.round(Math.random() * 100) / 100);
}

function generateSize(type: MockFile["type"]): number {
  const sizes: Record<string, [number, number]> = {
    image: [500000, 15000000],
    pdf: [100000, 50000000],
    docx: [50000, 10000000],
    code: [1000, 500000],
    spreadsheet: [100000, 20000000],
    video: [50000000, 500000000],
    audio: [2000000, 80000000],
  };
  const [min, max] = sizes[type] || [10000, 1000000];
  return Math.floor(Math.random() * (max - min) + min);
}

function generateDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date(2024, 11, 31);
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

export const mockFiles: MockFile[] = fileNames.map((f, i) => ({
  id: `file-${String(i + 1).padStart(3, "0")}`,
  name: f.name,
  type: f.type,
  size: generateSize(f.type),
  path: f.path + f.name,
  tags: f.tags,
  embedding: generateEmbedding(),
  date: generateDate(),
}));

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  return (bytes / 1073741824).toFixed(2) + " GB";
}

export function searchFiles(query: string, files: MockFile[]): { file: MockFile; score: number }[] {
  if (!query.trim()) return files.map(f => ({ file: f, score: Math.random() * 30 + 70 }));
  
  const words = query.toLowerCase().split(/\s+/);
  
  return files
    .map(file => {
      let score = 0;
      const nameL = file.name.toLowerCase();
      const pathL = file.path.toLowerCase();
      const tagsL = file.tags.map(t => t.toLowerCase());
      
      for (const word of words) {
        if (nameL.includes(word)) score += 35;
        if (pathL.includes(word)) score += 15;
        if (tagsL.some(t => t.includes(word))) score += 25;
        if (file.type.includes(word)) score += 10;
      }
      
      // Add some randomness for realism
      score += Math.random() * 15;
      score = Math.min(99, Math.max(0, score));
      
      return { file, score };
    })
    .filter(r => r.score > 15)
    .sort((a, b) => b.score - a.score);
}
