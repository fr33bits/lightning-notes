export const copyToClipboard = (text_to_copy) => {
    navigator.clipboard.writeText(text_to_copy)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }