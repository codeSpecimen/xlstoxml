import logo from './logo.svg';
import { useEffect, useState } from "react";
import './App.css';
import { json2xml } from 'xml-js';
import { toXML } from 'jstoxml';

function App() {
  const [xml, setXml] = useState()
  const [loading, setLoading] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  const XLSX = require("xlsx");

  function handleChange() {
    let testf = document.getElementById("filepicker").files[0]
    setLoading(true);
    testf.arrayBuffer().then((res) => {
      let data = new Uint8Array(res);
      let workbook = XLSX.read(data, {type:"array"});
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];

      let doc = document.implementation.createDocument("", "", null);
      let parent = doc.createElement("SPEC");
      let row = doc.createElement("ROW");

      workbook.SheetNames.forEach((sheet, index) => {
        if(index === 2) { //3rd sheet
          //xls to json
          let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet], {defval: null});
          console.log('ROWOBJECT', rowObject, sheet, index)
          rowObject.forEach((i,x) => {
            //create xml child elem
            row = doc.createElement("ROW"+(x+1))
            let keys = Object.values(i)
            for(let a = 0; a<keys.length; a++){
              if(x >= 15 && a > 8) { //x = row, a = col
               //do nothing 
              } else {
                row.setAttribute("COL"+(a+1), keys[a]);       
              } 
                parent.appendChild(row)
            }
          })
          console.log("peopleElems", )
          setXml(parent.outerHTML.toString())
        }   
      });
      setTimeout(() => {
        setLoading(false)
      }, 3000);
      
    })
  }
 
const saveTemplateAsFile = (filename, dataObjToWrite) => {

  var pom = document.createElement('a');
  var bb = new Blob([dataObjToWrite], {type: 'text/plain'});

  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', filename);

  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true; 
  pom.classList.add('dragout');

  pom.click();
};

function submit() {
  saveTemplateAsFile("filename.xml", xml);
}
  return (
    <div className="App">
      <header className="App-header">
        <h3>Select xls file</h3>
      <input type="file" id="filepicker" name="testfile" onChange={handleChange} />
      { loading && (
        <div>CONVERTING XLS to XML...</div>
      )
      }
      <input type="button" onClick={submit} value="Download File" />
      
      </header>
    </div>
  );
}

export default App;
