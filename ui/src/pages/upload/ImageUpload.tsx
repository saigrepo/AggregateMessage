import axios, { AxiosProgressEvent, CancelTokenSource } from "axios";
import {
    AudioWaveform,
    File,
    FileImage,
    FolderArchive,
    UploadCloud,
    Video,
    X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "../../components/ui/input.tsx";
import { FileTypes } from "../../models/model-types.ts";
import { AudioColor, ImageColor, OtherColor, PdfColor, VideoColor } from "./uploadColors.ts";
import {FILE_DELETE_ROUTE, FILE_UPLOAD_ROUTE} from "../../utils/Constants.ts";
import apiClient from "../../lib/api-client.ts";
import { Button } from "../../components/ui/button.tsx";

interface FileUploadProgress {
    file: File;
    progress: number;
    source: CancelTokenSource | null;
}

export default function ImageUpload({ listOfuploadfile, uploadTriggered }) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);

    const getFileIconAndColor = (file: File) => {
        if (file.type.includes(FileTypes.Image)) {
            return {
                icon: <FileImage size={40} className={ImageColor.fillColor} />,
                color: ImageColor.bgColor,
            };
        }

        if (file.type.includes(FileTypes.Pdf)) {
            return {
                icon: <File size={40} className={PdfColor.fillColor} />,
                color: PdfColor.bgColor,
            };
        }

        if (file.type.includes(FileTypes.Audio)) {
            return {
                icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
                color: AudioColor.bgColor,
            };
        }

        if (file.type.includes(FileTypes.Video)) {
            return {
                icon: <Video size={40} className={VideoColor.fillColor} />,
                color: VideoColor.bgColor,
            };
        }

        return {
            icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
            color: OtherColor.bgColor,
        };
    };

    const removeFile = (file: File) => {
        setFilesToUpload((prevUploadProgress) => {
            return prevUploadProgress.filter((item) => item.file !== file);
        });

        setUploadedFiles((prevUploadedFiles) => {
            return prevUploadedFiles.filter((item) => item !== file);
        });

        deleteImageFromS3Bucket(file.name);
    };

    const deleteImageFromS3Bucket = async (
        fileName: string
    ) => {
        return apiClient.delete(
            `${FILE_DELETE_ROUTE}/${fileName}`);
    };


    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFilesToUpload((prevUploadProgress) => {
            return [
                ...prevUploadProgress,
                ...acceptedFiles.map((file) => ({
                    progress: 0,
                    file,
                    source: null,
                })),
            ];
        });
    }, []);

    const uploadFiles = async () => {
        const fileUploadBatch = filesToUpload.map(async (fileUploadProgress) => {
            const formData = new FormData();
            formData.append("file", fileUploadProgress.file);

            const cancelSource = axios.CancelToken.source();
            await apiClient.post(FILE_UPLOAD_ROUTE, formData, {
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / (progressEvent.total ?? 0)) * 100
                    );
                    setFilesToUpload((prevUploadProgress) => {
                        return prevUploadProgress.map((item) => {
                            if (item.file.name === fileUploadProgress.file.name) {
                                return { ...item, progress };
                            }
                            return item;
                        });
                    });
                },
                cancelToken: cancelSource.token,
            });

            setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, fileUploadProgress.file]);
        });
        await Promise.all(fileUploadBatch);
    };

    useEffect(() => {
        console.log(uploadedFiles);
        listOfuploadfile(uploadedFiles);
    }, [setUploadedFiles, uploadedFiles]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <div>
                <label
                    {...getRootProps()}
                    className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                    <div className=" text-center">
                        <div className=" border p-2 rounded-md max-w-min mx-auto">
                            <UploadCloud size={20} />
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold">Drag files</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Click to upload files &#40;files should be under 10 MB&#41;
                        </p>
                    </div>
                </label>

                <Input {...getInputProps()} id="dropzone-file" accept="image/png, image/jpeg" type="file" className="hidden" />
            </div>

            {filesToUpload.length > 0 && (
                <div>
                    <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
                        Files to Upload
                    </p>
                    <div className="space-y-2 pr-3">
                        {filesToUpload.map(({ file, progress }) => (
                            <div
                                key={file.lastModified}
                                className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2 hover:border-slate-300 transition-all"
                            >
                                <div className="flex items-center flex-1 p-2">
                                    <div className="text-white">
                                        {getFileIconAndColor(file).icon}
                                    </div>
                                    <div className="w-full ml-2 space-y-1">
                                        <div className="text-sm flex justify-between">
                                            <p className="text-muted-foreground ">{file.name.slice(0, 25)}</p>
                                        </div>
                                        <p>Progress: {progress}%</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(file)}
                                    className="bg-red-500 text-white transition-all items-center justify-center px-2 hidden group-hover:flex"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                        <Button
                            variant="primary"
                            onClick={uploadFiles}>
                            Upload
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
