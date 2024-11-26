export interface TranscriberUpdateData {
  status: string;
  data: {
    text: string;
    chunks: { text: string; timestamp: [number, number | null] }[];
    tps: number;
  };
}
