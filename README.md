# Excalidraw-saver

The client side application for the excalidraw-saver that saves the current drawing state every **10 seconds** to a custom NodeJS server, which can be found [here](https://github.com/Parthiv-M/excalidraw-backend)

## How it works

The template code for the client side canvas was taken from [here](https://codesandbox.io/s/excalidraw-ehlz3), the official demo page of Excalidraw.

[Excalidraw](https://www.npmjs.com/package/@excalidraw/excalidraw) allows collaboration on whiteboard, giving a hand-drawn feel. The custom function written [here](https://github.com/Parthiv-M/excalidraw-saver/blob/adb1f92b10d3a22e14e72b09243297df044303a8/src/pages/drawPage.js#L84) exports the current state of the excalidraw canvas, along with the elements, and sends it to the NodeJS server where it is stored in the `/uploads` directory.

The second page of the client side application displays all the files. A text box beside it also shows a link that needs completion with just any of the file names from the given list. On pasting the completed link in the browser, the file is downloaded onto the user's local system.

**NOTE**: I have not worked/focused on the UI part much, instead worked on completing the server-side code and the integration with the backend. 