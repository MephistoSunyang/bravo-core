export interface IResult<IContent = any> {
  readonly content: IContent;
  readonly code: number;
  readonly message: string;
}
