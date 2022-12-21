export interface Content {
  Key: string;
  LastModified: Date;
  ETag: string;
  ChecksumAlgorithm: Array<any>;
  Size: number;
  StorageClass: string;
  Owner: { DisplayName: string; ID: string };
}
