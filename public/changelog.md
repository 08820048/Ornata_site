## Ornata软件更新日志

### v0.1.0
- 初始版本发布

---

### v0.1.1

- Refined interaction animations for a smoother experience
- Adjusted color schemes across several interface views
- Improved sidebar toolbar layout
- Fixed an issue where content in the preview pane could be partially cut off
- Polished the update panel UI
- Unified border radius across the interface
- Other minor improvements and fixes

----

### v0.1.2
- Fixed an issue where the update check prompt kept appearing in the bottom-left corner

---

### v0.1.3
- Adjusted the corner radius of code block UI in the editor to match the preview area.
- Improved the application’s automatic update logic.

---

### v0.1.4
- Added Open Recent Files support. The entry is available in the top system menu under File.
- Added Auto Save functionality. Changes are automatically saved when switching files. This feature can be disabled in Settings.
- Fixed an issue where deleting code blocks in the editor left residual artifacts, and where code blocks in the preview panel did not update correctly after deletion.
- Fixed a ghosting issue that occurred after removing the programming language name from a code block.
- Added Export to PDF support. Available via File → Export → Export as PDF.
- Added Export to HTML support. Available via File → Export → Export as HTML.
- Improved the background color of the table of contents panel in Dark Mode.
- Fixed an issue where the Change Folder button at the top of the file management sidebar was unresponsive.

---

### v0.1.5
- Added support for WYSIWYG mode, enabled by default and can be turned off in Settings.
- Adjusted the cursor color in the editor.
- Fixed multiple known issues.
- Optimized the display of system menu descriptions.
- Added sound feedback for user actions, which can be disabled in the settings.
- Adjusted the entry point for the software update feature, moving it to the system menu in the top-left corner.
- Adjusted the color style of folder icons in the file manager.
- Added a context menu to the editor area.
- Improved the editing experience in WYSIWYG mode.

---

### v0.1.6
- Fixed an issue where the cursor was not visible on empty lines in WYSIWYG mode.
- Improved file management functionality: when opening a file outside the current directory, the file’s containing folder is now opened automatically.
- Fixed a bug in v0.1.5 where the editor could not properly input code blocks.
- Added outline (table of contents) support in WYSIWYG mode.
- Adjusted the color scheme of toggle switches in the settings.
- Attempted to fix an unresponsive freeze issue on Windows that could occur when launching certain menus.
- Fixed blockquote rendering in WYSIWYG mode and added support for nested blockquote syntax.
- Fixed an issue in WYSIWYG mode where pressing Enter in unordered lists caused duplicate syntax markers to appear.
- Fixed an issue in split-view mode where the cursor was not visible on empty lines in the editor.
- Improved cursor visibility when clicking outside of code blocks, where the cursor previously failed to appear.
- Fixed an issue in WYSIWYG mode where entering Chinese characters inside code blocks caused the current line to be unexpectedly replaced.
- Adjusted file management behavior so that after collapsing and re-expanding the root directory, all subdirectories are collapsed by default.
- Fixed issues with abnormal behavior when opening files or folders via drag and drop.
- Fixed an issue where Ctrl/Cmd+A or Select All only selected the visible content in split or WYSIWYG modes.
- Fixed an issue where some content did not show the selection highlight when the document was fully selected.
- Added heading level indicators (H1–H6) before each item in the floating table of contents.
- Added a pin button to the floating table of contents to keep it open when focus is lost.
- Added a sedentary reminder feature that tracks focused editing/reading time only, with system notifications, break/snooze/disable-for-today actions, and configurable intervals and break lengths.
- Added Git commit file diff viewer in Source Control: click a file under a commit to compare the committed version with the current local file.
- Added Ctrl/Cmd+F find bar for the editor with red highlights, while disabling find in pure preview mode.
- Fixed an issue where content search highlights stayed after closing the file search panel.
