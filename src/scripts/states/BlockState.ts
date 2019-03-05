import { Animated } from "react-native";

export default class BlockState {
    constructor(){
        this.BlockColor= new Animated.Value(0);
    }
    BlockSize:number;
    BlockColor:Animated.Value;
    // Value: number=0;
    // IsClicked: boolean = false;
}