export interface Threads {
  page_rank: (options: any) => Promise<{ ranks: number[] }>;
}
