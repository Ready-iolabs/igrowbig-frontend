import React, { useMemo, useCallback, useState } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import clsx from 'clsx';

// Predefined font sizes and color options
const FONT_SIZES = [
  '8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', 
  '28px', '32px', '36px', '48px', '60px', '72px'
];

const COLOR_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080'
];

// SVG Icons
const BoldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M6 4h6a4 4 0 0 1 0 8H6v8h6" />
  </svg>
);

const ItalicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M10 4h4l-4 16h-4l4-16z" />
  </svg>
);

const UnderlineIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M6 4v8a6 6 0 0 0 12 0V4M4 20h16" />
  </svg>
);

const StrikeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M6 12h12M9 4h6a3 3 0 0 1 0 6H6M15 14a3 3 0 0 1-6 0" />
  </svg>
);

const BulletListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);

const OrderedListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M10 6h12M10 12h12M10 18h12M4 6v4M6 8H4M6 16v4M4 18h2" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path strokeWidth="2" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M4 4h16v12H4zM4 16l4-4 4 4 6-6" />
  </svg>
);

const CaretDownIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" d="M6 9l6 6 6-6" />
  </svg>
);

const RichTextEditor = ({ 
  value, 
  onChange, 
  height = "400px", 
  placeholder = "Enter text here...",
  className = "",
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      bulletList: { HTMLAttributes: { class: "list-disc pl-5" } },
      orderedList: { HTMLAttributes: { class: "list-decimal pl-5" } },
    }),
    Underline,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false }),
    Image.configure({ inline: true }),
    Color,
    TextStyle,
  ], []);

  const editor = useEditor({
    extensions,
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onChange?.(htmlContent);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none ${className}`,
      },
    },
  });

  const applyFormat = useCallback((formatAction) => {
    if (editor) formatAction();
  }, [editor]);

  const setTextColor = useCallback((color) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    }
  }, [editor]);

  const setFontSize = useCallback((size) => {
    if (editor) {
      editor.commands.setFontSize(size);
      setShowFontSizePicker(false);
    }
  }, [editor]);

  const addLink = useCallback(() => {
    if (editor) {
      const url = window.prompt('Enter the URL');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (editor) {
      const url = window.prompt('Enter the image URL');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return <div className="text-gray-500">Loading editor...</div>;

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      {/* Enhanced Toolbar */}
      <div className="p-2 bg-gray-100 border-b flex flex-wrap gap-2 items-center">
        {/* Text Formatting Group */}
        <div className="flex gap-1">
          <button 
            onClick={() => applyFormat(() => editor.chain().focus().toggleBold().run())}
            className={clsx(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('bold') && "bg-gray-300"
            )}
            title="Bold"
          >
            <BoldIcon />
          </button>
          <button 
            onClick={() => applyFormat(() => editor.chain().focus().toggleItalic().run())}
            className={clsx(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('italic') && "bg-gray-300"
            )}
            title="Italic"
          >
            <ItalicIcon />
          </button>
          <button 
            onClick={() => applyFormat(() => editor.chain().focus().toggleUnderline().run())}
            className={clsx(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('underline') && "bg-gray-300"
            )}
            title="Underline"
          >
            <UnderlineIcon />
          </button>
          <button 
            onClick={() => applyFormat(() => editor.chain().focus().toggleStrike().run())}
            className={clsx(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('strike') && "bg-gray-300"
            )}
            title="Strikethrough"
          >
            <StrikeIcon />
          </button>
        </div>

        {/* Headings Group */}
        <div className="ml-2">
          <select 
            onChange={(e) => applyFormat(() => 
              editor.chain().focus().toggleHeading({ level: Number(e.target.value) }).run()
            )}
            className="p-2 border rounded bg-white hover:bg-gray-50 transition-colors"
            title="Headings"
          >
            <option value="">Paragraph</option>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <option key={level} value={level}>H{level}</option>
            ))}
          </select>
        </div>

        {/* Text Style Group */}
        <div className="ml-2 flex gap-1">
          <div className="relative">
            <button 
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 border rounded bg-white hover:bg-gray-50 flex items-center transition-colors"
              title="Text Color"
            >
              <span className="w-5 h-5 mr-1" style={{ backgroundColor: editor.getAttributes('textStyle')?.color || '#000000' }}></span>
              <CaretDownIcon />
            </button>
            {showColorPicker && (
              <div className="absolute z-10 bg-white border rounded p-2 grid grid-cols-5 gap-1 shadow-md mt-1">
                {COLOR_PALETTE.map((color) => (
                  <button 
                    key={color} 
                    onClick={() => setTextColor(color)}
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded hover:ring-2 hover:ring-gray-300 transition-all"
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowFontSizePicker(!showFontSizePicker)}
              className="p-2 border rounded bg-white hover:bg-gray-50 flex items-center transition-colors"
              title="Font Size"
            >
              <span className="mr-1">Size</span>
              <CaretDownIcon />
            </button>
            {showFontSizePicker && (
              <select 
                onChange={(e) => setFontSize(e.target.value)}
                className="absolute z-10 bg-white border rounded p-2 shadow-md mt-1 w-24"
                size={5}
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Lists Group */}
        <div className="ml-2 flex gap-1">
          <button 
            onClick={() => applyFormat(() => editor.chain().focus().toggleBulletList().run())}
            className={clsx(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('bulletList') && "bg-gray-300"
            )}
            title="Bullet List"
          >
            <BulletListIcon />
          </button>
          <button 
            onClick={() => applyFormat(() => editor.chain().focus().toggleOrderedList().run())}
            className={clsx(
              "p-2 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('orderedList') && "bg-gray-300"
            )}
            title="Numbered List"
          >
            <OrderedListIcon />
          </button>
        </div>

       
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        style={{ minHeight: height, padding: "16px" }} 
        className="focus:ring-2 focus:ring-blue-300 transition-all"
      />
    </div>
  );
};

export default RichTextEditor;