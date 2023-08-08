import Busboy from 'busboy';

export function parseMultipartForm(event) {
  return new Promise((resolve) => {
    const fields = {};

    const busboy = Busboy({
      headers: event.headers,
    });

    busboy.on('file', (fieldname, filestream, filename, transferEncoding, mimeType) => {
      filestream.on('data', (data) => {
        fields[fieldname] = {
          filename: filename.filename,
          type: mimeType,
          content: data,
        };
      });
    });

    busboy.on('field', (fieldName, value) => {
      fields[fieldName] = value;
    });

    busboy.on('finish', () => {
      resolve(fields);
    });

    busboy.end(Buffer.from(event.body, 'base64'));
  });
}
