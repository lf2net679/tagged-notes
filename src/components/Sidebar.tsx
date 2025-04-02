
import React from 'react';
import { Folder, Note, Tag } from '@/types/note';
import { Book, BookText, FileText, Hash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  tags: Tag[];
  activeFolderId: string | null;
  activeNoteId: string | null;
  onSelectFolder: (folderId: string) => void;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  notes,
  tags,
  activeFolderId,
  activeNoteId,
  onSelectFolder,
  onSelectNote,
  onCreateNote,
}) => {
  return (
    <div className="w-64 h-full border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">Notes</h2>
        <Button size="sm" variant="ghost" onClick={onCreateNote}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center">
          <Book className="h-4 w-4 mr-2" />
          Folders
        </h3>
        <ul className="space-y-1">
          {folders.map((folder) => (
            <li key={folder.id}>
              <button
                className={`w-full text-left px-2 py-1 rounded-md text-sm flex items-center ${
                  activeFolderId === folder.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                onClick={() => onSelectFolder(folder.id)}
              >
                <BookText className="h-4 w-4 mr-2" />
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4 flex-grow overflow-auto">
        <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </h3>
        <ul className="space-y-1">
          {notes
            .filter((note) => !activeFolderId || note.folderId === activeFolderId)
            .map((note) => (
              <li key={note.id}>
                <button
                  className={`w-full text-left px-2 py-1 rounded-md text-sm ${
                    activeNoteId === note.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                  onClick={() => onSelectNote(note.id)}
                >
                  {note.title || 'Untitled'}
                </button>
              </li>
            ))}
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium text-sm text-gray-500 mb-2 flex items-center">
          <Hash className="h-4 w-4 mr-2" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span 
              key={tag.id} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
