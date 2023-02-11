import { useRef, useState } from "react";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { uploadToServer } from "../api";

type EditorProps = {
  data?: any;
};

function useEditor() {
  const editor = useRef<SunEditorCore>();
  const [textValue, setTextValue] = useState<string>(" ");
  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  function handleImageUploadBefore(
    files: File[],
    info: any,
    uploadHandler: any
  ) {
    if (info) {
      uploadToServer(files[0]).then((result) => {
        const response = {
          result: [result],
        };
        uploadHandler(response);
      });
    }
    return false;
  }
  return {
    textValue,
    code: (
      <>
        <SunEditor
          getSunEditorInstance={getSunEditorInstance}
          height="500"
          width="100%"
          lang="zh_cn"
          onChange={(e) => setTextValue(e)}
          placeholder="Please type here..."
          onImageUploadBefore={(files, imageInfo, uploadHandler) =>
            handleImageUploadBefore(files, imageInfo, uploadHandler)
          }
          setOptions={{
            buttonList: [
              // Default
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              [
                "paragraphStyle",
                "blockquote",
                "bold",
                "underline",
                "italic",
                "strike",
                "fontColor",
                "hiliteColor",
                "subscript",
                "superscript",
              ],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["-left", "#fix", "dir_ltr", "dir_rtl"],
              ["removeFormat"],
              ["table", "link", "image", "video"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
          }}
        />
      </>
    ),
  };
}

export default useEditor;
