export class ChromeFilesApi {
  readFile<T>(path: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      chrome.fileSystemProvider.get()
    })
  }
}