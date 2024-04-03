export function validateAudioFile(file: File) {
  return file.name.includes('.mp3') && file.type.includes('audio')
}
