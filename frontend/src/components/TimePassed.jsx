// import React from 'react'

// export const TimePassed = () => {
  
//   return (
//     <div>nnn</div>
//   )
// }

//   function formatTimestamp(timestamp) {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const yesterday = new Date(now);
//     yesterday.setDate(now.getDate() - 1);

//     if (date.toDateString() === now.toDateString()) {
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } else if (date.toDateString() === yesterday.toDateString()) {
//       return `Yesterday ${date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })}`;
//     } else {
//       return new Intl.DateTimeFormat("de-DE", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       })
//         .format(date)
//         .replace(",", "");
//     }
//   }
