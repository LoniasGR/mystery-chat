import notificationSound from "@/assets/notification.aac";
const notificationAudio = new Audio(notificationSound);

export const playSound = () => notificationAudio.play();
export const vibrate = () => navigator.vibrate(200);
