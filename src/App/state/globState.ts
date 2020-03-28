import APIMessage from '../../Interface/Message';

export default interface State { // All properties of the state should be optional as anyone can throw state changes without having to pass a certain property each time.
    isChatCollapsed?: boolean // make optional by adding a question mark before the colon.
    fullScreen?: boolean
    isParticipantListCollapsed?: boolean
    messages?: APIMessage[]
};

export const defaults: State = {

};