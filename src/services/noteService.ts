
import { Note, Folder, Tag } from '@/types/note';
import { v4 as uuidv4 } from 'uuid';

// Mock data
let folders: Folder[] = [
  { id: '1', name: 'Personal', parentId: null },
  { id: '2', name: 'Work', parentId: null },
  { id: '3', name: 'Projects', parentId: '2' },
];

let tags: Tag[] = [
  { id: '1', name: 'important' },
  { id: '2', name: 'todo' },
  { id: '3', name: 'ideas' },
];

let notes: Note[] = [
  {
    id: '1',
    title: 'Welcome Note',
    content: `# Welcome to Notes App

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
`,
    tags: ['1', '3'],
    folderId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Work Tasks',
    content: '# Work Tasks\n\n- [ ] Complete project proposal\n- [ ] Schedule meeting\n- [ ] Review code',
    tags: ['1', '2'],
    folderId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Service methods
export const getAllNotes = (): Note[] => {
  return [...notes];
};

export const getNoteById = (id: string): Note | undefined => {
  return notes.find(note => note.id === id);
};

export const createNote = (noteData: Partial<Note>): Note => {
  const newNote: Note = {
    id: uuidv4(),
    title: noteData.title || 'Untitled',
    content: noteData.content || '',
    tags: noteData.tags || [],
    folderId: noteData.folderId || '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  notes = [...notes, newNote];
  return newNote;
};

export const updateNote = (id: string, noteData: Partial<Note>): Note | undefined => {
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex === -1) return undefined;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...noteData,
    updatedAt: new Date(),
  };
  
  notes = [
    ...notes.slice(0, noteIndex),
    updatedNote,
    ...notes.slice(noteIndex + 1),
  ];
  
  return updatedNote;
};

export const deleteNote = (id: string): boolean => {
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== id);
  return notes.length !== initialLength;
};

export const getAllFolders = (): Folder[] => {
  return [...folders];
};

export const getAllTags = (): Tag[] => {
  return [...tags];
};
