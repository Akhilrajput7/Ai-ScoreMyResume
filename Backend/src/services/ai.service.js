// require("dotenv").config();
// const { GoogleGenAI } = require("@google/genai");
// const z = require("zod");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// // async function invokeGeminiAi(){
// //   const response =  await ai.models.generateContent({
// //      model:"gemini-2.5-flash",
// //     contents:"Hello gemini! Explain what is interview ?"
// //    });

// //   console.log(response.text);
// // }

// const interviewReportSchema = z.object({
//   matchScore: z
//     .number()
//     .describe(
//       "A score between 0 and 100 indicating how well the candidate's resume and self-description match the job description.",
//     ),

//   technicalQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can asked in the interview"),
//         intention: z
//           .string()
//           .describe(
//             "The intention of  interviwer behind asking this  question",
//           ),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question, what points to cover , what approach to take while answering this question etc.",
//           ),
//       }),
//     )
//     .describe(
//       "Technical questions that can be asked in the interview alog with their intention.",
//     ),

//   behavioralQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The behavioral question can asked in the interview"),
//         intention: z
//           .string()
//           .describe(
//             "The intention of  interviwer behind asking this  question",
//           ),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question, what points to cover , what approach to take while answering this question etc.",
//           ),
//       }),
//     )
//     .describe(
//       "Behavioral questions that can be asked in the interview along with their intention.",
//     ),

//   skillGap: z
//     .array(
//       z.object({
//         skill: z
//           .string()
//           .describe(
//             "The skill that the candidate is lacking or needs improvement",
//           ),
//         severity: z
//           .enum(["low", "medium", "high"])
//           .describe(
//             "The severity of the skill gap, indicating how critical it is for the candidate to improve this skill",
//           ),
//       }),
//     )
//     .describe(
//       "List of skills that the candidate needs to improve along with their severity.",
//     ),

//   preparationPlan: z
//     .array(
//       z.object({
//         day: z
//           .number()
//           .describe("The day number in the preparation plan , starting from 1"),
//         focus: z
//           .string()
//           .describe(
//             "The main focus or topic for this day in the preparation plan e.g. Data Structures, System Design, Behavioral Questions etc.",
//           ),
//         tasks: z
//           .array(z.string())
//           .describe(
//             "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book, solve a set of problems, watch a tutorial video etc.",
//           ),
//       }),
//     )
//     .describe(
//       "A day-wise preparation plan for the candidate to follow in order to improve their skills and prepare for the interview.",
//     ),
// });

// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   const prompt = `Generate a interview report for the candidate with the following details:
//      - Resume: ${resume}
//      - Self-Description: ${selfDescription}
//      - Job Description: ${jobDescription}
//    `;
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: interviewReportSchema,
//     },
//   });

//   console.log("Interview Report:", JSON.parse(response.text));
// }

// module.exports = generateInterviewReport;

require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Plain inline schema — Gemini rejects Zod-generated schemas because
// Zod produces $defs/$ref which the Gemini API does not support.
const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate's resume and self-description match the job description.",
    },
    technicalQuestions: {
      type: "array",
      description:
        "Technical questions that can be asked in the interview along with their intention.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The technical question that can be asked in the interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of the interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question, what points to cover, what approach to take while answering this question etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      description:
        "Behavioral questions that can be asked in the interview along with their intention.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The behavioral question that can be asked in the interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of the interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question, what points to cover, what approach to take while answering this question etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGap: {
      type: "array",
      description:
        "List of skills that the candidate needs to improve along with their severity.",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description:
              "The skill that the candidate is lacking or needs improvement",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description:
              "The severity of the skill gap, indicating how critical it is for the candidate to improve this skill",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description:
        "A day-wise preparation plan for the candidate to follow in order to improve their skills and prepare for the interview.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description:
              "The day number in the preparation plan, starting from 1",
          },
          focus: {
            type: "string",
            description:
              "The main focus or topic for this day, e.g. Data Structures, System Design, Behavioral Questions etc.",
          },
          tasks: {
            type: "array",
            description:
              "List of tasks to be done on this day, e.g. read a specific book, solve a set of problems, watch a tutorial video etc.",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGap",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate an interview report for the candidate with the following details:
     - Resume: ${resume}
     - Self-Description: ${selfDescription}
     - Job Description: ${jobDescription}
   `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  return JSON.parse(response.text);
}

module.exports = generateInterviewReport;
