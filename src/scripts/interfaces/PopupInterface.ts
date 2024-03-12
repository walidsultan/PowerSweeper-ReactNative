export default interface PopupInterface {
    showPopup: boolean;
    onCloseClick: any;
    title: string;
    children: React.ReactNode;
}