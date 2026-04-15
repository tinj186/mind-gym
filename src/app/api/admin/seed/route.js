// Add this inside your seed function
await prisma.attemptLog.create({
  data: {
    studentId: "some-student-id", // You'll need an actual user ID here
    questionId: "some-question-id",
    studentAnswer: "80",
    isCorrect: false,
    defectCode: "CALCULATION_ERROR" 
  }
});