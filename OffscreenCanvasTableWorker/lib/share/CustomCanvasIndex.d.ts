export declare enum ItemIndexType {
    GroupItems = 0,
    Index = 1
}
export interface GroupItems {
    type: ItemIndexType.GroupItems;
    list: GroupItem[];
}
export interface GroupItem {
    caption: string;
    child: (GroupItems | Index);
    isExpended: boolean;
}
export interface Index {
    type: ItemIndexType.Index;
    list: number[];
}
export declare type IndexType = Index | GroupItems;
