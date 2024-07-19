import {
  ArrowDownCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/16/solid";
import * as monaco from "monaco-editor";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Updater = () => {
  const [userPackageJson, setUserPackageJson] = useState<string>("");
  const [generatedPackageJson, setGeneratedPackageJson] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [updatePackagesCount, setUpdatePackagesCount] = useState<number>(0);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const generatedEditorRef = useRef<any>(null);

  function handleUserPackageJsonChange(value: string | undefined) {
    setUserPackageJson(value || "");
  }

  useEffect(() => {
    monaco.editor.defineTheme("cool-theme", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.foreground": "#ffffff",
        "editor.background": "#1a1b26",
        "editorCursor.foreground": "#ffffff",
        "editor.lineHighlightBackground": "#2f334d",
        "editorLineNumber.foreground": "#2f334d",
      },
    });
    monaco.editor.setTheme("cool-theme");
  });

  async function handleGeneratedPackageJsonChange(
    generatedPackageJsonParams: string
  ) {
    if (userPackageJson === "") return;
    setLoading(true);
    setUpdatePackagesCount(0);

    try {
      const packageJsonToObject = JSON.parse(generatedPackageJsonParams);
      const dependencies = [
        "dependencies",
        "devDependencies",
        "peerDependencies",
      ];

      for (const depType of dependencies) {
        if (packageJsonToObject[depType]) {
          for (const pkg of Object.keys(packageJsonToObject[depType])) {
            const res = await axios.get(
              `https://registry.npmjs.org/${pkg}/latest`
            );
            const latestVersion = `^${res.data.version}`;
            if (packageJsonToObject[depType][pkg] !== latestVersion) {
              setUpdatePackagesCount((prevCount) => prevCount + 1);
            }
            packageJsonToObject[depType][pkg] = latestVersion;
          }
        }
      }

      const formattedJson = JSON.stringify(packageJsonToObject, null, 2);
      setGeneratedPackageJson(formattedJson);
      if (generatedEditorRef.current) {
        generatedEditorRef.current.setValue(formattedJson);
        generatedEditorRef.current
          .getAction("editor.action.formatDocument")
          .run();
      }
      toast.success("Packages updated successfully");
      setIsUpdated(true);
    } catch (error) {
      setGeneratedPackageJson("");
      setIsUpdated(false);
      setUpdatePackagesCount(0);
      toast.error("Error updating packages");
      console.error("Error updating packages:", error);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-3 mt-10">
      <div>
        <h1 className="text-7xl font-bold tracking-tight text-[#dbdbdd] w-1/2">
          UPDATE YOU NPM PACKAGES
        </h1>
        <p className="text-[#dbdbdd] font-light text-xl mt-2 inline-flex items-center gap-2 justify-center">
          Paste your package.json here{" "}
          <ArrowDownCircleIcon className="h-6 w-6 animate-bounce" />
        </p>
      </div>
      {loading && (
        <div className="text-green-400 font-semibold text-xl mt-8">
          updating packages... {updatePackagesCount}
        </div>
      )}

      {isUpdated && (
        <div className="text-green-400 font-semibold inline-flex items-center gap-2 justify-center text-xl mt-8">
          Updated {updatePackagesCount} packages
          <CheckCircleIcon className="h-6 w-6 text-green-400" />
        </div>
      )}

      <div className="flex justify-between rounded-lg gap-10 mt-2">
        <div className="w-full bg-[#2f3343] px-0.5 pb-0.5 ">
          <div className="flex items-center justify-between p-1">
            <h4 className="text-base uppercase px-2 font-medium tracking-tight text-[#dbdbdd]">
              Your Package.json
            </h4>
            <button
              onClick={() => handleGeneratedPackageJsonChange(userPackageJson)}
              disabled={loading}
              className="px-3 py-0.5 inline-flex items-center justify-center gap-2 active:bg-gray-400/10 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 border border-gray-400 uppercase"
            >
              {loading && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4  animate-spin text-gray-600 fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
          <Editor
            language="json"
            className="rounded-xl"
            height="70vh"
            theme="cool-theme"
            value={userPackageJson}
            onChange={handleUserPackageJsonChange}
            options={{
              minimap: { enabled: false },
              lineNumbers: "on",
              lineNumbersMinChars: 2,
              renderLineHighlight: "none",
              codeLens: false,
              stickyScroll: { enabled: false },
              scrollbar: { vertical: "hidden", horizontal: "hidden" },
              smoothScrolling: false,
              overviewRulerLanes: 0,
              overviewRulerBorder: false,
              "semanticHighlighting.enabled": false,
            }}
          />
        </div>
        <div className="w-full bg-[#2f3343] px-0.5 pb-0.5">
          <div className="flex items-center justify-between py-1.5">
            <h4 className="text-base uppercase px-2 font-medium tracking-tight text-[#dbdbdd]">
              Your Updated Package.json
            </h4>
          </div>
          <Editor
            onMount={(editor) => {
              generatedEditorRef.current = editor;
            }}
            language="json"
            className="rounded-xl"
            height="70vh"
            theme="cool-theme"
            value={generatedPackageJson}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: "on",
              lineNumbersMinChars: 2,
              renderLineHighlight: "none",
              codeLens: false,
              stickyScroll: { enabled: false },
              scrollbar: { vertical: "hidden", horizontal: "hidden" },
              smoothScrolling: false,
              overviewRulerLanes: 0,
              overviewRulerBorder: false,
              "semanticHighlighting.enabled": false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Updater;
