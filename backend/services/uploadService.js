// TODO: Implement upload services

export const uploadImageService = async (file) => {
  // Image upload logic
  return { filename: file.filename, url: `/uploads/${file.filename}` }
}

export const uploadDocumentService = async (file) => {
  // Document upload logic
  return { filename: file.filename, url: `/uploads/${file.filename}` }
}

export const deleteFile = async (filename) => {
  // Delete file logic
  return { message: 'File deleted' }
}

export const getFileInfo = async (filename) => {
  // Get file info logic
  return { filename, size: 0 }
}
