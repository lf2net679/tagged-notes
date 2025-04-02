
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Image as ImageIcon, Link as LinkIcon, Undo, Redo, 
  AlignLeft, AlignCenter, AlignRight, Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange,
  placeholder = '開始寫作...',
  className
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = prompt('輸入圖片網址');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt('輸入連結網址');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const MenuButton = ({ 
    isActive, 
    onClick, 
    icon: Icon, 
    title 
  }: { 
    isActive?: boolean; 
    onClick: () => void; 
    icon: React.ElementType; 
    title: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 px-2 py-1",
        isActive && "bg-muted text-foreground"
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className={cn("flex flex-col border rounded-md overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/50">
        <MenuButton
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={Heading1}
          title="標題 1"
        />
        <MenuButton
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
          title="標題 2"
        />
        <MenuButton
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          title="粗體"
        />
        <MenuButton
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          title="斜體"
        />
        <MenuButton
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          title="無序列表"
        />
        <MenuButton
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          title="有序列表"
        />
        <MenuButton
          isActive={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          icon={Code}
          title="程式碼區塊"
        />
        <MenuButton
          onClick={addImage}
          icon={ImageIcon}
          title="插入圖片"
        />
        <MenuButton
          isActive={editor.isActive('link')}
          onClick={addLink}
          icon={LinkIcon}
          title="插入連結"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="靠左對齊"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="置中對齊"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="靠右對齊"
        />
        <MenuButton
          onClick={() => editor.commands.undo()}
          icon={Undo}
          title="復原"
        />
        <MenuButton
          onClick={() => editor.commands.redo()}
          icon={Redo}
          title="重做"
        />
      </div>
      <ScrollArea className="h-full overflow-auto bg-background">
        <div className="p-4">
          <EditorContent editor={editor} className="min-h-[200px] prose prose-sm md:prose-base lg:prose-lg max-w-none" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default RichTextEditor;
