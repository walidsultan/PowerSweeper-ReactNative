import { MineType } from "../enums/mineType";
import { Animated } from "react-native";

export default interface BlockInterface {
    Left: number;
    Top: number;
    Value: number;
    BlockSize: Animated.Value;
    onClick: any;
    onContextMenu: any;
    HasMine: boolean;
    Mine:MineType;
    IsClicked:boolean;
    MarkedState:MineType;
    IsTutorial:boolean;
    Highlight:boolean;
}