import io from 'socket.io-client';
import ParticipantsStore, {ParticipantInformation} from "../stores/ParticipantsStore";
import {action} from 'mobx';
import * as Event from 'events';

import CurrentUserInformationStore, {CurrentUserInformation} from "../stores/MyInfo";
import RoomStore, {RoomSummary} from "../stores/RoomStore";
import MyInfo from "../stores/MyInfo";
import ChatStore from "../stores/ChatStore";
import {Message, MessageSummary} from "../stores/MessagesStore";
import NotificationStore, {NotificationType, UINotification} from "../stores/NotificationStore";
import UIStore from "../stores/UIStore";
import {ResetStores} from "../util/ResetStores";


interface APIResponse {
    success: boolean,
    error: string | null,
    data?: any
}

class IO extends Event.EventEmitter {
    private io: SocketIOClient.Socket;

    constructor(ioAddress: string) {
        super();
        this.io = io(ioAddress);

        this.io.on("join-room", this._handleJoinRoom.bind(this));
        this.io.on("room-summary", this._handleRoomSummary.bind(this));
        this.io.on("destroy", this._handleRoomClosure.bind(this));
        this.io.on("error-event", this._handleError.bind(this));

        this.io.on("new-participant", this._handleNewParticipant.bind(this));
        this.io.on("participant-left", this._handleParticipantLeft.bind(this));


        this.io.on("new-room-message", this._handleNewMessage.bind(this));
        this.io.on("new-direct-message", this._handleNewMessage.bind(this));

        this.io.on("edit-room-message", this._handleEditMessage.bind(this));
        this.io.on("edit-direct-message", this._handleEditMessage.bind(this));

        this.io.on("delete-room-message", this._handleDeleteMessage.bind(this));
        this.io.on("delete-direct-message", this._handleDeleteMessage.bind(this));
    }

    createRoom(name: string) {
        console.log("Creating room...");
        this.io.emit("create-room", name);
    }

    joinRoom(id: string, name?: string) {
        this.io.emit("join-room", id, name);
    }

    _handleJoinRoom(id: string) {
        this.joinRoom(id, MyInfo.chosenName);
    }

    _handleError(type: string, content: string, code: string) {
        switch (code) {
            case 'J404': {
                if (!RoomStore.room) {
                    UIStore.store.modalStore.join = true;
                    NotificationStore.add(new UINotification(`Join Error: ${content}`, NotificationType.Error));
                }
                break;
            }
        }
    }

    @action
    _handleRoomSummary(roomSummary: RoomSummary) {
        ParticipantsStore.replace(roomSummary.participants);
        ChatStore.addParticipant(...roomSummary.participants);

        roomSummary.participants.forEach((participant: ParticipantInformation | CurrentUserInformation) => {
            if (participant.isMe) {
                CurrentUserInformationStore.info = participant as CurrentUserInformation;
            }
        });

        roomSummary.messages.forEach((message: MessageSummary) => {
            const realMessage = this.convertMessageSummaryToMessage(message);
            ChatStore.addMessage(realMessage);
        });

        RoomStore.room = roomSummary;

        this.emit("room-summary", roomSummary);
    }

    convertMessageSummaryToMessage(message: MessageSummary): Message {
        const replacementObj: any = {};
        replacementObj.from = ParticipantsStore.getById(message.from) || null;
        replacementObj.to = ParticipantsStore.getById(message.to) || null;
        replacementObj.reactions = JSON.parse(JSON.stringify(message.reactions));
        replacementObj.reactions.forEach((reaction: any) => {
            reaction.participant = ParticipantsStore.getById(reaction.participant);
        });
        return Object.assign({}, message, replacementObj) as Message;
    }

    _handleNewParticipant(participantSummary: ParticipantInformation) {
        ParticipantsStore.participants.push(participantSummary);
        NotificationStore.add(new UINotification(`${participantSummary.name} joined!`, NotificationType.Alert));
        this.emit("new-participant", participantSummary);
        ChatStore.participantJoined(participantSummary);
    }

    _handleParticipantLeft(participantId: string) {
        const participant: ParticipantInformation | undefined = ParticipantsStore.getById(participantId);
        if (participant) {
            participant.isAlive = false;
            ChatStore.participantLeft(participant);
            NotificationStore.add(new UINotification(`${participant.name} left!`, NotificationType.Alert));
        }
    }

    _handleRoomClosure() {
        NotificationStore.add(new UINotification(`Room was closed!`, NotificationType.Warning));
        ResetStores();
        UIStore.store.modalStore.joinOrCreate = true;
        this.emit("room-closure");
    }

    _handleNewMessage(messageSummary: MessageSummary) {
        const realMessage = this.convertMessageSummaryToMessage(messageSummary);
        ChatStore.addMessage(realMessage);
    }

    _handleEditMessage(messageSummary: MessageSummary) {
        const realMessage = this.convertMessageSummaryToMessage(messageSummary);
        ChatStore.editMessage(realMessage);
    }

    _handleDeleteMessage(messageSummary: MessageSummary) {
        ChatStore.removeMessage(messageSummary.id);
    }

    @action
    async sendDirect(to: ParticipantInformation | string, content: string) {
        const toId = typeof to === "string" ? to : to.id;
        const response = await this.apiRequest("send", {
            from: {
                id: CurrentUserInformationStore.info?.id,
                key: CurrentUserInformationStore.info?.key
            },
            to: toId,
            content
        });
        if (!response.success) {
            NotificationStore.add(new UINotification(`An error occurred sending the message: "${response.error}"`, NotificationType.Error));
            console.error("Sending Error: " + response.error);
            return;
        }
        ChatStore.addMessage({
            id: response.data.id,
            from: MyInfo.info!,
            to: ParticipantsStore.getById(toId)!,
            content: content,
            reactions: [],
            created: response.data.created
        });
        return true;
    }

    @action
    async sendToRoom(content: string) {
        const response = await this.apiRequest("send", {
            from: {
                id: CurrentUserInformationStore.info?.id,
                key: CurrentUserInformationStore.info?.key
            },
            to: "everyone",
            content
        });
        if (!response.success) {
            NotificationStore.add(new UINotification(`An error occurred sending the message: "${response.error}"`, NotificationType.Error));
            console.error("Sending Error: " + response.error);
            return;
        }
        ChatStore.addMessage({
            id: response.data.id,
            from: MyInfo.info!,
            to: ParticipantsStore.everyone,
            content: content,
            reactions: [],
            created: response.data.created
        });
        return true;
    }

    @action
    async edit(id: string, content: string) {
        const response = await this.apiRequest("edit", {
            from: {
                id: CurrentUserInformationStore.info?.id,
                key: CurrentUserInformationStore.info?.key
            },
            messageId: id,
            content
        });
        if (!response.success) {
            NotificationStore.add(new UINotification(`An error occurred editing the message: "${response.error}"`, NotificationType.Error));
            console.error("Editing Error: " + response.error);
            return;
        }
        const message = ChatStore.getMessageById(id);
        if (!message) {
            return true;
        }
        message.content = content;
        return true;
    }

    @action
    async delete(id: string, content: string) {
        const response = await this.apiRequest("delete", {
            from: {
                id: CurrentUserInformationStore.info?.id,
                key: CurrentUserInformationStore.info?.key
            },
            messageId: id,
        });
        if (!response.success) {
            NotificationStore.add(new UINotification(`An error occurred deleting the message: "${response.error}"`, NotificationType.Error));
            console.error("Deleting Error: " + response.error);
            return;
        }
        ChatStore.removeMessage(id);
        return true;
    }

    apiRequest(url: string, body: Object): Promise<APIResponse> {
        return new Promise(async (resolve, reject) => {
            const resp = await fetch(`http://${window.location.hostname}:3001/api/${RoomStore.room?.idHash}/${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await resp.json();
            resolve(data);
        });
    }

}

export default new IO("http://" + window.location.hostname + ":3001");