export function createFileFormData(file: File, filePath: string): FormData {
  const formData = new FormData();
  formData.append("fileName", filePath);
  formData.append("file", file);
  return formData;
}
