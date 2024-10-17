# Web Reading Assistant

This project aims to create a web-based reading assistant that highlights specific text portions based on the user's mouse movement. The project is implemented as a browser extension using JavaScript and Vue.js.


## Current Progress (as of [10/16/2024])

- Implemented mouse tracking and highlighting when the user hovers over the right one-third of the screen.
- Highlighted the current and next paragraphs based on mouse position in the right one-third area.
- Updated the front end to directly modify and highlight the content of the entire webpage, rather than fetching it separately.


## To-Do List

- [ ] Refine the line detection algorithm to ensure more precise word highlighting.
- [ ] Test compatibility across different websites with varying text structures (e.g., complex layouts, different HTML structures).
- [ ] Implement translation functionality as part of the reading assistant's advanced features.
- [ ] Optimize performance to handle large web pages with lots of text without slowing down the browser.
- [ ] Add settings for customizable highlight colors and behaviors.
- [ ] Finalize and polish the UI/UX for a better user experience.
- [ ] Write unit tests for key functionality to ensure robustness and reliability.

## Installation Instructions

1. Clone the repository.
2. Navigate to the `src` directory and review the `content.js` file.
3. To install the extension in Chrome:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer Mode" in the top right corner.
    - Click "Load unpacked" and select the directory containing your project files.
4. Test the extension on various websites to verify functionality.
