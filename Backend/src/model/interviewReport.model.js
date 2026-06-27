const mongoose = require("mongoose");

/**
 * -job description : String
 * -resume text : String
 * -self description : String
 * - Matchscore : Number
 *
 * -Technical questions :
 *     [{
 *       question:"",
 *       intention:"",
 *       answer:"",
 *     }]
 * -Behavioral questions :
 *      [{
 *       question:"",
 *       intention:"",
 *       answer:"",
 *       }]
 * -skill gap :
 *        [{
 *          skill:"",
 *          severity:{
 *                    type:String,
 *                    enum:["low" ,"medium" , "high"]
 *                  }
 *         }]
 * -preparation plan :
 *                   [{
 *                       day:number,
 *                       focus:String,
 *                       tasks: [string],
 *                    }]
 */

const TechnicalQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical Questions is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: string,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlan = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "day is required"],
  },
  focus: {
    type: String,
    required: [true, "focus is required"],
  },
  tasks: [
    {
      type: String,
      required: [true, "task is required"],
    },
  ],
});

const behavioralQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical Questions is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: string,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  },
);

const interViewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  TechnicalQuestions: [TechnicalQuestionsSchema],
  behavioralQuestions: [behavioralQuestionsSchema],
  skillGap: [skillGapSchema],
  preparationPlan: [preparationPlan], 
});

const InterviewReportModel = mongoose.model( "InterviewReport", interViewReportSchema);

module.exports = InterviewReportModel;
