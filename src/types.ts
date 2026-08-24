export type Category = 'mcu' | 'xmen' | 'series';

export interface TrackerItem {
  id: string;
  title: string;
  category: Category;
  originalIndex: number;
  watched: boolean;
}
