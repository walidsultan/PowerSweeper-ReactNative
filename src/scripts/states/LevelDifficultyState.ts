import { Animated } from "react-native";

export default class LevelDifficultyState {
    constructor(){
        this.EasyButtonOpacity= new Animated.Value(1);
        this.MediumButtonOpacity= new Animated.Value(1);
        this.HardButtonOpacity= new Animated.Value(1);
        this.InsaneButtonOpacity= new Animated.Value(1);
    }
    EasyButtonOpacity:Animated.Value;
    MediumButtonOpacity:Animated.Value;
    HardButtonOpacity:Animated.Value;
    InsaneButtonOpacity:Animated.Value;
}