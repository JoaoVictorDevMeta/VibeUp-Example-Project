import { atom } from 'jotai';

export const chatsAtom = atom([]);

export const selectedConversationAtom = atom({
    id: "",
    userId: "",
    username: "",
    userProfilePic: "",
});