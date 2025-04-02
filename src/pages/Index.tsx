
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import RichTextEditor from "@/components/RichTextEditor";
import Sidebar from "@/components/Sidebar";
import { Note } from "@/types/note";
import { getAllNotes, getAllFolders, getAllTags, getNoteById, createNote, updateNote, ViewMode } from "@/services/noteService";
import { useToast } from "@/hooks/use-toast";
import { Eye, Pencil, Calendar, Clock, Tag, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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
      title: "新筆記",
      content: "<h1>新筆記</h1><p>開始寫作...</p>",
      folderId: activeFolderId || undefined,
    });
    setNotes(getAllNotes());
    setActiveNoteId(newNote.id);
    setViewMode("edit"); // Switch to edit mode when creating a new note
    toast({
      title: "筆記已建立",
      description: "新筆記已成功建立",
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "edit" ? "preview" : "edit");
    toast({
      title: viewMode === "edit" ? "預覽模式" : "編輯模式",
      description: viewMode === "edit" ? "切換至預覽模式" : "切換至編輯模式",
    });
  };

  const saveNote = () => {
    if (activeNoteId) {
      updateNote(activeNoteId, { content, title });
      toast({
        title: "已儲存",
        description: "筆記已成功儲存",
      });
    }
  };

  const activeNote = activeNoteId ? getNoteById(activeNoteId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-sidebar border-r border-slate-200 dark:border-slate-700">
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
        
        <ResizableHandle withHandle className="transition-colors" />
        
        <ResizablePanel defaultSize={80}>
          <div className="p-6 h-full flex flex-col">
            {activeNoteId ? (
              <>
                <div className="mb-4 flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className={`w-full text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 dark:text-white transition-colors ${viewMode === "preview" ? "pointer-events-none" : ""}`}
                        placeholder="無標題"
                        readOnly={viewMode === "preview"}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveNote}
                        className="bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        儲存
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleViewMode}
                        className="bg-white dark:bg-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                      >
                        {viewMode === "edit" ? <Eye className="h-4 w-4 mr-1" /> : <Pencil className="h-4 w-4 mr-1" />}
                        {viewMode === "edit" ? "預覽" : "編輯"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metadata row */}
                  {activeNote && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{format(new Date(activeNote.createdAt), 'yyyy/MM/dd')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>更新於 {format(new Date(activeNote.updatedAt), 'HH:mm')}</span>
                      </div>
                      {activeNote.tags && activeNote.tags.length > 0 && (
                        <div className="flex items-center">
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {activeNote.tags.map(tagId => 
                              getAllTags().find(tag => tag.id === tagId)?.name
                            ).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {viewMode === "edit" ? (
                    <Card className="h-full border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 transition-all">
                      <CardContent className="p-0 h-full">
                        <RichTextEditor
                          content={content}
                          onChange={handleContentChange}
                          className="h-full"
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 transition-all">
                      <CardContent className="p-6 h-full">
                        <ScrollArea className="h-full">
                          <MarkdownRenderer content={content} />
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 dark:text-gray-400 max-w-md">
                  <h2 className="text-2xl font-bold mb-2">歡迎使用筆記應用</h2>
                  <p className="mb-6">選擇一個筆記或建立一個新的筆記開始寫作</p>
                  <Button
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                    onClick={handleCreateNote}
                  >
                    建立新筆記
                  </Button>
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
