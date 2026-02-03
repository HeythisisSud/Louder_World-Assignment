export interface EventInput {
  title: string;
  sourceUrl: string;
  sourceName?: string;
  venueName?: string;
  city?: string;
  description?: string;
}


export interface TicketQuery {
  eventId: string;
  email: string;
  consent?: boolean; // query values are always strings
}
