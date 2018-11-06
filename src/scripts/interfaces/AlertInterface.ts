import PopupInterface from "./PopupInterface";

export default interface AlertInterface  extends PopupInterface{
    message:string;
    onOkClick:any;
    onCancelClick:any;
}