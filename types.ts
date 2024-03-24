// deno-lint-ignore-file ban-types
interface Response {
  body: undefined | object | string;
  headers: Headers;
  status: number;
  type: undefined | string;
  writable: boolean;
}

interface Request {
  hasBody: boolean;
  headers: Headers;
  ip: string;
  ips: string[];
  method: string;
  secure: boolean;
  url: string;
  body: Function;
}
interface Video {
  thumbnailPublic?: string;
  dislikeCount?: number;
  viewsCount?: number;
  isKids?: boolean;
  uploadedBy?: string;
  title?: string;
  desc?: string;
  videoPublic?: string;
  comments?: Comment[];
}

interface Comment {
  comment: string;
  dislikeCount: number;
}

export type { Response, Request, Video, Comment };
