import axios from 'axios';
import React, { useState } from 'react';

const statuses = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    COMPLETED: 'completed',
    FAILED: 'failed'
  };

const UploadFile = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState(statuses.IDLE); 
    const [progressBar, setProgressBar] = useState(null);
 

    function fileHandle(e) {
        e.preventDefault();
        const {files} = e.target;
        setFiles(Array.from(files))
    }

    async function HandleFileupload(e) {
        e.preventDefault();
        if (files.length === 0) return;
        setProgressBar(0);
        setStatus(statuses.UPLOADING);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('file',file);
        })
        

        try {
            await axios.post("https://httpbin.org/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (ProgressEvent) => {
                    const progress = ProgressEvent.total ? Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total) : 0;
                    setProgressBar(progress);
                }
            });

            setStatus(statuses.COMPLETED);
            setProgressBar(100);
        } catch {
            setStatus(statuses.FAILED)
            setProgressBar(0);
        };
    }

     console.log(files)

    return(
        <div className="text-xl space-y-10 p-10">
            Upload a file... here
            <input onChange={fileHandle} type='file' multiple/>
            <br/>
            {files.length > 0 && (
                <div className='border border-red-300 px-10 pb-10 space-y-10'>
                {files.map((file,index) => {
                    return(<div key={index} className='flex flex-col mt-10 w-full'>
                    <span>
                        {file.name}
                    </span>
                    <span>
                        {(file.size / 1024).toFixed(2)} MB
                    </span>
                    <span>
                        {file.type}
                    </span>
                    

                    {file && status === 'completed' && (
                        <div className='text-green-600'>Uploaded Sucessfully</div>
                    )}

                    {file && status === 'failed' &&(
                        <div className='text-red-500'>Upload failed :(</div>
                    )}

                    {status === 'uploading' && (
                        <div className="space-y-2">
                            <div className="h-2.5 w-full rounded-2xl bg-gray-200">
                                <div className="h-2.5 w-full rounded-2xl bg-blue-600 transition-all duration-300"
                                style={{width: `${progressBar}%`}}>

                                </div>
                            </div>
                            <p>{progressBar}</p>
                        </div>
                    )
                    }
                </div>);
                })
                }
                {files.length > 0 && status !== 'uploading' && <button
                    onClick={HandleFileupload} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-[200px]">Upload</button>}
                </div>
            )}
           
        </div>
    )
}

export default UploadFile;

// Displaying the upload ProgressBar 