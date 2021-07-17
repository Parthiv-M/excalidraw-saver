import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ViewAndDownload = () => {
    
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let response = await axios.get("/api/getFiles");
            if(response.data.success) {
                setImages(response.data.files)
            } else {
                console.log(response)
            }
        }
        fetchData();
    }, []);

    return (
        <div className="wrapper">
            <div className="column">
            {
                images.map((image, index) => {
                    return (
                        <div key={index}>
                            <p>{image}</p>
                        </div>
                    );
                })
            }
            </div>
            <div className="column">
                <div className="flex">
                    <p style={{ textAlign: "left" }}>Paste a filename from the adjacent list in the text field below</p>
                    <form style={{ textAlign: "left" }} className="flex">
                        <input type="text" id="file-name-input" required autoComplete="off" defaultValue="https://excalidraw-backend.herokuapp.com/api/download?fileName="></input>
                        <div style={{ width: "350px", padding: "10px", borderRadius: "2rem", height: "40px", marginTop: "15px", backgroundColor: "black", color: "white" }}>
                            <p>Paste the above link in the browser to download!</p>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx="true">{`
                .wrapper {
                    display: grid;
                    grid-template-columns: 50% 50%;
                }
                .flex {
                    display: flex;
                    flex-flow: column; 
                }
                input {
                    width: 70%;
                    padding: 10px;
                    margin: auto 0px;
                }
                @media only screen and (max-width: 800px) {
                    .wrapper {
                        grid-template-columns: 100%; 
                    }
                }
            `}
            </style>
        </div>
    );
}

export default ViewAndDownload;