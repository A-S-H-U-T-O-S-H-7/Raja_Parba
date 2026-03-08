export const ASSESSMENT_TYPES = {
  RAJA_QUEEN: "rajaQueen",
  RAJA_KUMARI: "rajaKumari",
  DRAWING_SENIOR: "drawingSenior",
  DRAWING_JUNIOR: "drawingJunior",
};

export const assessmentTrackConfig = {
  [ASSESSMENT_TYPES.RAJA_QUEEN]: {
    key: ASSESSMENT_TYPES.RAJA_QUEEN,
    label: "Raja Queen",
    collection: "raja_queen_applications",
    requiresDrawingCategory: null,
    steps: [
      {
        id: "rangoliSubmission",
        type: "media_bundle",
        title: "Rangoli Competition",
        description: "Upload a video of creating the rangoli (max 5 min) and final rangoli image.",
        fields: [
          {
            key: "processVideo",
            label: "Rangoli Process Video",
            accept: "video/mp4,video/quicktime,video/webm",
            inputType: "video",
            maxDurationSec: 300,
          },
          {
            key: "finalImage",
            label: "Final Rangoli Image",
            accept: "image/jpeg,image/png,image/webp,image/jpg",
            inputType: "image",
          },
        ],
      },
      { id: "quiz", type: "quiz", title: "Quiz Competition", description: "15 questions, 5 minutes. Auto-submit after timeout." },
      {
        id: "dressAttireSubmission",
        type: "media_bundle",
        title: "Dress / Attire",
        description: "Upload a 3-minute dress walk video and one attire image.",
        fields: [
          {
            key: "attireWalkVideo",
            label: "Dress Walk Video",
            accept: "video/mp4,video/quicktime,video/webm",
            inputType: "video",
            maxDurationSec: 60,
          },
          {
            key: "attireImage",
            label: "Attire Image",
            accept: "image/jpeg,image/png,image/webp,image/jpg",
            inputType: "image",
          },
        ],
      },
      {
        id: "selfIntroduction",
        type: "video_upload",
        title: "Self-Introduction",
        description: "Upload a self-introduction video (max 1 minute).",
        maxDurationSec: 60,
      },
      {
        id: "zoomMeeting",
        type: "zoom_slot",
        title: "Zoom Meeting",
        description: "Admin will publish your Zoom link, schedule and notes here.",
        adminManaged: true,
      },
    ],
  },
  [ASSESSMENT_TYPES.RAJA_KUMARI]: {
    key: ASSESSMENT_TYPES.RAJA_KUMARI,
    label: "Raja Kumari",
    collection: "raja_kumari_applications",
    requiresDrawingCategory: null,
    steps: [
      {
        id: "rangoliSubmission",
        type: "media_bundle",
        title: "Rangoli Competition",
        description: "Upload a video of creating the rangoli (max 5 min) and final rangoli image.",
        fields: [
          {
            key: "processVideo",
            label: "Rangoli Process Video",
            accept: "video/mp4,video/quicktime,video/webm",
            inputType: "video",
            maxDurationSec: 300,
          },
          {
            key: "finalImage",
            label: "Final Rangoli Image",
            accept: "image/jpeg,image/png,image/webp,image/jpg",
            inputType: "image",
          },
        ],
      },
      { id: "quiz", type: "quiz", title: "Quiz Competition", description: "15 questions, 5 minutes. Auto-submit after timeout." },
      {
        id: "dressAttireSubmission",
        type: "media_bundle",
        title: "Dress / Attire",
        description: "Upload a 3-minute dress walk video and one attire image.",
        fields: [
          {
            key: "attireWalkVideo",
            label: "Dress Walk Video",
            accept: "video/mp4,video/quicktime,video/webm",
            inputType: "video",
            maxDurationSec: 60,
          },
          {
            key: "attireImage",
            label: "Attire Image",
            accept: "image/jpeg,image/png,image/webp,image/jpg",
            inputType: "image",
          },
        ],
      },
      {
        id: "selfIntroduction",
        type: "video_upload",
        title: "Self-Introduction",
        description: "Upload a self-introduction video (max 1 minute).",
        maxDurationSec: 60,
      },
      {
        id: "zoomMeeting",
        type: "zoom_slot",
        title: "Zoom Meeting",
        description: "Admin will publish your Zoom link, schedule and notes here.",
        adminManaged: true,
      },
    ],
  },
  [ASSESSMENT_TYPES.DRAWING_SENIOR]: {
    key: ASSESSMENT_TYPES.DRAWING_SENIOR,
    label: "Drawing (Senior)",
    collection: "drawing_applications",
    requiresDrawingCategory: "senior",
    steps: [
      {
        id: "drawingThemeVideo",
        type: "media_bundle",
        title: "Drawing Theme Submission",
        description: "Upload drawing process video (max 5 min) and final drawing image.",
        fields: [
          {
            key: "processVideo",
            label: "Drawing Process Video",
            accept: "video/mp4,video/quicktime,video/webm",
            inputType: "video",
            maxDurationSec: 300,
          },
          {
            key: "finalImage",
            label: "Final Drawing Image",
            accept: "image/jpeg,image/png,image/webp,image/jpg",
            inputType: "image",
          },
        ],
      },
      { id: "quiz", type: "quiz", title: "Quiz Competition", description: "15 questions, 5 minutes. Auto-submit after timeout." },
      {
        id: "selfIntroduction",
        type: "video_upload",
        title: "Self-Introduction",
        description: "Upload a self-introduction video (max 1 minute).",
        maxDurationSec: 60,
      },
    ],
  },
  [ASSESSMENT_TYPES.DRAWING_JUNIOR]: {
    key: ASSESSMENT_TYPES.DRAWING_JUNIOR,
    label: "Drawing (Junior)",
    collection: "drawing_applications",
    requiresDrawingCategory: "junior",
    steps: [
      {
        id: "drawingThemeVideo",
        type: "media_bundle",
        title: "Drawing Theme Submission",
        description: "Upload drawing process video (max 5 min) and final drawing image.",
        fields: [
          {
            key: "processVideo",
            label: "Drawing Process Video",
            accept: "video/mp4,video/quicktime,video/webm",
            inputType: "video",
            maxDurationSec: 300,
          },
          {
            key: "finalImage",
            label: "Final Drawing Image",
            accept: "image/jpeg,image/png,image/webp,image/jpg",
            inputType: "image",
          },
        ],
      },
      { id: "quiz", type: "quiz", title: "Quiz Competition", description: "15 questions, 5 minutes. Auto-submit after timeout." },
      {
        id: "selfIntroduction",
        type: "video_upload",
        title: "Self-Introduction",
        description: "Upload a self-introduction video (max 1 minute).",
        maxDurationSec: 60,
      },
    ],
  },
};

const baseQuizQuestionBank = [
  {
    id: "q1",
    question: "Raja festival is primarily associated with which Indian state?",
    options: ["Odisha", "West Bengal", "Assam", "Bihar"],
    answer: "Odisha",
  },
  {
    id: "q2",
    question: "Raja Parba is celebrated mainly to honor:",
    options: ["Womanhood and Earth", "Harvest only", "Monsoon arrival only", "Temple consecration"],
    answer: "Womanhood and Earth",
  },
  {
    id: "q3",
    question: "Traditional Raja celebrations commonly include:",
    options: ["Swings and folk activities", "Boat races only", "Kite flying only", "Camel racing"],
    answer: "Swings and folk activities",
  },
  {
    id: "q4",
    question: "In cultural contests, fair play means:",
    options: ["Submitting your own work", "Copying from internet", "Asking someone else to perform", "Editing after deadline secretly"],
    answer: "Submitting your own work",
  },
  {
    id: "q5",
    question: "Good stage discipline includes:",
    options: ["Following instructions and timing", "Ignoring event rules", "Interrupting other participants", "Skipping mandatory steps"],
    answer: "Following instructions and timing",
  },
  {
    id: "q6",
    question: "For an online assessment, stable participation requires:",
    options: ["Reliable internet and preparedness", "Opening multiple tabs for answers", "Using another person’s account", "Muting instructions always"],
    answer: "Reliable internet and preparedness",
  },
  {
    id: "q7",
    question: "A fair quiz attempt should be:",
    options: ["Individual and honest", "Shared in group chat", "Searched on web during timer", "Attempted by someone else"],
    answer: "Individual and honest",
  },
  {
    id: "q8",
    question: "Cultural attire round evaluates:",
    options: ["Presentation, confidence and relevance", "Only expensive clothing", "Only makeup", "Only brand labels"],
    answer: "Presentation, confidence and relevance",
  },
  {
    id: "q9",
    question: "A clear self-introduction should include:",
    options: ["Name, background and motivation", "Only social media links", "Only school name", "No personal context"],
    answer: "Name, background and motivation",
  },
  {
    id: "q10",
    question: "Video submission quality is better when:",
    options: ["Lighting and audio are clear", "Room is very dark", "Camera is unstable", "Audio is muted unintentionally"],
    answer: "Lighting and audio are clear",
  },
  {
    id: "q11",
    question: "Raja Queen and Raja Kumari tracks both include:",
    options: ["Rangoli and quiz rounds", "Only debate", "Only athletics", "Only painting"],
    answer: "Rangoli and quiz rounds",
  },
  {
    id: "q12",
    question: "Senior and Junior drawing tracks differ mainly by:",
    options: ["Candidate category/level", "Event location", "Whether quiz exists", "Whether intro exists"],
    answer: "Candidate category/level",
  },
  {
    id: "q13",
    question: "If quiz timer ends, system should:",
    options: ["Auto-submit answers", "Restart timer automatically", "Delete session", "Allow unlimited retries"],
    answer: "Auto-submit answers",
  },
  {
    id: "q14",
    question: "Best behavior in Zoom assessment is:",
    options: ["Joining on time and staying attentive", "Joining late without notice", "Keeping camera away always", "Talking over judges"],
    answer: "Joining on time and staying attentive",
  },
  {
    id: "q15",
    question: "Primary goal of this assessment flow is to:",
    options: ["Evaluate talent fairly step by step", "Collect random uploads only", "Delay candidates", "Test internet speed only"],
    answer: "Evaluate talent fairly step by step",
  },
];

const cloneBankWithPrefix = (items = [], prefix = "q") =>
  items.map((item, index) => ({
    ...item,
    id: `${prefix}${index + 1}`,
  }));

export const defaultQuizBanks = {
  [ASSESSMENT_TYPES.RAJA_QUEEN]: cloneBankWithPrefix(baseQuizQuestionBank, "rq_q"),
  [ASSESSMENT_TYPES.RAJA_KUMARI]: cloneBankWithPrefix(
    baseQuizQuestionBank.map((q) => ({
      ...q,
      question: q.question.replace("Raja Queen", "Raja Kumari"),
    })),
    "rk_q"
  ),
  [ASSESSMENT_TYPES.DRAWING_SENIOR]: cloneBankWithPrefix(
    baseQuizQuestionBank.map((q) => ({
      ...q,
      question: q.question.replace("Cultural attire round", "Drawing presentation round"),
    })),
    "ds_q"
  ),
  [ASSESSMENT_TYPES.DRAWING_JUNIOR]: cloneBankWithPrefix(
    baseQuizQuestionBank.map((q) => ({
      ...q,
      question: q.question.replace("online assessment", "junior drawing assessment"),
    })),
    "dj_q"
  ),
};

export const QUIZ_DURATION_SECONDS = 5 * 60;

export const shuffleArray = (items = []) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const buildShuffledQuiz = (assessmentType, questionBank = null) => {
  const selectedBank =
    Array.isArray(questionBank) && questionBank.length
      ? questionBank
      : defaultQuizBanks[assessmentType] || baseQuizQuestionBank;
  const shuffledQuestions = shuffleArray(selectedBank).slice(0, 15);
  return shuffledQuestions.map((q, index) => {
    const options = shuffleArray(q.options);
    return {
      ...q,
      questionNo: index + 1,
      options,
    };
  });
};
