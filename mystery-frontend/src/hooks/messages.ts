import { useQuery } from "@tanstack/react-query";

import type { Message } from "@/types";

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: mockedFetchMessages,
  });
}

function mockedFetchMessages() {
  return new Promise<Message[]>((resolve) => {
    setTimeout(() => {
      resolve(MOCKED_MESSAGES);
    }, 2000);
  });
}

const MOCKED_MESSAGES: Message[] = [
  {
    meta: {
      id: "msg-1",
      timestamp: "2024-10-27T12:15:23Z",
      name: "Admiral Anchovy",
      avatar: "https://i.pravatar.cc/150?img=52",
    },
    content: "Who's up for a seafood-themed game night? 🎮 🦐",
  },
  {
    meta: {
      id: "msg-2",
      timestamp: "2024-10-27T12:17:45Z",
      name: "Prince Olive",
      avatar: "https://i.pravatar.cc/150?img=61",
    },
    content:
      "Count me in! I've got some Mediterranean board games we could try 🫒",
  },
  {
    meta: {
      id: "msg-3",
      timestamp: "2024-10-27T12:17:45Z",
      name: "The Muffin Girl",
      avatar: "https://i.pravatar.cc/150?img=23",
    },
    content: "Count me in! I'll bring my special blueberry muffins! 🧁",
  },
  {
    meta: {
      id: "msg-4",
      timestamp: "2024-10-27T12:20:12Z",
      name: "Baroness von Burrito",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    content: "Only if we can order from that new Mexican place 🌯",
  },
  {
    meta: {
      id: "msg-5",
      timestamp: "2024-10-27T12:45:30Z",
      name: "Prince Olive",
      avatar: "https://i.pravatar.cc/150?img=61",
    },
    content:
      "Baroness, that place has amazing olive tapenade! Their fusion menu is incredible 🫒🌯",
  },
  {
    meta: {
      id: "msg-6",
      timestamp: "2024-10-27T12:45:30Z",
      name: "Nacho Knight",
      avatar: "https://i.pravatar.cc/150?img=53",
    },
    content:
      "Did someone say Mexican? I shall defend the honor of proper nachos! 🏰 🧀",
  },
  {
    meta: {
      id: "msg-7",
      timestamp: "2024-10-27T12:50:15Z",
      name: "Doctor Grape",
      avatar: "https://i.pravatar.cc/150?img=54",
    },
    content: "I prescribe a healthy dose of wine for everyone 🍷",
  },
  {
    meta: {
      id: "msg-8",
      timestamp: "2024-10-27T13:05:00Z",
      name: "Lady Raisin",
      avatar: "https://i.pravatar.cc/150?img=26",
    },
    content: "Doctor Grape, you always have the best prescriptions! 😄",
  },
  {
    meta: {
      id: "msg-9",
      timestamp: "2024-10-27T13:15:45Z",
      name: "The Tofu Titan",
      avatar: "https://i.pravatar.cc/150?img=55",
    },
    content: "Any chance we could get some vegetarian options? 🌱",
  },
  {
    meta: {
      id: "msg-10",
      timestamp: "2024-10-27T13:20:33Z",
      name: "Prince Olive",
      avatar: "https://i.pravatar.cc/150?img=61",
    },
    content:
      "I've got you covered, Tofu Titan! I'll bring my special olive and sundried tomato spread 🫒🍅",
  },
  {
    meta: {
      id: "msg-11",
      timestamp: "2024-10-27T13:20:33Z",
      name: "Countess Carbonara",
      avatar: "https://i.pravatar.cc/150?img=27",
    },
    content: "I'll bring my signature pasta dish! 🍝",
  },
  {
    meta: {
      id: "msg-12",
      timestamp: "2024-10-27T13:25:18Z",
      name: "Major Bolognese",
      avatar: "https://i.pravatar.cc/150?img=56",
    },
    content:
      "Countess, your carbonara versus my bolognese - let the people decide! 😤",
  },
  {
    meta: {
      id: "msg-13",
      timestamp: "2024-10-27T13:30:42Z",
      name: "Lady Camembert",
      avatar: "https://i.pravatar.cc/150?img=28",
    },
    content: "I'll bring the cheese board! 🧀",
  },
  {
    meta: {
      id: "msg-14",
      timestamp: "2024-10-27T13:45:20Z",
      name: "Sir Cucumber",
      avatar: "https://i.pravatar.cc/150?img=57",
    },
    content:
      "Staying cool as a cucumber while watching this food battle unfold 🥒",
  },
  {
    meta: {
      id: "msg-15",
      timestamp: "2024-10-27T13:50:05Z",
      name: "Colonel Mustard",
      avatar: "https://i.pravatar.cc/150?img=58",
    },
    content: "In the kitchen with the sauce pan! 🕵️‍♂️",
  },
  {
    meta: {
      id: "msg-16",
      timestamp: "2024-10-27T13:55:30Z",
      name: "Prince Pickle",
      avatar: "https://i.pravatar.cc/150?img=59",
    },
    content: "This party is going to be kind of a big dill 😏",
  },
  {
    meta: {
      id: "msg-17",
      timestamp: "2024-10-27T14:00:15Z",
      name: "Major Sriracha",
      avatar: "https://i.pravatar.cc/150?img=60",
    },
    content: "I'll spice things up! 🌶️",
  },
  {
    meta: {
      id: "msg-18",
      timestamp: "2024-10-27T14:05:45Z",
      name: "Madame Potato",
      avatar: "https://i.pravatar.cc/150?img=29",
    },
    content: "I'm ready to mash this party! 🥔",
  },
  {
    meta: {
      id: "msg-19",
      timestamp: "2024-10-27T14:07:30Z",
      name: "General Ginger",
      avatar: "https://i.pravatar.cc/150?img=62",
    },
    content: "Should we set up teams for the games? 🎲",
  },
  {
    meta: {
      id: "msg-20",
      timestamp: "2024-10-27T14:08:15Z",
      name: "Prince Olive",
      avatar: "https://i.pravatar.cc/150?img=61",
    },
    content:
      "Great idea! Teams of 4? I can help organize since I'm bringing the games 🎮 We could do a Mediterranean vs Latin American cuisine showdown! 🫒 vs 🌮",
  },
  {
    meta: {
      id: "msg-21",
      timestamp: "2024-10-27T14:09:00Z",
      name: "Sergeant Barbecue",
      avatar: "https://i.pravatar.cc/150?img=63",
    },
    content: "Can we add a grilling category to this competition? 🔥",
  },
];
