import PopupInterface from "./PopupInterface";

export default interface LevelDifficultyInterface  extends PopupInterface{
    onEasyLevelClick:any;
    onMediumLevelClick:any;
    onHardLevelClick:any;
    onInsaneLevelClick:any;
    onAssistChange:any;
    isAssistEnabled:boolean;
}