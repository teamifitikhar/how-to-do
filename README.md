# how-to-do

A simple browser-based tutorial manager for storing short how-to notes, command lines, and install steps.

## Overview

This app lets you:
- add new tutorials with a topic, category, and description
- display saved tutorials in a searchable list
- copy individual command lines from the description
- export tutorials to an XML file
- import tutorials from an XML file

## How to use

1. Open `index.html` in your browser.
2. Use the **Add New** menu to create a tutorial.
   - Enter a `Topic` name.
   - Select a `Category`.
   - Add description text. Use new lines to separate command steps or individual commands.
3. Save the tutorial.
4. Use the **Tutorials** screen to browse saved items.
5. Use the search bar at the top to filter tutorials by topic, category, or description.
6. Click the **Copy** button next to any line to copy that line to your clipboard.

## Data storage

- Tutorials are stored locally in your browser using `localStorage`.
- This means the data is saved on your machine and stays available in the same browser until you clear it.
- The app does not use a server or database.

## Exporting to XML

1. Click the **Export XML** button in the sidebar.
2. The app will generate an XML file containing your saved tutorials.
3. Save the downloaded XML file to keep a backup or move your data to another machine.

## Importing from XML

1. Click the **Import XML** button in the sidebar.
2. Choose a previously exported XML file.
3. The app will read tutorials from the file and add them to the current storage.

## File structure

- `index.html` — main application page
- `css/style.css` — app styles
- `js/script.js` — app logic and behavior
- `README.md` — this documentation

## Notes

- If you want to keep your data safe, export your tutorials regularly.
- On large collections, use the search bar to quickly find topics.
- Imported tutorials are merged into existing stored tutorials.
