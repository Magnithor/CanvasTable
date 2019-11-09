export enum ItemIndexType { GroupItems, Index }
export interface GroupItems {
    type: ItemIndexType.GroupItems,
    list: GroupItem[],
}

export interface GroupItem {
    caption: string,
    aggregate?: string
    child: (GroupItems|Index),
    isExpended: boolean
}
export interface Index {
    type: ItemIndexType.Index,
    list: number[]
}
export type IndexType = Index | GroupItems;