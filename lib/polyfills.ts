// Define globals expected by pdfjs-dist used by pdf-parse in Node environments
if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.DOMMatrix = globalThis.DOMMatrix || class DOMMatrix {};
  // @ts-ignore
  globalThis.ImageData = globalThis.ImageData || class ImageData {};
  // @ts-ignore
  globalThis.Path2D = globalThis.Path2D || class Path2D {};
}

export {};
