import {observable} from "mobx";

interface UIStoreInterface {
    chatPanel: boolean,
    participantPanel: boolean,
    modalStore: {
        joinOrCreate: boolean,
        join: boolean,
        joiningRoom: boolean,
        waitingRoom: boolean,
        create: boolean,
        settings: boolean
    },
    preFillJoinValue: null | string,
    messageIdEditControl: null | string,
    joinedDate: null | Date,
    title: string

    [key: string]: any,
}

class UIStore {
    static defaultProperties: UIStoreInterface = {
        chatPanel: true,
        participantPanel: true,
        modalStore: {
            joinOrCreate: false,
            join: false,
            joiningRoom: false,
            waitingRoom: false,
            create: false,
            settings: false
        },
        preFillJoinValue: null,
        messageIdEditControl: null,
        joinedDate: null,
        title: "BitLink"
    };
    @observable public store: UIStoreInterface = UIStore.defaultProperties;

    reset() {
        this.store = UIStore.defaultProperties;
    }

    toggle(property: string) {
        this.store[property] = !this.store[property];
    }
}


export default new UIStore();
