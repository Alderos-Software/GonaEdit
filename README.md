# GonaEdit

A lightweight, browser-based code editor with syntax highlighting and smart indentation support.

## Features

- **Syntax Highlighting**: Real-time syntax highlighting for JavaScript with support for:
  - Keywords (function, return, if, else, for, while, const, let, var)
  - String literals (single, double, and template strings)
  - Comments
  - Numbers

- **Smart Indentation**: Automatic indentation handling with:
  - Tab support
  - Smart bracket pairing
  - Intelligent newline indentation

- **Line Numbers**: Real-time line number display that scrolls with the editor

- **File Operations**:
  - Open files from your system
  - Save files locally using the File System Access API
  - Undo/Redo functionality

- **Keyboard Shortcuts**:
  - `Ctrl+S`: Save file
  - `Ctrl+O`: Open file
  - `Ctrl+Z`: Undo
  - `Ctrl+Y`: Redo
  - `Tab`: Insert tab character

## How to Use

1. Open `index.html` in a modern web browser
2. Start typing or open an existing file
3. Use keyboard shortcuts for file operations and editing
4. The editor automatically highlights syntax and manages indentation

## Files

- `index.html`: Main HTML structure
- `editor.js`: Core editor functionality and event handlers
- `style.css`: Editor styling and theme

## Browser Support

GonaEdit requires a modern browser with support for:
- ES6 JavaScript
- File System Access API (for save/open functionality)
- CSS Flexbox

**Note**: The save function using the File System Access API currently works in Edge but not in Firefox. File opening functionality works in both browsers.

## Technical Details

The editor uses a combination of:
- `<textarea>` for user input
- `<pre>` element for syntax-highlighted display
- JavaScript regex patterns for code highlighting
- Browser File APIs for file operations

---

*README generated using AI*
