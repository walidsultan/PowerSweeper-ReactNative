import { Difficulty } from "../enums/difficulty";
import { Audio } from 'expo-av';

export default interface MenuInterface {
    onNewLevel(difficulty:Difficulty):any;   
    onTutorial():any;
    musicReference: Audio.Sound; 
    onAssistChange:any;
    isAssistEnabled:boolean;
}