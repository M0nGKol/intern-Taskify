import { sendInviteEmail } from "@/lib/email";
import React from "react";

export default async function page() {
  // chan.ekmongkol24@kit.edu.kh
  // await sendInviteEmail(
  //   "chanekmongkol@gmail.com",
  //   "Test",
  //   "admin",
  //   "http://localhost:3000/invite/123"
  // );
  // console.log(sendMail);
  return (
    <div>
      <h1>Notes</h1>
      <p>Send mail: </p>
    </div>
  );
}
