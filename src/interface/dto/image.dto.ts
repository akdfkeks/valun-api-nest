export interface CreateImageDto {
  format: string;
  sourceName: string;
  regularName: string;
  sourceSize: number;
  compdSize: number;
  location: string;
}

export interface IUploadedImage {
  format: string;
  sourceName: string;
  regularName: string;
  sourceSize: number;
  compdSize: number;
  location: string;
}
