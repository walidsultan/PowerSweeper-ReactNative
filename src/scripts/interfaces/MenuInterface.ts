import { Difficulty } from "../enums/difficulty";
import * as Expo from "expo";

export default interface MenuInterface {
    onNewLevel(difficulty:Difficulty):any;   
    onTutorial():any;
    musicReference: Expo.Audio.Sound; 
}