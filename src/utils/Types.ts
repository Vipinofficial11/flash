export interface responseType {
  results: string[];
  duration: number;
}

export type envConfig = {
  UPSTASH_REDIS_REST_TOKEN: string;
  UPSTASH_REDIS_REST_URL: string;
};
