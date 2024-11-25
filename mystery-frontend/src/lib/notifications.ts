import notificationSound from "@/assets/chat_sound.m4a";
const notificationAudio = new Audio(notificationSound);

export const playSound = () => notificationAudio.play();
export const vibrate = () => navigator.vibrate(200);
