import DocumentPicker from 'react-native-document-picker'

export const pickAudio = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.audio],
      allowMultiSelection: true,
      copyTo: 'cachesDirectory'
    })
    return res

    // You can now use the file URI to play or upload the audio
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled the picker')
      return null
    } else {
      console.error('Unknown error: ', err)
      return null
    }
  }
}
