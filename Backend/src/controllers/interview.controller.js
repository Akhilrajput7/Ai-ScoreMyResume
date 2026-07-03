const pdfParse =  require("pdf-parse")
const generateInterviewReport =  require("../services/ai.service");
const { resume } = require("react-dom/server");
const interviewReportModel =  require("../model/interviewReport.model")


async function generateInterViewReportController(req , res){
  const resumeContent =  await (new pdfParse.PDFParse(  Uint8Array.from(req.file.buffer))).getText();
  const {selfDescription,jobDescription} = req.body;

  const interviewReportByAi =  await generateInterviewReport({
    resume:resumeContent.text,
    selfDescription,
    jobDescription,
  })

  console.log(interviewReportByAi);

  const interviewReport =  await interviewReportModel.create({
    user:req.user.id,
    resume:resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  })

  // console.log(interviewReport);

  res.status(201).json({
    message:"Interview Report generated successfully",
    interviewReport
  })
}

module.exports  = {generateInterViewReportController};

