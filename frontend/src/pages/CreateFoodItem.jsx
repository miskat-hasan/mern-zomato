import axios from "axios";
import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MAX_VIDEO_MB = 50;

const CreateFoodItem = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const validateAndSetFile = useCallback((f) => {
    setError("");
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please upload a valid video file.");
      return;
    }
    const mb = f.size / (1024 * 1024);
    if (mb > MAX_VIDEO_MB) {
      setError(`Video is too large. Max ${MAX_VIDEO_MB} MB allowed.`);
      return;
    }
    setFile(f);
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    validateAndSetFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    validateAndSetFile(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please attach a video for the food item.");
    if (!name.trim()) return setError("Please enter a name.");

    // For now only UI: construct FormData (ready for integration)
    const fd = new FormData();
    fd.append("video", file);
    fd.append("name", name.trim());
    fd.append("description", description.trim());

    // TODO: send to backend (example POST)
    axios
      .post("http://localhost:3000/api/food", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => console.log(response.data.food))
      .catch((err) => {
        console.log(err);
      });

    // Reset form after successful submission (here we just clear)
    setName("");
    setDescription("");
    setFile(null);
    setError("");
    // alert(
    //   "(UI) Food item prepared to upload — integrate backend call to submit."
    // );
    navigate('/')
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Create Food Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Video drop area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video
            </label>

            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`w-full rounded-xl border-2 ${
                dragActive
                  ? "border-indigo-400 bg-indigo-50/50"
                  : "border-dashed border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-800"
              } p-3 min-h-[200px] flex flex-col items-center justify-center gap-3 transition-colors`}
            >
              {!previewUrl && (
                <>
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Drag & drop a short video here, or
                    </p>
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                    >
                      Select Video
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      MP4, WebM etc. Max {MAX_VIDEO_MB} MB
                    </p>
                  </div>
                </>
              )}

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={onFileChange}
                className="hidden"
                aria-hidden="true"
              />

              {/* preview */}
              {previewUrl && (
                <div className="w-full flex flex-col sm:flex-row gap-3 items-start">
                  <div className="w-full sm:w-2/3 bg-black rounded-lg overflow-hidden border border-gray-700">
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-200">{file?.name}</div>
                      <div className="text-xs text-gray-400">
                        {(file?.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="px-3 py-2 bg-gray-700 text-white rounded-md text-sm"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a short, descriptive title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the food item (ingredients, spice level, portion size)..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setDescription("");
                setFile(null);
                setError("");
              }}
              className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFoodItem;
