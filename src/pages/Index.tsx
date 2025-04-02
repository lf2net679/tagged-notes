
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Sidebar from "@/components/Sidebar";
import { Note } from "@/types/note";
import { getAllNotes, getAllFolders, getAllTags, getNoteById, createNote, updateNote, ViewMode } from "@/services/noteService";
import { useToast } from "@/hooks/use-toast";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const { toast } = useToast();

  useEffect(() => {
    // Load notes on initial render
    setNotes(getAllNotes());
    
    // Set active note to the first note if available
    const allNotes = getAllNotes();
    if (allNotes.length > 0) {
      setActiveNoteId(allNotes[0].id);
      setContent(allNotes[0].content);
      setTitle(allNotes[0].title);
    }
  }, []);

  useEffect(() => {
    if (activeNoteId) {
      const note = getNoteById(activeNoteId);
      if (note) {
        setContent(note.content);
        setTitle(note.title);
      }
    }
  }, [activeNoteId]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (activeNoteId) {
      updateNote(activeNoteId, { content: newContent });
      setNotes(getAllNotes());
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (activeNoteId) {
      updateNote(activeNoteId, { title: newTitle });
      setNotes(getAllNotes());
    }
  };

  const handleSelectNote = (noteId: string) => {
    setActiveNoteId(noteId);
  };

  const handleSelectFolder = (folderId: string) => {
    setActiveFolderId(folderId);
  };

  const handleCreateNote = () => {
    const newNote = createNote({
      title: "New Note",
      content: "# New Note\n\nStart writing here...",
      folderId: activeFolderId || undefined,
    });
    setNotes(getAllNotes());
    setActiveNoteId(newNote.id);
    setViewMode("edit"); // Switch to edit mode when creating a new note
    toast({
      title: "Note created",
      description: "A new note has been created",
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "edit" ? "preview" : "edit");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Sidebar
            folders={getAllFolders()}
            notes={notes}
            tags={getAllTags()}
            activeFolderId={activeFolderId}
            activeNoteId={activeNoteId}
            onSelectFolder={handleSelectFolder}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={80}>
          <div className="p-4 h-full flex flex-col">
            {activeNoteId ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={`w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 ${viewMode === "preview" ? "pointer-events-none" : ""}`}
                    placeholder="Untitled"
                    readOnly={viewMode === "preview"}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleViewMode}
                    className="ml-2"
                  >
                    {viewMode === "edit" ? <Eye className="h-4 w-4 mr-1" /> : <Pencil className="h-4 w-4 mr-1" />}
                    {viewMode === "edit" ? "Preview" : "Edit"}
                  </Button>
                </div>
                
                <div className="flex-1">
                  {viewMode === "edit" ? (
                    <Card className="h-full">
                      <CardContent className="p-4 h-full">
                        <Textarea
                          className="w-full h-full p-4 border rounded-md dark:bg-slate-800 dark:text-white font-mono resize-none"
                          value={content}
                          onChange={(e) => handleContentChange(e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full overflow-auto">
                      <CardContent className="p-4">
                        <MarkdownRenderer content={content} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="mb-4">Select a note or create a new one</p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={handleCreateNote}
                  >
                    Create New Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
