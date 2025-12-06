// import { IOption } from "@/types/options";

// export const getInterviewPopupFields = (
//   interviewData: {
//     date: string;
//     time: string;
//     duration: string;
//   },
//   setInterviewData: (data: Partial<typeof interviewData>) => void,
//   durationOptions: IOption[]
// ) => {
//   return [
//     {
//       id: "date",
//       label: "Date",
//       type: "date",
//       value: interviewData.date,
//       onChange: (v: string) => setInterviewData({ date: v }),
//     },
//     {
//       id: "duration",
//       label: "Select Duration",
//       placeholder: "Select duration",
//       options: durationOptions,   // must be IOption[]
//       value: interviewData.duration,
//       onChange: (v: string) => setInterviewData({ duration: v }),
//     },
//     {
//       id: "time",
//       label: "Time",
//       type: "time",
//       value: interviewData.time,
//       onChange: (v: string) => setInterviewData({ time: v }),
//     },
//   ];
// };
