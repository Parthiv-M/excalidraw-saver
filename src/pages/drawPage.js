import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import Excalidraw, {
  exportToCanvas,
  exportToSvg,
  exportToBlob
} from "@excalidraw/excalidraw";
import initialData from "./../utils/initialData";
import axios from 'axios';
import "./../styles/globalStyles.css"

const DrawPage = () => {

    const excalidrawRef = useRef(null);

    const [viewModeEnabled, setViewModeEnabled] = useState(false);
    const [zenModeEnabled, setZenModeEnabled] = useState(false);
    const [gridModeEnabled, setGridModeEnabled] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [canvasUrl, setCanvasUrl] = useState(null);
    const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
    const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
    const [theme, setTheme] = useState("light");
    const [elements, setElements] = useState(initialData.elements);
    const [drawState, setDrawSate] = useState(null);

    useEffect(() => {
      setInterval(() => handleSaveEveryTen(), 10000);
      const onHashChange = () => {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const libraryUrl = hash.get("addLibrary");
        if (libraryUrl) {
          excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
        }
      };
      window.addEventListener("hashchange", onHashChange, false);
      return () => {
        window.removeEventListener("hashchange", onHashChange);
      };
    }, []);

    const renderFooter = () => {
      return (
        <button onClick={() => alert("This is dummy footer")}>
          {" "}
          custom footer{" "}
        </button>
      );
    };

    const updateScene = () => {
        const sceneData = {
          elements: [
            {
              type: "rectangle",
              version: 141,
              versionNonce: 361174001,
              isDeleted: false,
              id: "oDVXy8D6rom3H1-LLH2-f",
              fillStyle: "hachure",
              strokeWidth: 1,
              strokeStyle: "solid",
              roughness: 1,
              opacity: 100,
              angle: 0,
              x: 100.50390625,
              y: 93.67578125,
              strokeColor: "#c92a2a",
              backgroundColor: "transparent",
              width: 186.47265625,
              height: 141.9765625,
              seed: 1968410350,
              groupIds: []
            }
          ],
          appState: {
            viewBackgroundColor: "#edf2ff"
          }
        };
        excalidrawRef.current.updateScene(sceneData);
      };

    const handleSaveEveryTen = async () => {
        console.log("Elements :", excalidrawRef.current.getSceneElements(), "State : ", drawState)
        const blob = await exportToBlob({
            elements: excalidrawRef.current.getSceneElements(),
            mimeType: "image/png",
            appState: {
              ...initialData.appState,
              exportWithDarkMode,
              shouldAddWatermark
            }
          });
        setBlobUrl(window.URL.createObjectURL(blob));
        console.log("exporting" + window.URL.createObjectURL(blob))

        let formData = new FormData();
        formData.append('file', blob);
        formData.append('fileName', window.URL.createObjectURL(blob));
        
        const config = {
          headers: { 'content-type': 'multipart/form-data' },
          onUploadProgress: (event) => {
            console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
          },
        };
        
        let response = await axios.post("/api/upload", formData, config);
        console.log(response)
    }

    return (
        <div>
          <h1> Excalidraw Saver </h1>
          <Link to="/viewAndDownload">
            <button style={{ backgroundColor: "purple", color: "white", cursor: "pointer", padding: "1rem", border: "none", borderRadius: "20px", fontSize: "1.5rem", margin: "10px 0px", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)" }}>View and Download</button>
          </Link>
          <div className="button-wrapper">
            <button className="update-scene" onClick={updateScene}>
              Update Scene
            </button>
            <button
              className="reset-scene"
              onClick={() => {
                excalidrawRef.current.resetScene();
              }}
            >
              Reset Scene
            </button>
            <label>
              <input
                type="checkbox"
                checked={viewModeEnabled}
                onChange={() => setViewModeEnabled(!viewModeEnabled)}
              />
              View mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={zenModeEnabled}
                onChange={() => setZenModeEnabled(!zenModeEnabled)}
              />
              Zen mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={gridModeEnabled}
                onChange={() => setGridModeEnabled(!gridModeEnabled)}
              />
              Grid mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() => {
                  let newTheme = "light";
                  if (theme === "light") {
                    newTheme = "dark";
                  }
                  setTheme(newTheme);
                }}
              />
              Switch to Dark Theme
            </label>
          </div>
          <div className="excalidraw-wrapper">
            <Excalidraw
              ref={excalidrawRef}
              initialData={initialData}
              onChange={(elements, state) => {
                    setElements(elements);
                    setDrawSate(state);
                    // console.log(elements);
                    // console.log(state)
                }
              }
              onPointerUpdate={(payload) => null}
              onCollabButtonClick={() =>
                window.alert("You clicked on collab button")
              }
              viewModeEnabled={viewModeEnabled}
              zenModeEnabled={zenModeEnabled}
              gridModeEnabled={gridModeEnabled}
              theme={theme}
              name="Custom name of drawing"
              UIOptions={{ canvasActions: { loadScene: false } }}
            //   renderTopRightUI={renderTopRightUI}
              renderFooter={renderFooter}
            />
          </div>
          <div className="export-wrapper button-wrapper">
            <label className="export-wrapper__checkbox">
              <input
                type="checkbox"
                checked={exportWithDarkMode}
                onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
              />
              Export with dark mode
            </label>
            <label className="export-wrapper__checkbox">
              <input
                type="checkbox"
                checked={shouldAddWatermark}
                onChange={() => setShouldAddWatermark(!shouldAddWatermark)}
              />
              Add Watermark
            </label>
            <button
              onClick={async () => {
                const svg = await exportToSvg({
                  elements: excalidrawRef.current.getSceneElements(),
                  appState: {
                    ...initialData.appState,
                    exportWithDarkMode,
                    shouldAddWatermark,
                    width: 300,
                    height: 100
                  },
                  embedScene: true
                });
                document.querySelector(".export-svg").innerHTML = svg.outerHTML;
              }}
            >
              Export to SVG
            </button>
            <div className="export export-svg"></div>
            <button
              onClick={async () => {
                const blob = await exportToBlob({
                  elements: excalidrawRef.current.getSceneElements(),
                  mimeType: "image/png",
                  appState: {
                    ...initialData.appState,
                    exportWithDarkMode,
                    shouldAddWatermark
                  }
                });
                setBlobUrl(window.URL.createObjectURL(blob));
              }}
            >
              Export to Blob
            </button>
            <div className="export export-blob">
              <img src={blobUrl} alt="" />
            </div>
            <button
              onClick={() => {
                const canvas = exportToCanvas({
                  elements: excalidrawRef.current.getSceneElements(),
                  appState: {
                    ...initialData.appState,
                    exportWithDarkMode,
                    shouldAddWatermark
                  }
                });
                const ctx = canvas.getContext("2d");
                ctx.font = "30px Virgil";
                ctx.strokeText("My custom text", 50, 60);
                setCanvasUrl(canvas.toDataURL());
              }}
            >
              Export to Canvas
            </button>
            <div className="export export-canvas">
              <img src={canvasUrl} alt="" />
            </div>
          </div>
        </div>
    );
}

export default DrawPage;