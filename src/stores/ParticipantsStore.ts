import {observable} from "mobx"
import {types} from "mediasoup-client";

export interface MediaState {
    cameraEnabled: boolean,
    microphoneEnabled: boolean,
}

export interface ParticipantInformation {
    id: string,
    name: string,
    mediaState: MediaState,
    isHost: boolean,
    isMe: boolean,
    isAlive: boolean,
    mediasoup?: {
        consumer: {
            video: types.Consumer | null,
            audio: types.Consumer | null
        }
    }
}

class ParticipantsStore {

    public system: ParticipantInformation = {
        id: "system",
        isAlive: true,
        isHost: false, isMe: false, name: "System",
        mediaState: {
            cameraEnabled: false,
            microphoneEnabled: false
        }
    };

    public everyone: ParticipantInformation = {
        id: "everyone",
        isAlive: true,
        isHost: false, isMe: false, name: "everyone",
        mediaState: {
            cameraEnabled: false,
            microphoneEnabled: false
        }
    };

    public participants = observable<ParticipantInformation>([this.system, this.everyone]);

    reset() {
        this.participants.replace([this.system, this.everyone]);
    }

    replace(array: Array<ParticipantInformation>){
        this.participants.replace([this.system, this.everyone, ...array]);
    }

    getById(id: string): ParticipantInformation | undefined {
        return this.participants?.find((participant: ParticipantInformation) => participant.id === id);
    }

    getIndexById(id: string): number | undefined {
        return this.participants?.findIndex((participant: ParticipantInformation) => participant.id === id);
    }

}


export default new ParticipantsStore();
