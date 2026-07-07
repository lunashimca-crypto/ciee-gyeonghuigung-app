const chapter1Questions = [
  {
    id: "ch1-q1",
    chapter: 1,
    label: "Scout Log #01",
    type: "multiple_choice",
    question: "Gyeonghuigung Palace was one of the five grand palaces of which Korean dynasty?",
    options: ["Goryeo", "Joseon", "Silla", "Balhae"],
    answer: "B",
    image: "q2-1.jpg",
  },
  {
    id: "ch1-q2",
    chapter: 1,
    label: "Scout Log #02",
    type: "fill_blank",
    question:
      "The palace's original name was Gyeongdeokgung. It was renamed \"Gyeonghuigung\" in 1760, during the reign of King _____.",
    acceptedAnswers: ["yeongjo", "king yeongjo"],
    image: "q2-2.jpg",
  },
  {
    id: "ch1-q3",
    chapter: 1,
    label: "Scout Log #03",
    type: "multiple_choice",
    question: "Why don't most of Gyeonghuigung's original buildings still stand on their original site today?",
    options: [
      "They were destroyed in the Korean War",
      "They were moved and reused when Gyeongbokgung Palace was rebuilt",
      "They were sold to private owners",
      "They burned down in a fire in 1900",
    ],
    answer: "B",
    image: "q2-3.jpg",
  },
  {
    id: "ch1-q4",
    chapter: 1,
    label: "Scout Log #04",
    type: "multiple_choice",
    question: "What was Seoul called when King Taejo made it the royal capital in 1394?",
    options: ["Gyeongseong", "Hanseong", "Hanyang", "Namhan"],
    answer: "C",
    image: "q2-4.jpg",
  },
  {
    id: "ch1-q5",
    chapter: 1,
    label: "Scout Log #05",
    type: "fill_blank",
    question: "Zone 2 covers the period from 1863 to _____ (the year the Korean Empire ended).",
    acceptedAnswers: ["1910"],
    image: "q2-5.jpg",
  },
  {
    id: "ch1-q6",
    chapter: 1,
    label: "Scout Log #06",
    type: "multiple_choice",
    question: "During the Korean Empire era, Seoul's citizens experienced pressure from:",
    options: [
      "Only economic pressure from trade",
      "Reform movements and the beginning of Japanese colonization",
      "A major famine",
      "A foreign invasion by China",
    ],
    answer: "B",
    image: "q2-6.jpg",
  },
  {
    id: "ch1-q7",
    chapter: 1,
    label: "Scout Log #07",
    type: "multiple_choice",
    question: "During the Japanese colonial period (1910–1945), Seoul was renamed:",
    options: ["Hanyang", "Gyeongseong", "Hanseong", "Busan"],
    answer: "B",
    image: "q2-7.jpg",
  },
  {
    id: "ch1-q8",
    chapter: 1,
    label: "Scout Log #08",
    type: "multiple_choice",
    question:
      "Zone 4 covers Seoul's development from its liberation from Japan (1945) up to which major international event held in Seoul?",
    options: ["The Olympic Games (1988)", "The FIFA World Cup (2002)", "The G20 Summit", "The Asian Games"],
    answer: "B",
    image: "q2-8.jpg",
  },
  {
    id: "ch1-q9",
    chapter: 1,
    label: "Scout Log #09",
    type: "multiple_choice",
    question: "The large scale model of Seoul in the City Model Hall is built at what scale?",
    options: ["1:500", "1:1,500", "1:5,000", "1:15,000"],
    answer: "B",
    image: "q2-9.jpg",
  },
  {
    id: "ch1-q10",
    chapter: 1,
    label: "Scout Log #10",
    type: "fill_blank",
    question: "The exhibit's theme is \"Seoul, _____.\"",
    acceptedAnswers: ["now and in the making", "now, and in the making"],
    image: "q2-10.jpg",
  },
];

export const questions = [...chapter1Questions];

export const chapterContent = {
  1: {
    id: 1,
    theme: "seoulmuseum",
    title: "Mission in Gyeonghuigung: The Palace That Wouldn't Disappear",
    subtitle: "Seoul Museum of History",
    codename: "SCAVENGER HUNT: BURIED PALACE",
    threatLevel: "Elevated",
    lastKnownLocation: "Seoul Museum of History, Jongro-gu",
    introTitle: "Gyeonghuigung waits beyond the city streets",
    introCopy:
      "Once one of Seoul's grand palaces, nearly erased, but still here.",
    introImage: "ch2-intro.jpg",
    completionTitle: "Mission complete",
    completionCopy:
      "The file closes itself. There is nothing left to find or maybe everything, and it's up to you to notice it next time you look around.",
    completionHint: "The trail has reached its end, but the story is not over.",
    rankLadder: [
      { label: "Trainee Scout" },
      { label: "Scout" },
      { label: "Senior Scout" },
      { label: "Master Archivist" },
    ],
    stampText: "CONFIRMED",
    segments: [
      {
        story: {
          title: "Luna's Journal, Entry 1",
          body:
            "Heunghwamun — the front gate. Beyond it, an empty courtyard where Sungjeongjeon once stood, the throne hall of Joseon's kings. This was Gyeonghuigung, one of the dynasty's five grand palaces, tucked west of Gyeongbokgung and Changdeokgung — locals called it Seogwol, the West Palace. In 1760, a king gave it the name it still carries. But most of what should be standing here is just a footprint pressed into the grass. When another palace needed rebuilding, this one gave up its own timber, stone by stone, to finish someone else's story.",
          image: "journal-2a.jpg",
        },
        questions: chapter1Questions.slice(0, 3),
      },
      {
        story: {
          title: "Luna's Journal, Entry 2",
          body:
            "Inside, the museum splits Seoul's life into zones, like rings in a tree. Zone 1 opens in 1394, when a new king named his new capital. Zone 2 carries the city to the year an empire's flag came down for the last time — decades of reform pushed forward under a grip that kept tightening. Zone 3 opens on a city that isn't even allowed to keep its own name anymore. Every rename is a hand changing on the pen; whoever holds the city gets to say what it's called.",
          image: "journal-2b.jpg",
        },
        questions: chapter1Questions.slice(3, 7),
      },
      {
        story: {
          title: "Final Entry",
          body:
            "Zone 4 picks the city back up after liberation and carries it forward to the year the world came to Seoul to watch it run. Down in the City Model Hall, all of it — palace, colony, Olympic city — shrinks into one room, small enough to hold in a glance. Above it, one line ties the whole thing together: what this city has been, and what it's still becoming. If you're reading this, you finished what she started. Luna wasn't erased either — she just became part of the trail. Now you are too.",
          image: "journal-2c.jpg",
        },
        questions: chapter1Questions.slice(7, 10),
      },
    ],
  },
};
