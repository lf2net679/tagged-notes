
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Image as ImageIcon, Link as LinkIcon, Undo, Redo, 
  AlignLeft, AlignCenter, AlignRight, Code, Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const fontOptions = [
  { label: '預設字體', value: 'sans-serif' },
  { label: '新細明體', value: 'PMingLiU, serif' },
  { label: '微軟正黑體', value: 'Microsoft JhengHei, sans-serif' },
  { label: '標楷體', value: 'DFKai-SB, serif' },
  { label: '宋體', value: 'SimSun, serif' },
  { label: '黑體', value: 'SimHei, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
];

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
      FontFamily.configure(),
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
      // First check if text is selected, then extend the selection if needed
      if (editor.isActive('link')) {
        // If a link is already active at the cursor, update it
        editor.chain().focus().extendMarkRange('link').unsetLink().setLink({ href: url }).run();
      } else {
        // If no link is active, create a new one
        editor.chain().focus().toggleLink({ href: url }).run();
      }
    }
  };

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
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
        "h-8 px-2 py-1 text-gray-200 hover:bg-gray-700 hover:text-white",
        isActive && "bg-gray-700 text-white"
      )}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className={cn("flex flex-col border rounded-md overflow-hidden border-gray-700 bg-gray-800", className)}>
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-gray-700 bg-gray-800">
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
        
        {/* 字體選擇下拉選單 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 py-1 text-gray-200 hover:bg-gray-700 hover:text-white flex items-center gap-1"
              title="字體選擇"
            >
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">字體</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-gray-800 border-gray-700 text-gray-200">
            {fontOptions.map((font) => (
              <DropdownMenuItem 
                key={font.value}
                className="hover:bg-gray-700 hover:text-white cursor-pointer"
                style={{ fontFamily: font.value }}
                onClick={() => setFontFamily(font.value)}
              >
                {font.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
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
      <ScrollArea className="h-full overflow-auto bg-gray-900">
        <div className="p-4">
          <EditorContent 
            editor={editor} 
            className="min-h-[200px] prose prose-sm md:prose-base lg:prose-lg max-w-none prose-invert focus:outline-none"
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default RichTextEditor;
