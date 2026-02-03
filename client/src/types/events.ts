export interface Event {
  id: string;
  title: string;
  dateTime: string;
  venueName: string | null;
  address: string | null;
  imageUrl: string | null;
  organizer: string | null;
  price: string | null;
  sourceName: string;
  sourceUrl: string;
}
