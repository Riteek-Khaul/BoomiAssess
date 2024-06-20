import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FileZipper = () => {
  const [fileContent1, setFileContent1] = useState(`Type,Count
start,1
message,1
dataprocess,2
stop,1`);
  const [fileContent2, setFileContent2] = useState(`ComponentId,ProcessName,ShapeName,ShapeType,Configuration
44ff882a-ed5a-42f3-84c9-24a80584d81a,Encode and Decode Input Data,shape1,start,noaction:
44ff882a-ed5a-42f3-84c9-24a80584d81a,Encode and Decode Input Data,shape2,message,message:[@combined:false, msgTxt:This is sample data to encode and decode., msgParameters:]
44ff882a-ed5a-42f3-84c9-24a80584d81a,Encode and Decode Input Data,shape3,dataprocess,dataprocess:[step:[[@index:1, @key:1, @name:Search/Replace, @processtype:1, dataprocessreplace:[@replacewith:ReplaceWith, @searchCharacterLimit:1024, @searchType:char_limit, @texttofind:TextToFind]], [@index:2, @key:2, @name:Base64 Encode, @processtype:6]]]
44ff882a-ed5a-42f3-84c9-24a80584d81a,Encode and Decode Input Data,shape5,stop,stop:[@continue:true]
44ff882a-ed5a-42f3-84c9-24a80584d81a,Encode and Decode Input Data,shape6,dataprocess,dataprocess:[step:[@index:1, @key:1, @name:Base64 Decode, @processtype:7]]`);

  const createZip = () => {
    const zip = new JSZip();
    
    // Create folders and add files
    zip.folder("folder1").file("file1.csv", fileContent1);
    zip.folder("folder2").file("file2.csv", fileContent2);

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "example.zip");
    });
  };

  return (
    <div>
      <button onClick={createZip}>Download ZIP</button>
    </div>
  );
};

export default FileZipper;
