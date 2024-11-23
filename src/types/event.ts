export interface Event {
  _id: string;
  eventType: string;
  timestamp: string;
  sourceAppId: string;
  data: any;
  hash: string;
  previousHash: string;
}