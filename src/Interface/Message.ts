import User from "./User";

export default interface Message {
    sender: User,
    messageContent: number[] // Note, this is DELIBERATE! I just built a chat app with Emoji Support and I learned there that converting the string into a char array ensures the best compatibility.
    timeStamp: Date
}