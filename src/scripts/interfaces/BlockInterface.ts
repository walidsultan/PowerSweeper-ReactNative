import { MineType } from "../enums/mineType";

export default interface BlockInterface {
    Left: number;
    Top: number;
    Value: number;
    BlockSize: number;
    onClick: any;
    onContextMenu: any;
    HasMine: boolean;
    Mine:MineType;
    IsClicked:boolean;
    MarkedState:MineType;
}