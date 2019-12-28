export type RowItem = number | IGroupItem | null;

export type RowItemSelect = null | {
    path: Array<IGroupItems | IIndex>;
    select: number | IGroupItem;
    index: number;
};

export enum ItemIndexType { GroupItems, Index }
export interface IGroupItems {
    type: ItemIndexType.GroupItems;
    list: IGroupItem[];
}

export interface IGroupItem {
    caption: string;
    aggregate?: string;
    child: (IGroupItems | IIndex);
    isExpended: boolean;
}

export interface IIndex {
    type: ItemIndexType.Index;
    list: number[];
}

export type IndexType = IIndex | IGroupItems;
