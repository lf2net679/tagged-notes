
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const defaultMarkdown = `# Welcome to Notes App

This is a *markdown-based* note taking app with:

## Features
- Folders
- Tags
- Search
- Syntax highlighting

\`\`\`typescript
// Code example with syntax highlighting
const greeting = (name: string): string => {
  return \`Hello, \${name}!\`;
};
\`\`\`

> 繁體中文語言支持
`;

const Index = () => {
  const [content, setContent] = useState(defaultMarkdown);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="h-[calc(100vh-2rem)]">
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-[calc(100vh-12rem)] p-4 border rounded-md dark:bg-slate-800 dark:text-white font-mono"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card className="h-[calc(100vh-2rem)] overflow-auto">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={content} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
