// Upload.tsx
import React, { useEffect, useState } from "react";
import { Authenticator, Divider } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { getCurrentUser } from "aws-amplify/auth";
import useScrollToTop from "../ScrollToTop";
import CustomHeader from "./CustomMessaging"; // <- this is your header that renders AuthWithDua

const Upload: React.FC = () => {
  // ---- DUA / signup gating ----
  const [duaAccepted, setDuaAccepted] = useState(false);

  // Stamp DUA acceptance and any extra metadata at signup
  const services = {
    handleSignUp: async (formData: any) => {
      formData.signUpAttributes = {
        ...formData.signUpAttributes,
        "custom:duaAccepted": "true",
      };
      // optionally: formData.clientMetadata = { ...formData.clientMetadata, duaAccepted: "true" }
      return formData;
    },
  };

  const components = {
    Header: () => (
      <CustomHeader
        duaAccepted={duaAccepted}
        onDuaAgreed={() => setDuaAccepted(true)}
      />
    ),
  };

  // ---- Upload state / logic ----
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const inputRefFile = React.useRef<HTMLInputElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [folderMessage, setFolderMessage] = useState<string | undefined>("");
  const [fileMessage, setFileMessage] = useState<string | undefined>("");

  useScrollToTop();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute("webkitdirectory", "true");
    }
  }, []);

  useEffect(() => {
    if (files) handleUpload();
  }, [files]);

  const checkUserAuthorization = async () => {
    try {
      const { userId } = await getCurrentUser();
      return !!userId;
    } catch (err) {
      console.error("Error checking user authorization:", err);
      return false;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderMessage("");
    setFiles(event.target.files);
  };

  const handleSingleFileUpload = async () => {
    if (!file) {
      setFileMessage("No file selected");
      return;
    }
    try {
      const isAuthorized = await checkUserAuthorization();
      if (!isAuthorized) {
        setFileMessage("User not authorized to upload file.");
        return;
      }
      const filePath = file.type === "text/xml" ? `data/${file.name}` : `images/${file.name}`;
      await uploadData({ path: filePath, data: file });
      setFileMessage(`File ${file.name} uploaded successfully`);
      if (inputRefFile.current) inputRefFile.current.value = "";
      hideMessageAfterDelay();
    } catch (error) {
      console.error("Error uploading file:", error);
      setFileMessage("Error uploading file.");
    }
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleUpload = async () => {
    if (!files) {
      setFolderMessage("No files selected");
      return;
    }
    const BATCH_SIZE = 5;
    const DELAY = 1000;

    try {
      const isAuthorized = await checkUserAuthorization();
      if (!isAuthorized) {
        setFolderMessage("User not authorized to upload folder.");
        return;
      }

      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = Array.from(files).slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (f) => {
            const filePath = `data/${(f as any).webkitRelativePath || f.name}`;
            await uploadData({ path: filePath, data: f });
            setFolderMessage(`File ${f.name} uploaded successfully`);
          })
        );
        if (i + BATCH_SIZE < files.length) await sleep(DELAY);
      }
      setFolderMessage("Folder uploaded successfully");
      hideMessageAfterDelay();
    } catch (error) {
      console.error("Error uploading folder:", error);
      setFolderMessage("Error uploading folder.");
    }
  };

  const hideMessageAfterDelay = () => {
    setTimeout(() => {
      setFolderMessage(undefined);
      setFileMessage(undefined);
    }, 5000);
  };

  return (
    <Authenticator
      hideSignUp={!duaAccepted}
      services={services}
      className="authenticator-popup"
      components={components}
    >
      {() => (
        <div>
          <div className="separator" />
          <header className="banner1"></header>
          <h1 className="intro">Add Images and Annotations to Archive</h1>

          <Divider />

          <div className="upload-content">
            <h3>Upload Folder</h3>
            <input
              type="file"
              onChange={handleChange}
              multiple
              ref={inputRef}
              style={{ display: "none" }}
            />
            <button onClick={() => inputRef.current?.click()}>Select Folder</button>
            <div className="separator" />
            {folderMessage && <p>{folderMessage}</p>}

            <Divider />

            <h3>Upload File</h3>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              ref={inputRefFile}
            />
            <button onClick={handleSingleFileUpload} disabled={!file}>
              Upload File
            </button>
            {fileMessage && <p>{fileMessage}</p>}
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default Upload;
