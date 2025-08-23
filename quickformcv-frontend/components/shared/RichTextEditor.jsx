"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const RichTextEditor = ({
  value = "",
  onChange,
  maxLength = 1000,
  disabled = false,
  className = "",
  placeholder = "Enter your professional summary...",
}) => {
  const editorRef = useRef(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [activeCommands, setActiveCommands] = useState({});

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
      updateCharacterCount();
    }
  }, [value]);

  const updateCharacterCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setCharacterCount(text.length);
    }
  };

  const updateActiveCommands = () => {
    const commands = [
      "bold",
      "italic",
      "underline",
      "insertUnorderedList",
      "insertOrderedList",
    ];
    const newActiveCommands = {};

    commands.forEach((command) => {
      try {
        newActiveCommands[command] = document.queryCommandState(command);
      } catch {
        newActiveCommands[command] = false;
      }
    });

    setActiveCommands(newActiveCommands);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";

      // Check character limit
      if (text.length > maxLength) {
        // Truncate content if it exceeds limit
        const truncated = text.substring(0, maxLength);
        editorRef.current.innerText = truncated;
        // Move cursor to end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }

      updateCharacterCount();
      updateActiveCommands();
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, value = null) => {
    if (disabled) return;

    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setTimeout(() => {
      handleInput();
    }, 10);
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
      }
    }
  };

  return (
    <div
      className={cn(
        "border rounded-md overflow-hidden bg-background",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <Toggle
          pressed={activeCommands.bold}
          onPressedChange={() => executeCommand("bold")}
          disabled={disabled}
          size="sm"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={activeCommands.italic}
          onPressedChange={() => executeCommand("italic")}
          disabled={disabled}
          size="sm"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={activeCommands.underline}
          onPressedChange={() => executeCommand("underline")}
          disabled={disabled}
          size="sm"
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Toggle
          pressed={activeCommands.insertUnorderedList}
          onPressedChange={() => executeCommand("insertUnorderedList")}
          disabled={disabled}
          size="sm"
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={activeCommands.insertOrderedList}
          onPressedChange={() => executeCommand("insertOrderedList")}
          disabled={disabled}
          size="sm"
          aria-label="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Toggle
          onPressedChange={() => executeCommand("justifyLeft")}
          disabled={disabled}
          size="sm"
          aria-label="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          onPressedChange={() => executeCommand("justifyCenter")}
          disabled={disabled}
          size="sm"
          aria-label="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          onPressedChange={() => executeCommand("justifyRight")}
          disabled={disabled}
          size="sm"
          aria-label="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onPaste={handleInput}
        onKeyUp={updateActiveCommands}
        onMouseUp={updateActiveCommands}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[120px] p-3 outline-none focus:outline-none",
          "prose prose-sm max-w-none prose-headings:my-2 prose-p:my-1",
          "[&>ul]:list-disc [&>ul]:ml-6 [&>ul]:my-2",
          "[&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:my-2",
          "[&>li]:my-0.5",
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "text-foreground",
          disabled && "bg-muted cursor-not-allowed opacity-60",
        )}
        style={{
          wordBreak: "break-word",
          lineHeight: "1.5",
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      {/* Character Counter */}
      <div className="px-3 py-2 bg-muted/30 border-t text-right">
        <span
          className={cn(
            "text-xs text-muted-foreground",
            characterCount > maxLength * 0.9 && "text-destructive",
          )}
        >
          {characterCount}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
