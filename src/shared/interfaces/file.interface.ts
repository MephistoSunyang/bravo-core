export interface IFile {
  readonly buffer: Buffer;
  readonly encoding: string;
  readonly fieldname: string;
  readonly mimetype: string;
  readonly originalname: string;
  readonly size: number;
}
