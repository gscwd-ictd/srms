export function createFormData(files: File | File[], filePath: string): FormData {
  const formData = new FormData();

  // Ensure the file is always treated as an array
  const fileArray = Array.isArray(files) ? files : [files];

  // Append each file to the form data
  fileArray.forEach((file) => {
    formData.append("file", file);
  });

  // Append fileName and folderName to the form data
  formData.append("fileName", filePath);
  formData.append("folderName", filePath);

  return formData;
}
